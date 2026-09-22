import urllib.request
url = 'https://booking-flow-production-c.squarecdn.com/assets/indexStreamingBody-CTRoZxds.js'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
content = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
matches = []
pos = 0
target = 'qo'
while True:
    idx = content.find(target, pos)
    if idx == -1: break
    # check boundaries
    b_before = not content[idx-1].isalnum() and content[idx-1] not in ['_', '$']
    b_after = not content[idx+2].isalnum() and content[idx+2] not in ['_', '$']
    if b_before and b_after:
        matches.append(idx)
    pos = idx + 2
print('Exact qo identifier occurrences:', len(matches))
for m in matches[:10]:
    print(content[max(0, m-30):min(len(content), m+50)])
    print('---')
