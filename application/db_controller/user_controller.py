from flask import jsonify
#import sqlalchemy
#import Bcrypt for hashing
#import httpAuth for creating session cookies
#import users model

# Stub functions for testing endpoints
def signup(username,password,method):
	return jsonify(username=username,password=password,method=method)
def login(username,password,method):
	return jsonify(username=username,password=password,method=method)

# Write a new entry into the users table and return newly created user_id
def make_new_user(username, password):

# verify_user - Verify that user exists in user table, returning true or false

# create_session - Add a sessions cookie on to the

# destroy_session - Remove the sessions

