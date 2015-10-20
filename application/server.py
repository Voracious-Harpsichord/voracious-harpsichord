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
        response = jsonify(status=200, data={'userid': user_controller.get_user_id(body['username'])})
        #add session-cookie to response
        user_controller.create_session(response)
        #return user object with a 200
        return response
    #return 401 if auth failed
    else:
        return jsonify(status=401, data='Authentication Error')

@app.route('/api/newUser',methods=['POST'])
def newUser():
    body = request.get_json()
    print(body)
    for prop in body:
        print(prop)
    #if user is not already in db
        print('made it 1')
    if not user_controller.user_exists(body['username']):
        print('made it 5 True')
        #add user to db
        user_controller.make_new_user(body['username'], body['password'])
        print('made it 6')
        #make response
        response = jsonify(status=201, data={'userid': user_controller.get_user_id(body['username'])})
        print('made it 7')
        #add session-cooker to response
        user_controller.create_session(response)
        #return user object witha 201
        print('made it 8')
        return response
    #else return a 302 for Found
    else:
        print('made it 5 False')
        return jsonify(status=301, data='Username already exists')


@app.route('/api/userProducts/<user_id>',methods=['GET','POST','PUT','DELETE'])
def userProducts(user_id):
    # user id is available from the query parameter
    method = request.method 
    json = request.get_json()
    product = json['product']
    return product_controller.Product_controller(product,method)

@app.route('/api/products/<product_id>',methods=['GET'])
def products(product_id):
    method = request.method 
    json = request.get_json()
    product = json['product']
    return product_controller.Product_controller(product,method)

#start server
if __name__ == "__main__":
    app.run(debug=True)
