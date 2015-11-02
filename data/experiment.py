test = [1,58,0,2,54,2,1,0,5,8,2,5,78,1,3,99,9]

res = [0,0,0,0,0]

for t in test:
	nextnum = False
	for index,number in enumerate(res):
		# cascade change
		if nextnum != False:
			temp = res[index] 
			res[index] = nextnum
			nextnum = temp
		elif t>number:
			nextnum = res[index]
			res[index] = t

print res