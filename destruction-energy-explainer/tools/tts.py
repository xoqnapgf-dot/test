"""TTS via edge-tts with the proxy CA. usage: tts.py voice rate outbase text"""
import sys, ssl, asyncio, json, os
import edge_tts, edge_tts.communicate as ec
ec._SSL_CTX = ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
async def main(voice, rate, out, text, pitch='+0Hz'):
    c = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, proxy=os.environ.get('HTTPS_PROXY'), boundary='WordBoundary')
    words = []
    with open(out + '.mp3', 'wb') as f:
        async for ch in c.stream():
            if ch['type'] == 'audio': f.write(ch['data'])
            elif ch['type'] in ('WordBoundary', 'SentenceBoundary'):
                words.append({'t': ch['offset'] / 1e7, 'd': ch['duration'] / 1e7, 'w': ch['text']})
    json.dump(words, open(out + '.json', 'w'), ensure_ascii=False)
asyncio.run(main(*sys.argv[1:]))
