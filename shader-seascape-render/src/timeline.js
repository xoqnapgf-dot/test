/* The film: 96 seconds, nine chapters, one continuous move.
 *
 * The spine is the pipeline itself. Chapter n is step n of the shader, so the picture is
 * built in the same order the code runs: rays, terrain, light, atmosphere, water,
 * reflection, clouds, grade. Nothing is asserted that the renderer does not do - every
 * number that appears on screen is either read back from the GPU or printed straight
 * from the same source of truth in this file.
 *
 * The camera never cuts. It is one Catmull-Rom move through ten keyframes, slow enough
 * that the sea keeps moving inside the frame while the frame itself moves.
 *
 * Everything the film touches is a key in the renderer's state object, so any frame can
 * be reproduced exactly: __probe.frameAt(t) rebuilds it, and that is how the stills in
 * shots/ were made.
 *
 *   chapters : 01 射线  02 地形  03 光照  04 大气  05 海面  06 反射  07 云  08 合成  09 实时
 */
(function () {
  'use strict';
  var SS = (window.SS = window.SS || {});

  function clamp(x, a, b) { return x < a ? a : (x > b ? b : x); }
  function sat(x) { return clamp(x, 0, 1); }
  function smoothstep(a, b, x) { var t = sat((x - a) / (b - a)); return t * t * (3 - 2 * t); }
  function mix(a, b, t) { return a + (b - a) * t; }

  // ---------------------------------------------------------------- chapters
  var CHAPTERS = [
    { num: '01', title: '射线',   sub: '这一帧由什么组成',       t0: 0.0,  t1: 10.5 },
    { num: '02', title: '地形',   sub: '分形高度场',             t0: 10.5, t1: 21.0 },
    { num: '03', title: '光照',   sub: '法线、材质与阴影',       t0: 21.0, t1: 31.5 },
    { num: '04', title: '大气',   sub: '瑞利、米氏与臭氧',       t0: 31.5, t1: 42.0 },
    { num: '05', title: '海面',   sub: '淹没、波浪与吸收',       t0: 42.0, t1: 52.5 },
    { num: '06', title: '反射',   sub: '菲涅耳与太阳的光路',     t0: 52.5, t1: 63.0 },
    { num: '07', title: '云',     sub: '体噪声与太阳遮挡',       t0: 63.0, t1: 73.5 },
    { num: '08', title: '合成',   sub: 'ACES、泛光与暗角',       t0: 73.5, t1: 84.0 },
    { num: '09', title: '实时',   sub: '回到第一步',             t0: 84.0, t1: 96.0 }
  ];
  var DURATION = CHAPTERS[CHAPTERS.length - 1].t1;

  // ---------------------------------------------------------------- camera
  /* Ten keyframes, all of them over water or high above the land, checked against the
     height field with tools/terrainmap.mjs. Keys hold a position, a look target and a
     field of view; the target is interpolated in space, which keeps the pan smooth and
     avoids the wrap-around an azimuth angle would have at 0/360. */
  /* Authored as a position and a *heading*, not as two points in space: interpolating a
     look target that is 5 km away swings the camera through arcs nobody asked for, which
     is what made the opening chapter pan 180 degrees in five seconds. Every key carries
     (x, z, altitude, azimuth, pitch, fov); azimuth 0 looks at +Z (inland), 180 looks out
     to sea, and the sun sits near azimuth 196. The look target is then placed 20 km along
     the heading, far enough that the pan speed follows the heading and nothing else. */
  /* The flight, and what each chapter has to be *looking at*. The land is north (+Z), the
     water south, the sun at azimuth 196 / elevation 9.5 deg. An earlier path kept the camera
     out over the water facing the sun for the first five chapters: every frame was then a
     specular wall and the mountains - the subject of chapters 02 to 04 - were never in shot.
     Now the camera works along the coast: land on one side, water on the other, and the sun
     deliberately placed - out of frame but raking across the slopes for 02/03, near the right
     edge for 04, behind the camera for the low water pass in 05, and finally in frame for the
     reflection and cloud chapters, which are the two that are about the sun itself. */
  var KEYS = [
    { t: 0.0,  x:  2600, z: -2500, y:  900, azi: 128, pitch: -3, fov: 50 },
    { t: 10.5, x:  1900, z: -2200, y:  540, azi:  62, pitch: -2, fov: 50 },
    /* Chapter 03 explains normals, materials and shadows - so it has to be looking at the
       mountains. The old key at 96 degrees had the camera turning out to sea exactly while
       the chapter talked about slope and albedo, and eight of its ten seconds were an empty
       horizon (a full-quality stamp at 26 s was the whole sea). The camera now dollies west
       along the shore with the range in frame, and the turn to the sunset happens in chapter
       05, where the sea arrives and the turn is the transition. */
    { t: 21.0, x:  1400, z: -2700, y:  560, azi:  70, pitch: -1, fov: 48 },
    { t: 26.5, x:   600, z: -2860, y:  640, azi:  58, pitch:  0, fov: 48 },
    { t: 31.5, x:  -300, z: -3020, y:  700, azi:  46, pitch:  1, fov: 48 },
    { t: 42.0, x:  1600, z: -2100, y:   70, azi:  44, pitch: -4, fov: 50 },
    { t: 52.5, x:   900, z: -2300, y:   26, azi: 196, pitch: -3, fov: 54 },
    { t: 63.0, x:   100, z: -2400, y:  260, azi: 190, pitch:  8, fov: 52 },
    { t: 73.5, x: -1200, z: -3300, y: 1150, azi: 140, pitch: -2, fov: 48 },
    { t: 84.0, x: -2200, z: -3700, y: 1700, azi: 128, pitch: -4, fov: 46 },
    { t: 96.0, x:  2600, z: -2500, y:  900, azi: 128, pitch: -3, fov: 50 }
  ];
  var LOOK_DIST = 20000;                      // metres along the heading
  var DEG = Math.PI / 180;
  function headingLook(k, dist) {
    var a = k.azi * DEG, p = k.pitch * DEG, c = Math.cos(p);
    return [k.x + dist * Math.sin(a) * c, k.y + dist * Math.sin(p), k.z + dist * Math.cos(a) * c];
  }




  /* Monotone cubic in time. A plain Catmull-Rom overshoots: between the 18 m and the 14 m
     key of the sea chapter the camera dipped to -22 m, i.e. under the water. Fritsch-Carlson
     tangents (zero at every local extremum, clamped so no segment can overshoot its own
     endpoints) make that impossible, and the curve is periodic so the film can loop. */
  function tangents(keys, get) {
    var n = keys.length, s = new Array(n - 1), m = new Array(n);
    for (var i = 0; i < n - 1; i++) s[i] = (get(keys[i + 1]) - get(keys[i])) / Math.max(1e-6, keys[i + 1].t - keys[i].t);
    for (var j = 0; j < n; j++) {
      var sp = j === 0 ? s[n - 2] : s[j - 1];          // periodic: the segment before key 0
      var sn = j === n - 1 ? s[0] : s[j];
      if (sp === 0 || sn === 0 || (sp > 0) !== (sn > 0)) { m[j] = 0; continue; }
      var mm = (sp + sn) * 0.5;
      var lim = 3 * Math.min(Math.abs(sp), Math.abs(sn));
      m[j] = Math.abs(mm) > lim ? Math.sign(mm) * lim : mm;
    }
    return m;
  }
  var TANG = null;
  var COMP = ['x', 'z', 'y', 'azi', 'pitch', 'fov'];
  function buildTangents() {
    TANG = {};
    for (var i = 0; i < COMP.length; i++) {
      TANG[COMP[i]] = tangents(KEYS, (function (c) { return function (k) { return k[c]; }; })(COMP[i]));
    }
  }

  function spline(t) {
    if (!TANG) buildTangents();
    var n = KEYS.length, i = 0;
    while (i < n - 2 && t > KEYS[i + 1].t) i++;
    var a = KEYS[i], b = KEYS[i + 1];
    var dt = Math.max(1e-6, b.t - a.t), u = clamp((t - a.t) / dt, 0, 1);
    var u2 = u * u, u3 = u2 * u;
    var h00 = 2 * u3 - 3 * u2 + 1, h10 = u3 - 2 * u2 + u;
    var h01 = -2 * u3 + 3 * u2, h11 = u3 - u2;
    var out = {};
    for (var k = 0; k < COMP.length; k++) {
      var c = COMP[k];
      out[c] = h00 * a[c] + h10 * (TANG[c][i] * dt) + h01 * b[c] + h11 * (TANG[c][i + 1] * dt);
    }
    out.pos = [out.x, out.y, out.z];
    out.look = headingLook(out, LOOK_DIST);
    return out;
  }

  function rotatedLook(pos, look, yaw, pitch) {
    if (!yaw && !pitch) return look;
    var d = [look[0] - pos[0], look[1] - pos[1], look[2] - pos[2]];
    var len = Math.sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]) || 1;
    var y = yaw * Math.PI / 180, cy = Math.cos(y), sy = Math.sin(y);
    var x = d[0] * cy + d[2] * sy, z = -d[0] * sy + d[2] * cy;   // yaw about world up
    var p = pitch * Math.PI / 180, cp = Math.cos(p), sp = Math.sin(p);
    var horiz = Math.sqrt(x * x + z * z);
    var y2 = d[1] * cp + horiz * sp;
    horiz = horiz * cp - d[1] * sp;
    var s = horiz / Math.max(1e-6, Math.sqrt(x * x + z * z));
    return [pos[0] + x * s, pos[1] + y2, pos[2] + z * s];
  }

  // ---------------------------------------------------------------- captions
  /* Cue by cue. A cue is one sentence; the caption layer gives each token its own slice
     of the cue, so the line lights up as it is read. Text supports <em>, <num>, <unit>
     and <caveat>, which map onto the classes the style sheet already defines. */
  var CUES = [
    // 01 射线
    { t0: 0.5,  t1: 3.6,  text: '每个像素，一条射线。', sub: '01 射线' },
    { t0: 3.9,  t1: 5.8,  text: '方向由视点与画面坐标决定。', sub: '01 射线' },
    { t0: 6.0,  t1: 8.2,  text: '射线与地形的交点，就是这一帧的<em>纵深</em>。', sub: '01 射线' },
    { t0: 8.4,  t1: 10.3, text: '没有模型文件：山与海都是射线的交点。', sub: '01 射线' },
    // 02 地形
    { t0: 10.8, t1: 13.6, text: '高度场由分形噪声堆叠。', sub: '02 地形' },
    { t0: 13.8, t1: 16.6, text: '<em>fBm</em> 打底，脊状噪声塑形。', sub: '02 地形' },
    { t0: 16.8, t1: 18.8, text: '沿射线步进：步长随距离增大。', sub: '02 地形' },
    { t0: 19.0, t1: 20.8, text: '直到穿过地表。', sub: '02 地形' },
    // 03 光照
    { t0: 21.3, t1: 24.0, text: '邻居像素的高度差，给出<em>法线</em>。', sub: '03 光照' },
    { t0: 24.2, t1: 27.0, text: '法线点乘太阳方向，就是漫反射的明暗。', sub: '03 光照' },
    { t0: 27.2, t1: 29.2, text: '坡度与高度决定材质：岩、草、沙。', sub: '03 光照' },
    { t0: 29.4, t1: 31.3, text: '背风处再向太阳采样：这是<em>阴影</em>。', sub: '03 光照' },
    // 04 大气
    { t0: 31.8, t1: 34.6, text: '瑞利散射与波长的四次方成反比。', sub: '04 大气' },
    { t0: 34.8, t1: 37.6, text: '它把<em>蓝色</em>留在了天上。', sub: '04 大气' },
    { t0: 37.8, t1: 39.8, text: '米氏散射来自气溶胶，把<em>金</em>留在太阳附近。', sub: '04 大气' },
    { t0: 40.0, t1: 41.8, text: '穿过的大气越厚，光越红。', sub: '04 大气' },
    // 05 海面
    { t0: 42.3, t1: 44.6, text: '海平面是一条水平线。', sub: '05 海面' },
    { t0: 44.8, t1: 47.6, text: '它以下的地形被淹没：山谷成为<em>海湾</em>，山脊成为岛。', sub: '05 海面' },
    { t0: 47.8, t1: 50.0, text: '水面由按风速分布的波叠加。', sub: '05 海面' },
    { t0: 50.2, t1: 52.3, text: '波高随尺度衰减，风向决定波峰走向。', sub: '05 海面' },
    // 06 反射
    { t0: 52.8, t1: 55.6, text: '掠射角下，<em>菲涅耳反射</em>更强。', sub: '06 反射' },
    { t0: 55.8, t1: 58.6, text: '水面映出天空与云——这些都不是贴图。', sub: '06 反射' },
    { t0: 58.8, t1: 60.8, text: '太阳的镜面高光，碎成一条光路。', sub: '06 反射' },
    { t0: 61.0, t1: 62.8, text: '浪越碎，光路越宽。', sub: '06 反射' },
    // 07 云
    { t0: 63.3, t1: 66.0, text: '云，是三维噪声里的一块稠密区。', sub: '07 云' },
    { t0: 66.2, t1: 69.0, text: '每一步都朝太阳再采样一次。', sub: '07 云' },
    { t0: 69.2, t1: 71.4, text: '哪里被遮住，哪里就暗。', sub: '07 云' },
    { t0: 71.6, t1: 73.3, text: '相位函数把<em>金边</em>留在背光的一侧。', sub: '07 云' },
    // 08 合成
    { t0: 73.8, t1: 76.6, text: '实时画面的亮度，远超屏幕能显示的范围。', sub: '08 合成' },
    { t0: 76.8, t1: 79.6, text: '<em>ACES</em> 把高光卷回白色，而不是硬切。', sub: '08 合成' },
    { t0: 79.8, t1: 82.0, text: '泛光把明亮处向四周溢出。', sub: '08 合成' },
    { t0: 82.2, t1: 83.8, text: '颗粒与暗角，把画面收束。', sub: '08 合成' },
    // 09 实时
    { t0: 84.4, t1: 87.6, text: '九个步骤，一条射线，一片海。', sub: '09 实时' },
    { t0: 87.8, t1: 90.8, text: '全部实时计算。', sub: '09 实时' },
    { t0: 91.0, t1: 93.4, text: '没有模型文件，没有贴图，没有视频。', sub: '09 实时' },
    { t0: 93.6, t1: 95.9, text: '每一帧，都从头算一遍。', sub: '09 实时' }
  ];

  // ---------------------------------------------------------------- cards
  /* One card is one step: what it does, the formula it implements, and where the method
     comes from. Positions are fractions of the frame; 0.5/0.5 is the middle, and the
     bottom fifth is left free for the caption. */
  var CARDS = [
    { chapter: 0, at: [0.665, 0.185], h: 'STEP 01 · 射线',
      body: '每帧 <num>0.9</num>–<num>2.1</num> <unit>M</unit> 条射线，每条独立求交。',
      formula: 'rd = normalize(fwd + right·x + up·y)', src: '针孔相机模型' },
    { chapter: 1, at: [0.045, 0.185], h: 'STEP 02 · 地形',
      body: '16 km 瓦片，512² 高度场，外围是程序化远山。',
      formula: 'h = fBm(q) + ridged(q)^1.35', src: 'Inigo Quilez, terrain marching' },
    { chapter: 2, at: [0.665, 0.185], h: 'STEP 03 · 光照',
      body: '邻居差分求法线；材质随坡度与高度混合。',
      formula: 'L = albedo/π · (E_sun·N·L + E_sky)', src: 'Lambert 1760 · Bruneton 2008' },
    { chapter: 3, at: [0.045, 0.185], h: 'STEP 04 · 大气',
      body: '单次散射加二阶多次散射，烘焙进 <num>256×128</num> 查找表。',
      formula: 'L = ∫ T·σs·P(θ)·T_sun·E dz', src: 'Bruneton 2008 · Kasten & Young 1989' },
    { chapter: 4, at: [0.665, 0.185], h: 'STEP 05 · 海面',
      body: '波浪的斜率方差按风速分布；白冠随风速三次方增长。',
      formula: 'mss = 0.003 + 5.12e-3·U', src: 'Cox & Munk 1954 · Monahan 1980' },
    { chapter: 5, at: [0.045, 0.185], h: 'STEP 06 · 反射',
      body: '菲涅耳混合反射与水体；吸收按波长分道。',
      formula: 'F = F0 + (1−F0)(1−cosθ)⁵', src: 'Schlick 1994 · Pope & Fry 1997' },
    { chapter: 6, at: [0.665, 0.185], h: 'STEP 07 · 云',
      body: '128³ 体素与 160 km 天气图；步进中途向太阳再采样。',
      formula: 'T = exp(−σ·Δt)　L += T·σs·P(θ)·E', src: 'Kokhanovsky · Wronski 2014' },
    { chapter: 7, at: [0.045, 0.185], h: 'STEP 08 · 合成',
      body: '高光滚回白色；泛光与暗角只在最后一步出现。',
      formula: 'x·(a·x+b) / (x·(c·x+d)+e)', src: 'Narkowicz 2015 · ACES fit' },
    { chapter: 8, at: [0.665, 0.185], h: 'STEP 09 · 实时',
      body: '每帧重算；分辨率随负载自适应。',
      formula: '自适应分辨率 0.45 – 1.00', src: '本页所有数字均为实时结果' }
  ];

  // ---------------------------------------------------------------- leader lines
  /* A line from the card into the picture, anchored on what the chapter is about.
     Fractions of the frame; measured off the film's own frames. */
  var ANNOTS = [
    { chapter: 0, from: [0.70, 0.30], at: [0.500, 0.46], label: '水平线' },
    { chapter: 1, from: [0.16, 0.30], at: [0.300, 0.52], label: '山脊' },
    { chapter: 2, from: [0.70, 0.30], at: [0.760, 0.56], label: '向阳坡' },
    { chapter: 3, from: [0.16, 0.30], at: [0.500, 0.30], label: '天顶' },
    { chapter: 4, from: [0.70, 0.30], at: [0.330, 0.60], label: '海湾' },
    { chapter: 5, from: [0.16, 0.30], at: [0.480, 0.58], label: '镜面光路' },
    { chapter: 6, from: [0.70, 0.30], at: [0.420, 0.24], label: '金边' },
    { chapter: 7, from: [0.16, 0.30], at: [0.500, 0.44], label: '太阳圆面' },
    { chapter: 8, from: [0.70, 0.30], at: [0.500, 0.50], label: '一条射线' }
  ];

  // ---------------------------------------------------------------- per-chapter look
  /* What a chapter does to the picture. Index into the stage array:
     1 terrain · 2 normals · 3 materials/shadows/AO · 4 atmosphere · 5 water · 7 clouds ·
     8 grade. The stages are ramps, not switches: a layer arriving over half a chapter
     reads as a build, not as a cut. */
  function stagesFor(ch, u) {
    var s = [1, 0, 1, 0, 0, 0, 1, 0, 1];
    var view = 0;
    if (ch === 0) {
      // A ray, a plane, then the first thing the ray hits. The chapter has to *show*
      // this, so it opens on the sky the ray samples, adds the flat sea plane (one
      // intersection, no marching) and only then grows the terrain out of it. An earlier
      // version switched every layer off for the first three seconds and the film opened
      // on an empty gradient.
      s[4] = 1;                                   // the sky is always the backdrop
      s[5] = smoothstep(0.06, 0.34, u);           // the sea plane arrives
      s[1] = smoothstep(0.62, 0.96, u);           // then the marched terrain
      s[3] = 0.12 * s[1];
      s[2] = 1;
      if (u < 0.10) view = 24;                    // the sky alone, for the first beat
    } else if (ch === 1) {
      s[1] = 1; s[2] = 1;
      s[3] = mix(0.10, 0.45, smoothstep(0.0, 1.0, u));
      s[4] = mix(0.0, 0.35, smoothstep(0.2, 1.0, u));
      if (u < 0.13) view = 16;                    // a shorter beat: the field, alone
      else if (u > 0.55 && u < 0.78) view = 27;
    } else if (ch === 2) {
      s[1] = 1;
      s[2] = mix(0.35, 1.0, smoothstep(0.02, 0.30, u));
      s[3] = mix(0.45, 1.0, smoothstep(0.30, 0.95, u));
      s[4] = mix(0.35, 1.0, smoothstep(0.0, 0.6, u));
      if (u < 0.11) view = 3;                     // the normals, before the light lands
      else if (u > 0.50 && u < 0.62) view = 20;
    } else if (ch === 3) {
      s[1] = 1; s[2] = 1; s[3] = 1;
      s[4] = mix(0.06, 1.0, smoothstep(0.0, 0.45, u));
      if (u > 0.30 && u < 0.44) view = 24;
    } else if (ch === 4) {
      s[1] = 1; s[2] = 1; s[3] = 1;
      s[4] = 1;
      s[5] = smoothstep(0.06, 0.55, u);
      if (u > 0.60 && u < 0.72) view = 27;
    } else if (ch === 5) {
      s[1] = 1; s[2] = 1; s[3] = 1; s[4] = 1; s[5] = 1;
      if (u < 0.14) view = 28;
      else if (u < 0.26) view = 29;
    } else if (ch === 6) {
      s[1] = 1; s[2] = 1; s[3] = 1; s[4] = 1; s[5] = 1;
      s[7] = smoothstep(0.05, 0.55, u);
      if (u > 0.62 && u < 0.72) view = 25;
    } else if (ch === 7) {
      /* Chapter 08's own beat is the stage-8 ramp: the frame starts as the raw HDR clamped
         to the screen and turns into the graded one as the chapter explains it. Opening on
         the weather map (view 30) was a non-sequitur in a chapter about the tonemap. */
      s = [1, 1, 1, 1, 1, 1, 1, smoothstep(0.0, 0.34, u), 1];
    } else {
      s = [1, 1, 1, 1, 1, 1, 1, 1, 1];
    }
    return { stages: s, view: view };
  }

  /* The chapter's own state: keys the film animates that are not stages. Kept short so
     anything the visitor changes in the panel keeps working. */
  function stateFor(ch, u) {
    var o = {};
    // The auto-exposure aims at the frame's mean radiance, so a chapter that is mostly dark
    // water under a specular path reads as a black frame. The bias is the film's own stop,
    // per chapter, ramped so it never jumps.
    o.exposureBias = [1.18, 1.06, 1.02, 1.10, 1.02, 1.85, 1.22, 1.0, 1.0][ch];
    if (ch === 0) {
      o.haze = 0.0;
      o.cloudCover = 0.0;
    } else if (ch === 1) {
      o.haze = 0.0;
      o.cloudCover = 0.0;
    } else if (ch === 2) {
      o.haze = mix(0.0, 0.25, smoothstep(0.0, 1.0, u));
      o.cloudCover = 0.0;
    } else if (ch === 3) {
      o.haze = mix(0.25, 0.5, smoothstep(0.0, 1.0, u));
      o.cloudCover = 0.0;
    } else if (ch === 4) {
      o.haze = 0.5;
      o.cloudCover = 0.0;
      o.waveAmp = mix(0.55, 1.0, smoothstep(0.55, 1.0, u));
    } else if (ch === 5) {
      o.haze = 0.5; o.cloudCover = 0.06;
      o.waveAmp = 1.0;
    } else if (ch === 6) {
      o.haze = 0.5;
      o.cloudCover = mix(0.06, 0.16, smoothstep(0.05, 0.8, u));
    } else if (ch === 7) {
      o.haze = 0.5; o.cloudCover = 0.16;
      o.bloom = mix(0.0, 0.05, smoothstep(0.15, 0.75, u));
      o.grain = mix(0.0, 0.012, smoothstep(0.55, 1.0, u));
    } else {
      o.haze = 0.5; o.cloudCover = 0.16;
      o.bloom = 0.05; o.grain = 0.012;
    }
    return o;
  }

  // ---------------------------------------------------------------- the clock
  function chapterAt(t) {
    for (var i = 0; i < CHAPTERS.length; i++) if (t < CHAPTERS[i].t1) return i;
    return CHAPTERS.length - 1;
  }
  function progress(t) {
    var i = chapterAt(t), c = CHAPTERS[i];
    return { index: i, u: clamp((t - c.t0) / (c.t1 - c.t0), 0, 1), c: c };
  }

  var hue = { sky: 196, cloud: 210, water: 186 };      // palette per layer, for the cards

  SS.timeline = {
    duration: DURATION,
    chapters: CHAPTERS,
    cues: CUES,
    cards: CARDS,
    annots: ANNOTS,
    keys: KEYS,
    cameraAt: function (t) { return spline(t); },      // used by tools/terrainmap.mjs

    /* Called once the renderer is up. Builds the timeline's DOM (chapter marks and the
       chapter list), then opens the film at t. */
    enter: function (t, R, app) {
      this.buildDom();
      app.film = true;
      app.time = (typeof t === 'number' && t >= 0 && t <= DURATION) ? t : 0;
      if (SS.captions) SS.captions.enter(CUES, app);
      if (SS.overlays) SS.overlays.enter(CARDS, ANNOTS, app);
      if (SS.mg) SS.mg.enter(R);
      if (SS.instruments) SS.instruments.enter(R, app);
      this.apply(app.time, R, app, true);
      return true;
    },

    // ------------------------------------------------------------ the main step
    update: function (dt, R, app) {
      app.time += dt * (app.speed === undefined ? 1 : app.speed);
      if (app.time >= DURATION) app.time -= DURATION;
      if (app.time < 0) app.time += DURATION;
      this.apply(app.time, R, app, false);
      R.s.time += dt;
      return true;
    },

    seekTo: function (t, R, app) {
      app.time = ((t % DURATION) + DURATION) % DURATION;
      this.apply(app.time, R, app, true);
      return app.time;
    },

    apply: function (t, R, app, force) {
      var pr = progress(t), ch = pr.index, u = pr.u;
      if (app) app.chapter = ch;
      var cam = spline(t);
      if (app.drag && (app.drag.yaw || app.drag.pitch)) {
        cam.look = rotatedLook(cam.pos, cam.look, app.drag.yaw, app.drag.pitch);
      }
      // Never let the flight end up inside the world: over water the floor is the sea
      // surface, over land it is the ground, and the camera keeps a few metres of margin.
      var floor = Math.max(R.s.seaLevel || 0, R.groundHeight(cam.pos[0], cam.pos[2]));
      if (cam.pos[1] < floor + 6) cam.pos[1] = floor + 6;
      SS.camera.setLookAt(R, cam.pos, cam.look, [0, 1, 0]);
      R.camera.fov = cam.fov + Math.sin((R.s.time || 0) * 0.21) * 0.35;   // a slow breath

      var look = stagesFor(ch, u), st = stateFor(ch, u), k;
      for (k in st) R.s[k] = st[k];
      R.s.view = look.view;
      R.s.debugMix = 1.0;
      R.s.stages = look.stages;
      R.s.sunElev = 9.5;
      R.s.sunAzi = 196;

      if (SS.captions) SS.captions.tick(t, app);
      if (SS.overlays) SS.overlays.setChapter(ch, u, app, R, force);
      if (SS.instruments) SS.instruments.setChapter(ch, u, R, app);
      if (SS.audio) SS.audio.setChapter(ch, u, R, app);
      this.hud(ch, u, force);
      return true;
    },

    // ------------------------------------------------------------ hud
    hud: function (ch, u, force) {
      if (!force && this._lastCh === ch && !(this._titleAt === undefined)) return;
      var c = CHAPTERS[ch];
      var num = document.getElementById('chapterNum');
      var title = document.getElementById('chapterTitle');
      var sub = document.getElementById('chapterSub');
      var block = document.getElementById('titleBlock');
      if (num && this._lastCh !== ch) num.textContent = c.num;
      if (sub && this._lastCh !== ch) sub.textContent = c.sub;
      if (title && this._lastCh !== ch) {
        title.textContent = c.title;
        if (block) {                                   // the title fades on a change
          block.classList.add('titleFade');
          var self = this;
          clearTimeout(this._fadeT);
          this._fadeT = setTimeout(function () { block.classList.remove('titleFade'); }, 60);
        }
      }
      if (this._lastCh !== ch) {
        var btns = document.querySelectorAll('#chapterList button');
        for (var i = 0; i < btns.length; i++) btns[i].classList.toggle('now', i === ch);
        var marks = document.querySelectorAll('#chapterMarks .mark');
        for (var j = 0; j < marks.length; j++) marks[j].classList.toggle('done', j < ch);
        this._lastCh = ch;
      }
    },

    // the playhead and the "near" highlight, once per frame
    tickDom: function (R, app) {
      var f = DURATION ? (app.time / DURATION) : 0;
      var played = document.getElementById('played');
      if (played) played.style.width = (f * 100).toFixed(3) + '%';
      var head = document.getElementById('playhead');
      if (head) head.style.left = (f * 100).toFixed(3) + '%';
      var pr = progress(app.time);
      var marks = document.querySelectorAll('#chapterMarks .mark');
      for (var i = 0; i < marks.length; i++) {
        var c = CHAPTERS[i];
        marks[i].classList.toggle('near', pr.index === i && (app.time - c.t0) < 2.4);
      }
      if (SS.captions) SS.captions.tick(app.time, app);
      if (SS.overlays) SS.overlays.tick(R, app);
      if (SS.instruments) SS.instruments.tick(R, app);
    },

    // ------------------------------------------------------------ dom
    buildDom: function () {
      var list = document.getElementById('chapterList');
      if (list && !list.childNodes.length) {
        for (var i = 0; i < CHAPTERS.length; i++) {
          (function (idx) {
            var b = document.createElement('button');
            b.textContent = CHAPTERS[idx].num + ' ' + CHAPTERS[idx].title;
            b.addEventListener('click', function () {
              if (SS.timeline && SS.app) SS.timeline.seekTo(CHAPTERS[idx].t0 + 0.02, SS.renderer, SS.app);
            });
            list.appendChild(b);
          })(i);
        }
      }
      var marks = document.getElementById('chapterMarks');
      if (marks && !marks.childNodes.length) {
        for (var j = 0; j < CHAPTERS.length; j++) {
          var el = document.createElement('div');
          el.className = 'mark';
          el.style.left = (CHAPTERS[j].t0 / DURATION * 100).toFixed(3) + '%';
          var sp = document.createElement('span');
          sp.textContent = CHAPTERS[j].num + ' ' + CHAPTERS[j].title;
          el.appendChild(sp);
          marks.appendChild(el);
        }
      }
      var track = document.getElementById('track');
      if (track && !track.__wired) {
        track.__wired = true;
        var self = this;
        function seekFrom(ev) {
          var r = track.getBoundingClientRect();
          var cxp = (ev.touches && ev.touches[0] ? ev.touches[0].clientX : ev.clientX);
          var f = sat((cxp - r.left) / Math.max(1, r.width));
          if (!SS.app) return;
          SS.app.playing = false;
          self.seekTo(f * DURATION, SS.renderer, SS.app);
        }
        var dragging = false;
        track.addEventListener('pointerdown', function (ev) { dragging = true; seekFrom(ev); });
        window.addEventListener('pointermove', function (ev) { if (dragging) seekFrom(ev); });
        window.addEventListener('pointerup', function () { dragging = false; });
      }
      return true;
    },

    // used by the free-camera mode and by the probe tools
    detach: function (R, app) {
      if (app) app.film = false;
      R.s.view = 0; R.s.debugMix = 1.0;
      R.s.stages = [1, 1, 1, 1, 1, 1, 1, 1, 1];
      R.s.haze = 0.5; R.s.cloudCover = 0.16; R.s.bloom = 0.05; R.s.grain = 0.012;
      R.s.seaLevel = 0; R.s.waveAmp = 1;
      if (SS.captions) SS.captions.clear();
      if (SS.overlays) SS.overlays.clear();
      if (SS.instruments) SS.instruments.clear();
      this.hud(0, 0, true);
      return true;
    }
  };
  SS.timeline.spline = spline;
  SS.timeline.progress = progress;
  SS.timeline.stagesFor = stagesFor;
  SS.timeline.stateFor = stateFor;
  SS.timeline.hue = hue;
})();
