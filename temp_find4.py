import urllib.request
url = 'https://booking-flow-production-c.squarecdn.com/assets/indexStreamingBody-CTRoZxds.js'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
content = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
idx = 0
while True:
    idx = content.find('qo=', idx)
    if idx == -1: break
    print('FOUND qo= at', idx)
    print(content[max(0, idx-50):min(len(content), idx+200)])
    idx += 3
