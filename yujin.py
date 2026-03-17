# [商品名, 単価, 売れた個数]
sales_history = [
    ["りんご", 150, 3],
    ["みかん", 100, 5],
    ["りんご", 150, 2],
    ["バナナ", 200, 1],
    ["みかん", 100, 2],
    ["りんご", 150, 4]
]

results={}
for n in range(len(sales_history) ):
    results[sales_history[n][0]]=0

for a,b,c in sales_history : 
    results[a]+= b*c
print(results)


# results[sales_history[0][0]]=sales_history[0][1]*sales_history[0][2]
# print(results)
# for n in range(1,len(sales_history)) :
#     for a,b,c in sales_history[n] :
#         for d,e,f in results :
#             if a == d :
#                 results[a]= results[a] + int(b)*int(c)
#         else :
#             results[a]= int(b)*int(c)

results={}
for name, price, count in sales_history:
    total = price * count
    if name in results:
        total = results[name] + total
    results[name] = total


print(results)
