import json
all_products = []
start = 100000
end = 500000
step = 500
for P in range(start, end, step):
    try:
        sub_file_name = "sephoraProducts"+ str(P) +"-"+ str(P + step -1) +".json"
        sub_file = open(sub_file_name, "r")
        sub_products = json.loads(sub_file.read())
        sub_file.close()
        all_products = all_products + sub_products
    except:
        print("missing: "+ sub_file_name)

all_file_name = "sephoraProductsBlock"+ str(start) +"-"+ str(end-1) +".json"
print("saving: "+ str(len(all_products)) +" products to "+ all_file_name)
all_file = open(all_file_name, "w")
all_file.write(json.dumps(all_products))
all_file.close()