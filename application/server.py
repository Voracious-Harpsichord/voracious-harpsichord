from flask import Flask, request, send_from_directory, jsonify, make_response
from flask.ext.bower import Bower
from flask.ext.bcrypt import Bcrypt
#db controllers
from db_controller import user_controller
from db_controller import product_controller
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
        return 'Username already exists', 302


@app.route('/api/userProducts/<user_id>',methods=['GET','POST','PUT','DELETE'])
def userProducts(user_id):
    #GET
    if request.method == 'GET':
        #lookup all products for in users collection
        response = jsonify(product_controller.get_products_by_user_id(user_id))
        #respond array of products and a 200
        return response, 200
    
    #POST
    if request.method == 'POST':
        body = request.get_json()
        #check if product is already in DB
        product_id = product_controller.verify_product_by_name_and_brand(body['product_name'], body['brand_name'])
        if product_id == None:    
            #Add product if not
            product_id = product_controller.add_product_to_products(body['product_name'], body['brand_name'])
        #create db relationship between user and product
        response = jsonify(product_controller.add_product_to_user(user_id, product_id))
        #respond with created product and 201
        return response, 201

    #DELETE
    if request.method == 'DELETE':
        body = request.get_json()
        #remove relation between user and product
        remove_product_from_user(product_user_id)
        #respond with a 204
        return "Product Removed", 204



@app.route('/api/products/<product_id>',methods=['GET'])
def products(product_id):
    #lookup product in db
    if product_controller.verify_product_by_id(product_id):
    #repsond with product info and 200
        return jsonify(product_controller.get_product_by_product_id(product_id)), 200
    #or 404
    else:
        return "Product Not Found", 404

#start server
if __name__ == "__main__":
    app.run(debug=True)
