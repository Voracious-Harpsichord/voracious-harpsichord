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

# Write a new entry into the users table
def make_new_user(username, password):
    # hash password

    # make new user entry

    # add new user entry to the table
    return None

# Verify that user exists in user table, returning true or false
def verify_user(username, password):
    # lookup user by user name
        #return false if user does not exist

    # compare (hashed) input password to hashed value stored in table

    # return true or false for the passwords matching
    return None

# Get user id from username
def get_user_id(username):
    # lookup user in table by username

    # return user id of user
    return None

# Add a sessions cookie on to the
def create_session(response):
    #Attach session-cookie to response
    return None

# Verify that request has session-cookie to continue
def verify_session(request):
    #Check for session-cookie and return true or false
    return None

# Remove the sessions
def destroy_session(response):
    # Destory session-cookie
    return None

