# Run this file ONCE and ONLY ONCE
# ...Then wait for like a day

#don't forget to pip install requests
import requests
import json
import time

sephora_products = []
#Product IDs seem to exists between 100,000 and 500,000
start = 100000
end = 500000
incremental_dump = 500
window_start = start
p = start
while p < end:
    #courtesy wait before next request
    time.sleep(1)
    r = requests.get("http://www.sephora.com/rest/products/P" + str(p))
    if (r.status_code == 200):
        product = json.loads(r.text)
        print(product.get("id"))
        sephora_products.append(product)
    else:
        print('('+ str(p) +')')
    if p == window_start + incremental_dump-1:
        filename = "sephoraProducts"+ str(window_start) +"-"+ str(p) +".json"
        print("saving results to:" + filename)
        jsonFile = open(filename, "w")
        jsonFile.write(json.dumps(sephora_products))
        jsonFile.close()
        window_start += incremental_dump
        sephora_products = []
    p+= 1
print("done")
exit()