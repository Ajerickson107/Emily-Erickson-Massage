import urllib.request, re
url = 'https://booking-flow-production-c.squarecdn.com/assets/indexStreamingBody-CTRoZxds.js'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
content = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
pos = 0
while True:
    idx = content.find('/services/', pos)
    if idx == -1: break
    print('FOUND AT', idx)
    print(content[max(0, idx-50):min(len(content), idx+500)])
    print('='*50)
    pos = idx + 10
