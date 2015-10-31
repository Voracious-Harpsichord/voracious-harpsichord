#create DB session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import SQLALCHEMY_DATABASE_URI

engine = create_engine(SQLALCHEMY_DATABASE_URI)
session = sessionmaker(bind=engine)()
session._model_changes = {}

#import users model
from db_models.users import User, Follower
#additional libs
from server import bcrypt
import datetime

# Stub functions for testing endpoints
def signup(username,password,method):
    return jsonify(username=username,password=password,method=method)
def login(username,password,method):
    return jsonify(username=username,password=password,method=method)

# Write a new entry into the users table
def make_new_user(u):
    # hash password
    hashed = bcrypt.generate_password_hash(u['password'])
    # make new user entry
    # add new user entry to the table
    #__init__(self, created_at, username, pw_hash, email, name_title, name_first, name_last, gender, location, birthday)
    session.add(User(str(datetime.datetime.now()), u['username'], hashed, u.get('email', ''), u.get('name_title', ''), u.get('name_first', ''), u.get('name_last', ''), u.get('gender', ''), u.get('location', ''), u.get('birthday', '')))
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

# Verify that user exists in user table, returning true or false
def username_exists(username):
    #return if user exists
    if session.query(User).filter(User.username == username).count() > 0:
        return True
    else:
        return False

def userid_exists(userid):
     #return if user exists
     if session.query(User).filter(User.id == userid).count() > 0:
         return True
     else:
         return False   

# Get user id from username
def get_user_id(username):
    # lookup user in table by usernamed
    # return user id of user
    return session.query(User).filter(User.username == username).one().id

def get_user_as_dictionary(id):
    # lookup user in table by usernamed
    # return user id of user
    u = session.query(User).filter(User.id == id).one()
    return {'userid':u.id, 'created_at':u.created_at, 'username':u.username, 
    'name_title':u.name_title, 'name_first':u.name_first, 'name_last':u.name_last, 
    'gender':u.gender, 'location':u.location, 'birthday':u.birthday, 
    'skin_tone':u.skin_tone}

# SESSIONS
# Add a sessions cookie on to the
def create_session(response, user_id):
    #Attach session-cookie to response
    response.set_cookie('beauty', str(user_id))
    return response

# Verify that request has session-cookie to continue
def verify_session(request):
    #Return value stored in session-cookie or None
    return request.cookies.get('beauty')

# Remove the sessions
def destroy_session(response):
    # Destory session-cookie
    response.set_cookie('beauty', expires=0)
    return response

# FOLLOWER FUNCTIONS
def get_followings(user_id):
    results = []
    #in follwer table lookup all entries where user_id matches user_id field
    following_Q = session.query(Follower).filter(Follower.user_id == user_id)
    #make a 'is_following' array (of 'is_following' IDs)
    following_IDs = [f.is_following for f in following_Q.all()]
    #for each id#
    for f in following_IDs:
        #lookup the entire user object for that id
        # add the user object the results
        results.append(get_user_as_dictionary(f))
    return results

def get_followers(user_id):
    results = []
    #in follwer table lookup all entries where user_id matches is_following field
    follower_Q = session.query(Follower).filter(Follower.is_following == user_id)
    #make a 'followed_by' array (of user_id IDs)
    follower_IDs = [f.user_id for f in follower_Q.all()]
    #for each entry (an id#)
    for f in follower_IDs:
        #lookup the entire user object for that id
        #add the user object to the 'followed_by' array
        results.append(get_user_as_dictionary(f))
    return results

def add_follow(user_id, is_following):
    try:
        session.add(Follower(user_id, is_following))
        session.commit()
        return is_following
    except:
        return None

def remove_follow(user_id, not_following):
    try:
        session.query(Follower).filter(Follower.user_id == user_id, Follower.is_following == not_following).delete()
        session.commit()
        return not_following
    except:
        return None

def verify_follow(user_id, maybe_following):
    following_Q = session.query(Follower)
    following_Q.filter(Follower.user_id == user_id, Follower.is_following == maybe_following)
    print(following_Q)
    # following_Q.filter(Follower.is_following == maybe_following)
    if following_Q.count() > 0:
        return True
    else:
        return False

