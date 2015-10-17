from flask import jsonify

def signup(username,password,method):
	return jsonify(username=username,password=password,method=method)
def login(username,password,method):
	return jsonify(username=username,password=password,method=method)

