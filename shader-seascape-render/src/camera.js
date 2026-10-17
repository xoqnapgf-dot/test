/* Camera: film mode is driven by the timeline; free mode is the user's hand. */
(function () {
  'use strict';
  var SS = (window.SS = window.SS || {});
  SS.camera = {
    setLookAt: function (R, pos, target, up) {
      var f = [target[0] - pos[0], target[1] - pos[1], target[2] - pos[2]];
      var fl = Math.hypot(f[0], f[1], f[2]) || 1;
      f = [f[0] / fl, f[1] / fl, f[2] / fl];
      var u = up || [0, 1, 0];
      // right = fwd x worldUp, and up = right x fwd. The order matters: the other one
      // (worldUp x fwd) is a perfectly good orthonormal basis too, but it is the 180
      // degree rotated one, which renders the whole frame upside down and mirrored.
      var r = [f[1] * u[2] - f[2] * u[1], f[2] * u[0] - f[0] * u[2], f[0] * u[1] - f[1] * u[0]];
      var rl = Math.hypot(r[0], r[1], r[2]);
      if (rl < 1e-6) {                       // looking straight up or down: pick any right
        var alt = Math.abs(f[1]) > 0.9 ? [0, 0, 1] : u;
        r = [f[1] * alt[2] - f[2] * alt[1], f[2] * alt[0] - f[0] * alt[2], f[0] * alt[1] - f[1] * alt[0]];
        rl = Math.hypot(r[0], r[1], r[2]) || 1;
      }
      r = [r[0] / rl, r[1] / rl, r[2] / rl];
      var uu = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]];
      R.camera.pos = pos.slice();
      R.camera.fwd = f;
      R.camera.right = r;
      R.camera.up = uu;
    }
  };
})();
