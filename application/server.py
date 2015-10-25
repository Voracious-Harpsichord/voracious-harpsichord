from flask import Flask, request, send_from_directory, jsonify
from flask.ext.bower import Bower
from flask.ext.bcrypt import Bcrypt
# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_url_path='')

#utilities
bower = Bower(app)
bcrypt = Bcrypt(app)

#BEGIN DB SETUP
from flask.ext.sqlalchemy import SQLAlchemy
from config import SQLALCHEMY_DATABASE_URI

#Config path and instantiate
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
db = SQLAlchemy(app)

#db controllers
from db_controller import user_controller as u_ctrl
from db_controller import product_controller as p_ctrl
#END DB SETUP

@app.route('/')
def send_index():
    return send_from_directory('static', 'index.html')

@app.route('/api/user',methods=['GET', 'POST', 'DELETE'])
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
        if not u_ctrl.user_exists(body['username']):
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

@app.route('/api/newUser',methods=['POST'])
def newUser():
    body = request.get_json()
    #if user is not already in db
    if not u_ctrl.user_exists(body['username']):
        #add user to db
        u_ctrl.make_new_user(body)
        #make response
        user_id = u_ctrl.get_user_id(body['username'])
        response = jsonify(u_ctrl.get_user_as_dictionary(user_id))
        #add session-cookie to response
        response = u_ctrl.create_session(response, user_id)
        #return user object with a 201
        return response, 201
    #else return a 302 for Found
    else:
        return 'Username already exists', 302


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
        response = jsonify(p_ctrl.add_user_to_product(
            user_id, 
            product_id, 
            body['product_size'], 
            body['product_status'], 
            body['product_notes'],
            body['product_color']
        ))
        return response, 201

    if request.method == 'PUT':
        body = request.get_json()
        product_id = p_ctrl.verify_product_by_name_and_brand(body['product_name'], body['brand_name'])
        response = jsonify(p_ctrl.edit_user_to_product(
            body['product_id'],
            user_id,
            product_id,
            body['product_size'], 
            body['product_status'], 
            body['product_notes'],
            body['product_color']
        ))
        return response, 202

    if request.method == 'DELETE':
        body = request.get_json()
        #remove relation between user and product
        p_ctrl.remove_user_from_product(user_product_id)
        #respond with a 204
        return "Product Removed", 204



@app.route('/api/products/<product_id>',methods=['GET'])
def products(product_id):
    #lookup product in db
    if p_ctrl.verify_product_by_id(product_id):
    #repsond with product info and 200
        return jsonify(p_ctrl.get_product_by_product_id(product_id)), 200
    #or 404
    else:
        return "Product Not Found", 404

#start server
if __name__ == "__main__":
    app.run(debug=True)
