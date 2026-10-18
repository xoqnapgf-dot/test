#!/usr/bin/env bash
# Render the page to a 30 fps MP4 with its audio: three slices in parallel (cut at section starts), then joined.
#   bash tools/render_video.sh <outdir> [p=1080] [crf=19]     (p = the short side: 720 → 720×1280)
# e.g. `bash tools/render_video.sh out 720 25` for a phone-sized 720×1280 file.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=${1:?outdir}; mkdir -p "$OUT"
export RENDER_P=${2:-1080} RENDER_CRF=${3:-19}
export NODE_PATH=${NODE_PATH:-$(npm root -g)}
read -r DUR CUT1 CUT2 < <(node -e "
global.window={};eval(require('fs').readFileSync('assets/timeline.js','utf8'));
const S=Object.fromEntries(window.TL.sections.map(s=>[s.id,s])), f=x=>(Math.round(x*30)/30).toFixed(4);
console.log(f(window.TL.dur), f(S.anon.t0 + 0.6), f(S.uika.t0 + 0.6));")
echo "duration $DUR  cuts $CUT1 $CUT2  p $RENDER_P  crf $RENDER_CRF"
parts=("0 $CUT1" "$CUT1 $CUT2" "$CUT2 $DUR")
for i in 0 1 2; do
  set -- ${parts[$i]}
  node tools/render.mjs video "$OUT/v$((i+1)).mp4" "$1" "$2" 30 > "$OUT/log$((i+1)).txt" 2>&1 &
done
wait
printf "file '%s'\n" v1.mp4 v2.mp4 v3.mp4 > "$OUT/list.txt"
ffmpeg -loglevel error -y -f concat -safe 0 -i "$OUT/list.txt" -i assets/audio.mp3 -map 0:v -map 1:a -c:v copy -c:a aac -b:a 128k -shortest \
  -movflags +faststart "$OUT/邦多利角色个人向点评-下-${RENDER_P}p.mp4"
ls -la "$OUT"/*.mp4
