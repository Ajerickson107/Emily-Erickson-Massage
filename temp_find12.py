import urllib.request
url = 'https://booking-flow-production-c.squarecdn.com/assets/indexStreamingBody-CTRoZxds.js'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
content = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
idx = 1614157
start = idx + content[idx:idx+800].find('x=w=>{')
sub = content[start+40:start+100]
print(repr(sub))
