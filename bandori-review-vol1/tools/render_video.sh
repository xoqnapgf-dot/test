#!/usr/bin/env bash
# Render the page to 1080×1920 / 30 fps MP4: three parts in parallel (cut at section starts), each with
# its slice of assets/audio.mp3, plus the joined full video.
#   bash tools/render_video.sh <outdir>
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=${1:?outdir}; mkdir -p "$OUT"
export NODE_PATH=${NODE_PATH:-$(npm root -g)}
read -r DUR CUT1 CUT2 < <(node -e "
global.window={};eval(require('fs').readFileSync('assets/timeline.js','utf8'));
const S=Object.fromEntries(window.TL.sections.map(s=>[s.id,s])), f=x=>(Math.round(x*30)/30).toFixed(4);
console.log(f(window.TL.dur), f(S.ars.t0 + 0.6), f(S.roselia.t0 + 0.6));")
echo "duration $DUR  cuts $CUT1 $CUT2"
parts=("0 $CUT1" "$CUT1 $CUT2" "$CUT2 $DUR")
for i in 0 1 2; do
  set -- ${parts[$i]}
  node tools/render.mjs video "$OUT/v$((i+1)).mp4" "$1" "$2" 30 > "$OUT/log$((i+1)).txt" 2>&1 &
done
wait
for i in 0 1 2; do
  set -- ${parts[$i]}
  ffmpeg -loglevel error -y -i "$OUT/v$((i+1)).mp4" -ss "$1" -to "$2" -i assets/audio.mp3 -map 0:v -map 1:a \
    -c:v copy -c:a aac -b:a 160k -shortest -movflags +faststart "$OUT/邦多利角色个人向点评-上-part$((i+1)).mp4"
done
printf "file '%s'\n" v1.mp4 v2.mp4 v3.mp4 > "$OUT/list.txt"
ffmpeg -loglevel error -y -f concat -safe 0 -i "$OUT/list.txt" -i assets/audio.mp3 -map 0:v -map 1:a -c:v copy -c:a copy \
  -movflags +faststart "$OUT/邦多利角色个人向点评-上-完整版.mp4"
ls -la "$OUT"/*.mp4
