#!/usr/bin/env bash
# Cut the first chorus (plus one bar of lead-in and the harmonica interlude) out of the
# full song and bake the fades into the audio.
#
#   tools/cut_audio.sh /path/to/full-song.mov
#
# Times are song time in seconds. They must match CLIP in tools/build_data.py.
#   46.49  downbeat one bar before the chorus (fade-in lasts exactly that bar)
#   51.92  chorus starts (「如果」)
#   83.64  chorus ends (「泪」), harmonica interlude follows
#   93.10  cut, just before verse 2 (「只带着一场梦」) comes in at ~93.3
set -euo pipefail
SRC="${1:?usage: cut_audio.sh <full song audio/video>}"
HERE="$(cd "$(dirname "$0")/.." && pwd)"
START=46.49
END=93.10
FADE_IN=2.61
FADE_OUT=3.40
DUR=$(python3 -c "print(round($END-$START,3))")
OUT_ST=$(python3 -c "print(round($DUR-$FADE_OUT,3))")

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
# Decode first so the cut is sample-accurate, then fade.
ffmpeg -v error -y -i "$SRC" -vn -ac 2 -ar 44100 -c:a pcm_s16le "$TMP/full.wav"
ffmpeg -v error -y -ss "$START" -t "$DUR" -i "$TMP/full.wav" \
  -af "afade=t=in:st=0:d=$FADE_IN:curve=qsin,afade=t=out:st=$OUT_ST:d=$FADE_OUT:curve=esin" \
  -c:a pcm_s16le "$HERE/tools/clip.wav"
ffmpeg -v error -y -i "$HERE/tools/clip.wav" -c:a aac -b:a 192k -movflags +faststart "$HERE/assets/chorus.m4a"
ffmpeg -v error -y -i "$HERE/tools/clip.wav" -c:a libmp3lame -b:a 192k "$HERE/assets/chorus.mp3"
echo "clip: ${DUR}s  ->  assets/chorus.m4a, assets/chorus.mp3 (tools/clip.wav kept for analysis)"
