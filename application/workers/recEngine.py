# make fake data
# userid : [productids , ratings]
# or productid : [userid, ratings]
import time
import json

from db_controller import recommendation_controller as r_ctrl

def similarityIndex1(user1,user2):
	# get all products that users like
	L1 = set()
	L2 =set()
	# get all products that =
	D1 = set()
	D2 = set()

	for review in user1['reviews']:
		if int(review['rating'])>2:
			L1.add(review['productID'])
		else:
			D1.add(review['productID'])
	# print(user2['reviews'])
	for review in user2['reviews']:
		if int(review['rating'])>2:
			L2.add(review['productID'])
		else:
			D2.add(review['productID'])

	# print set.intersection(L1,L2)
	# enforce float
	index = (1.0*len(set.intersection(L1,L2)) + len(set.intersection(D1,D2)) - len(set.intersection(L1,D2)) - len(set.intersection(L2,D1)))/(len(set.union(L1,L2,D1,D2)))

	return index

def similarityIndex2(user1,user2):
	# check if key values are the same
	# c1+c2+c3 =1
	c1=0.3
	c2=0.3
	c3=0.4
	summ = 0

	if 'location' in user1:
		if (user1['location'] != ''):
			if (user1['location'] == user2['location']):
				summ+=c1
	if 'skin_tone' in user1:
		if (user1['skin_tone'] != ''):
			if (user1['skin_tone'] == user2['skin_tone']):
				summ+=c2
	if 'age' in user1:
		if (user1['age'] != ''):
			if (user1['age'] == user2['age']):
				summ+=c3
	return summ/3

# tot sim index
def compoundSimilarityIndex(user1,user2):
	return (similarityIndex1(user1,user2)+similarityIndex2(user1,user2))/2 

def prob_user_likes_product(product,users_who_like,users_who_dislike):
	# sumL sum of similarity indices of users who like product
	# totalL total users who like product
	sumL = 0
	totalL = 0 
	for key in users_who_like:
		sumL += users_who_like[key]
		totalL +=1

	sumD = 0
	totalD = 0 
	# print(users_who_like)
	# print(users_who_dislike)
	for key in users_who_dislike:
		sumD += users_who_dislike[key]
		totalD +=1
	
	return (sumL - sumD)/(totalL + totalD)

# perform lookups on these
# prodID = 'P215930'
def find_prob(productNum,current_user_id):

	# 1885																																										
	# fetch user from database																																																		
	all_prod_likes_file = open('../data/number_all_prod_likes.json','r')
	all_prod_likes = json.loads(all_prod_likes_file.read())
	all_prod_likes_file.close()

	all_users_file = open('../data/number_all_user_reviews.json','r')
	all_users = json.loads(all_users_file.read())
	all_users_file.close()
	counter = 0
	current_user = all_users[str(current_user_id)]

	productIDs = []
	for prod in all_prod_likes:
		counter +=1
		productIDs.append(prod)
		# if counter > 11004:
		if counter > productNum:
			break

	storage = {}
	# keep store here
	# max_value = (0,0)
	# max_value2 = (0,0)
	# max_value3 = (0,0)
	# max_value4 = (0,0)
	# max_value5 = (0,0)
	res = [(0,0),(0,0),(0,0),(0,0),(0,0)]

	for productID in productIDs:
		prod_like_ref = all_prod_likes[productID]
		user_prod_likes = prod_like_ref['L']
		user_prod_dislikes = prod_like_ref['D']

		# user:simIndex
		storage_like_simIndex = {}
		storage_dislike_simIndex = {}
		for name in user_prod_likes:
			# name = str(name)
			b = str(name)
			# print(b)
			user = all_users[b]
			index = compoundSimilarityIndex(current_user,user)
			storage_like_simIndex[b] = index

		for name in user_prod_dislikes:
			# name = str[name]python3
			b = str(name)
			# print(b)
			user = all_users[b]
			index = compoundSimilarityIndex(current_user,user)
			storage_dislike_simIndex[b] = index

		probability = prob_user_likes_product(productID,storage_like_simIndex,storage_dislike_simIndex)

		nextTupl = False
		for index,tupl in enumerate(res):
			# cascade change
			if nextTupl != False:
				temp = res[index] 
				res[index] = nextTupl
				nextTupl = temp
			elif probability>tupl[0]:
				nextTupl = res[index]
				res[index] = (probability,productID)
		# if probability > max_value[1]:
			# max_value = (productID,probability)

		storage[productID] = probability

	#return top 5 in a tuple
	# print(res)
	# unpack and push to db
	for index,tupl in enumerate(res):
		rank = index+1
		product_id = tupl[1]
		user_id = current_user_id
		# save to db
		res = r_ctrl.add_recommendation(user_id, product_id, rank)
		print(res)

	# is async so no need to return 
	return res


# print(productIDs)
# start = time.clock()
# probs  = find_prob(productIDs,current_user)
# print(probs)
# end = time.clock()
# interval = end - start
# print(interval)
# print(probs[1])

# get rid of anons 

# print similarityIndex(sampleUser0,sampleUser1)
# print similarityIndex(sampleUser0,sampleUser3)

# diff is high
# shift info to a mongodb
# make async worker go off and fetch stuff
# make other cool visualizations with data
# a graph of products 

# make new file of usernames removed go through motions and push that up 
# with rec engine