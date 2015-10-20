
from flask import Flask
from flask import jsonify #this may not be needed
#import Bcrypt for hashing
from server import bcrypt
secret = 'secret'
#import users model
from db_models import models
session = models.session
User = models.User


# Stub functions for testing endpoints
def signup(username,password,method):
    return jsonify(username=username,password=password,method=method)
def login(username,password,method):
    return jsonify(username=username,password=password,method=method)

# Write a new entry into the users table
def make_new_user(username, password):
    # hash password
    hashed = bcrypt.generate_password_hash(secret)
    # make new user entry
    # add new user entry to the table
    session.add(User(username, hashed))
    session.commit()
    return None

# Verify that user exists in user table, returning true or false
def verify_user(username, password):
    # lookup user by user name
    user = session.query(User).filter(User.username == username).one()
    #return false if user does not exist
    if not user:
        return False
    # compare (hashed) input password to hashed value stored in table
    # return true or false for the passwords matching
    return bcrypt.check_password_hash(user.pw_hash, password)

# Get user id from username
def get_user_id(username):
    # lookup user in table by usernamed
    # return user id of user
    return session.query(User).filter(User.username == username).one().id

# Add a sessions cookie on to the
def create_session(response):
    #Attach session-cookie to response
    return response.set_cookie('beauty', value='beauty')

# Verify that request has session-cookie to continue
def verify_session(request):
    #Check for session-cookie and return true or false
    return 'beauty' in request.cookies

# Remove the sessions
def destroy_session(response):
    # Destory session-cookie
    return response.set_cookie('beauty', expires=0)

