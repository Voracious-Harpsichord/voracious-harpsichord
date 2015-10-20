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
    if user_controller.verify_user(body.username, body.password):
        #make response
        response = jsonify(data={'userid': user_controller.get_user_id(body.username)})
        #add session-cookie to response
        user_controller.create_session(response)
        #return user object with a 201
        return response, 200
    #return 401 if auth failed
    else:
        return 401

@app.route('/api/newUser',methods=['POST'])
def newUser():
    body = request.get_json()
    print(body)
    #if user is not already in db
    if not user_controller.user_exists(body.username):
        #add user to db
        user_controller.make_new_user(body.username, body.password)
        #make response
        response = jsonify(data={'userid': user_controller.get_user_id(body.username)})
        #add session-cooker to response
        user_controller.create_session(response)
        #return user object witha 201
        return response, 201
    #else return a 302 for Found
    else:
        return 302


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
