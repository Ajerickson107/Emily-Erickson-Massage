import urllib.request
url = 'https://booking-flow-production-c.squarecdn.com/assets/indexStreamingBody-CTRoZxds.js'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
content = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
for func_name in ['qo', 'H1']:
    idx = content.find(func_name + '=')
    if idx != -1:
        print('FUNC ' + func_name + ':')
        print(content[idx:idx+300])
