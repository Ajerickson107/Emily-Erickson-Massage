import urllib.request, re
url = 'https://booking-flow-production-c.squarecdn.com/assets/indexStreamingBody-CTRoZxds.js'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
content = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
matches = [m.start() for m in re.finditer(r'qo\s*=', content)]
for idx in matches:
    print('MATCH:', idx)
    print(content[max(0, idx-20):min(len(content), idx+200)])
