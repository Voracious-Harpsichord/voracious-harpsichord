from flask import Flask, request, send_from_directory, jsonify
from flask.ext.bcrypt import Bcrypt
from flask.ext.sqlalchemy import SQLAlchemy

from config import SQLALCHEMY_DATABASE_URI

# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_url_path='')

#utilities
bcrypt = Bcrypt(app)

#Config path and instantiate
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
db = SQLAlchemy(app)

from db_controller import event_controller as e_ctrl
from db_controller import product_controller as p_ctrl
from db_controller import recommendation_controller as r_ctrl
from db_controller import sites_controller as s_ctrl
from db_controller import user_controller as u_ctrl

# async jobs
from workers import work_queue

@app.route('/')
def send_index():
    return send_from_directory('static', 'index.html')

@app.route('/api/user', methods=['GET', 'POST', 'DELETE'])
def user():
    #Cookie Authentication
    if request.method == 'GET':
        user_id = u_ctrl.verify_session(request)
        #if cookie exists
        if user_id != None:
            #return user data from user id on cookie, and refresh cookie
            response = jsonify(u_ctrl.get_user_as_dictionary(user_id))
            response = u_ctrl.create_session(response, user_id)
            return response, 200
        #otherwise return a 204
        return "No login", 204
    
    #Regular logins
    if request.method == 'POST':
        body = request.get_json()
        #if user does not exist in database
        if not u_ctrl.username_exists(body['username']):
            return 'User does not exist', 404
        #if user has correct password
        if u_ctrl.verify_user(body['username'], body['password']):
            #make response
            user_id = u_ctrl.get_user_id(body['username'])
            response = jsonify(u_ctrl.get_user_as_dictionary(user_id))
            #add session-cookie to response
            response = u_ctrl.create_session(response, user_id)
            #return user object with a 200
            return response, 200
        #return 401 if auth failed
        else:
            return 'Invalid password', 401

    #Destroying sessions on logaou
    if request.method == 'DELETE':
        response = jsonify(response="Session Destroyed")
        response = u_ctrl.destroy_session(response)
        return response, 204

@app.route('/api/profile/<user_id>', methods=['GET'])
def userProfile(user_id):
    if request.method == 'GET':
        user = u_ctrl.get_user_as_dictionary(user_id)
        userProducts = p_ctrl.get_products_by_user_id(user_id)
        response = jsonify({'user': user, 'userProducts': userProducts})
        return response, 200


@app.route('/api/newUser',methods=['POST'])
def newUser():
    body = request.get_json()
    #if user is not already in db
    if not u_ctrl.username_exists(body['username']):
        #add user to db
        u_ctrl.make_new_user(body)
        #make response
        user_id = u_ctrl.get_user_id(body['username'])
        response = jsonify(u_ctrl.get_user_as_dictionary(user_id))
        #add session-cookie to response
        response = u_ctrl.create_session(response, user_id)
        #return user object with a 201
        # when creating a new user save some mock recommendations
        r_ctrl.populate_new_user_recommendations(user_id)
        # work_queue.enqueue("find_prob",[user_id])

        return response, 201
    #else return a 302 for Found
    else:
        return 'Username already exists', 302

@app.route('/api/user/follow/<user_id>', methods=['GET', 'POST', 'DELETE'])
def followers(user_id):
    #ERROR HANDLING
    #if user_id in params does not exists
    if not u_ctrl.userid_exists(user_id):
        return "Invalid user_id", 404

    #GET
    if request.method == 'GET':
        followers = u_ctrl.get_followers(user_id)
        following = u_ctrl.get_followings(user_id)
        response = jsonify({'followers': followers, 'following': following})
        return response, 200

    #POST
    if request.method == 'POST':
        body = request.get_json()
        id_to_follow = body.get('userid')

        #errors
        #make sure following real user
        if not u_ctrl.userid_exists(id_to_follow): #add userid_exists to controller
            return "Could not find user to follow", 404
        #keep user from following self
        if user_id == id_to_follow:
            return "Cannot follow self", 401
        #keep user from following multiple times
        # if u_ctrl.verify_follow(user_id, id_to_follow):
        #     return "Already following", 401
        
        following_id = u_ctrl.add_follow(user_id, id_to_follow)
        if following_id:
            response = jsonify(u_ctrl.get_user_as_dictionary(following_id))
            return response, 201
        else:
            return "Could not follow user", 500

    #DELETE
    if request.method == 'DELETE':
        body = request.get_json()
        id_to_unfollow = body.get('userid')

        #errors
        if not u_ctrl.verify_follow(user_id, id_to_unfollow):
            return "Follower relationship not found", 404

        unfollowed_id = u_ctrl.remove_follow(user_id, id_to_unfollow)
        if unfollowed_id:
            response = jsonify({'user_id': id_to_unfollow})
            return response, 201
        else:
            return "Could not unfollow user", 500

@app.route('/api/userProducts/<user_id>',methods=['GET','POST','PUT','DELETE'])
def userProducts(user_id):

    if request.method == 'GET':
        #lookup all products for in users collection
        response = jsonify(userProducts=p_ctrl.get_products_by_user_id(user_id))
        #respond array of products and a 200
        return response, 200
    
    if request.method == 'POST':
        body = request.get_json()
        #check if product is already in DB
        product_id = p_ctrl.verify_product_by_name_and_brand(body['product_name'], body['brand_name'])
        if product_id == None:    
            #Add product if not
            product_id = p_ctrl.add_product_to_products(body['product_name'], body['brand_name'], body['product_category'])
        #create db relationship between user and product
        print("body", body)
        response = jsonify(p_ctrl.add_user_to_product(
            user_id, 
            product_id, 
            body.get('product_size'),
            body.get('product_status'),
            body.get('product_notes'),
            body.get('product_color'),
            body.get('stars'),
            body.get('review'),
            body.get('product_image_url'),
            body.get('product_category')
        ))
        e_ctrl.add_event(user_id, "added a product", "product", product_id)
        return response, 201

    if request.method == 'PUT':
        body = request.get_json()
        product = body['product']
        product_id = p_ctrl.verify_product_by_name_and_brand(product['product_name'], product['brand_name'])
        response = jsonify(p_ctrl.edit_user_to_product(
            user_id, 
            product_id, 
            body.get('product_size'),
            body.get('product_status'),
            body.get('product_notes'),
            body.get('product_color'),
            body.get('stars'),
            body.get('review'),
            body.get('product_image_url'),
            body.get('product_category')
        ))
        return response, 202

    if request.method == 'DELETE':
        body = request.get_json()
        p_ctrl.remove_user_from_product(body['product_id'])
        return "Product Removed", 204

@app.route('/api/sites/<user_id>',methods=['GET','POST','PUT','DELETE'])
def userSites(user_id):

    if request.method == 'GET':
        response = jsonify(s_ctrl.get_sites_by_user_id(user_id))
        return response, 200

    if request.method == 'POST':
        body = request.get_json()
        url = body["url"]
        site_info = s_ctrl.get_site_info(url)
        site_id = s_ctrl.add_or_update_site(site_info)
        response = s_ctrl.add_user_to_site(user_id, site_id, site_info['site_type'], body.get("comment"))
        if response:
            e_ctrl.add_event(user_id, "added a " +site_info['site_type'], site_info['site_type'], site_id)
            return jsonify(response), 201
        else:
            return 'Site has already been added', 302

    if request.method == 'PUT':
        body = request.get_json()
        user_site_id = body['user_site_id']
        response = s_ctrl.edit_user_to_site(user_site_id, body.get("comment"))
        if not response:
            return "Site not found", 404
        return jsonify(response), 201

    if request.method == 'DELETE':
        body = request.get_json()
        removed = s_ctrl.remove_user_from_site(body['user_site_id'])
        if removed:
            return "Site "+ str(removed) +" Removed", 204
        else:
            return "Site not found", 404

@app.route('/api/products/<product_id>',methods=['GET'])
def products(product_id):
    #lookup product in db
    if p_ctrl.verify_product_by_id(product_id):
    #repsond with product info and 200
        return jsonify(p_ctrl.get_product_by_product_id(product_id)), 200
    #or 404
    else:
        return "Product Not Found", 404

@app.route('/api/recommendations/<user_id>',methods=['GET','POST','DELETE'])
def recommendations(user_id):
    #retrive personal and universal recommendations
    if request.method == 'GET':
        universals = r_ctrl.get_recommendation_by_user_id(user_id)
        personals = r_ctrl.get_personal_recs(user_id)
        return jsonify({
            'personal': personals,
            'universal': universals
            }), 200

    #add a personal reccomendation
    if request.method == 'POST':
        body = request.get_json()
        print(body)
        response = r_ctrl.add_personal_rec(user_id, body['to_user_id'], body['product'])
        if response:
            return jsonify(response), 201
        else:
            return "Recommendation already exists", 302

@app.route('/api/events',methods=['GET'])
def events():
    response = jsonify(e_ctrl.get_events())
    return response, 200

@app.route('/api/brands/<first_letter>',methods=['GET'])
def brands(first_letter):
    response = jsonify(p_ctrl.get_brands(first_letter))
    return response, 200

#start server
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)
