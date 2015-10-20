from flask import Flask, request, send_from_directory, jsonify, make_response
from flask.ext.bower import Bower
from flask.ext.bcrypt import Bcrypt
#db controllers
from db_controller import user_controller
from db_controller import product_controller


from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.ext.declarative import declarative_base

# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_url_path='')
 
bower = Bower(app)
bcrypt = Bcrypt(app)
# make db and configure path

@app.route('/')
def send_index():
    return send_from_directory('static', 'index.html')


@app.route('/api/user',methods=['POST'])
def user():
    body = request.get_json()
    #if user is in database
    if user_controller.verify_user(body['username'], body['password']):
        #make response
        response = jsonify({'userid': user_controller.get_user_id(body['username'])})
        #add session-cookie to response
        user_controller.create_session(response)
        #return user object with a 200
        return response, 200
    #return 401 if auth failed
    else:
        return 'Authentication Error', 401

@app.route('/api/newUser',methods=['POST'])
def newUser():
    body = request.get_json()
    #if user is not already in db
    if not user_controller.user_exists(body['username']):
        #add user to db
        user_controller.make_new_user(body['username'], body['password'])
        #make response
        response = jsonify({'userid': user_controller.get_user_id(body['username'])})
        #add session-cooker to response
        user_controller.create_session(response)
        #return user object witha 201
        return response, 201
    #else return a 302 for Found
    else:
        return 'Username already exists', 301


@app.route('/api/userProducts/<user_id>',methods=['GET','POST','PUT','DELETE'])
def userProducts(user_id):
    #GET
        #lookup all products for in users collection
        #respond array of products and a 200
    #POST
        #check if product is already in DB
            #Add product if not
        #create db realtionship between user and product
        #respond with created product and 201
    #PUT
        #update information about product
        #respond with updated product and 201

    #DELETE
        #remove relation between user and product
        #respond with a 204



@app.route('/api/products/<product_id>',methods=['GET'])
def products(product_id):
    #lookup product in db
    #repsond with product info and 200
    #or 404

#start server
if __name__ == "__main__":
    app.run(debug=True)
