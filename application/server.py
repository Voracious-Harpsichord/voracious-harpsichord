from flask import Flask, request, send_from_directory, jsonify
from flask.ext.bower import Bower
from flask.ext.bcrypt import Bcrypt
from flask.ext.sqlalchemy import SQLAlchemy
from config import SQLALCHEMY_DATABASE_URI 
#db controllers
from db_controller import user_controller
from db_controller import product_controller

# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_url_path='')
 
bower = Bower(app)
bcrypt = Bcrypt(app)
# make db and configure path
db = SQLAlchemy(app)
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI 

@app.route('/')
def send_js():
    return send_from_directory('static', 'index.html')


@app.route('/api/user',methods=['POST'])
def user():
    if request.headers['Content-Type'] == 'application/json':
        method = request.method 
        json = request.get_json()
        username = json['username']
        password = json['password']
        # the controller should handle errors 
        # the controller should handle different methods
        # use different user controller
    return user_controller.login(username,password,method)

@app.route('/api/newUser',methods=['POST'])
def newUser():
    # we only use JSON! :)
    if request.headers['Content-Type'] == 'application/json':
        method = request.method 
        json = request.get_json()
        username = json['username']
        password = json['password']
        # the controller should handle errors 
        # the controller should handle different methods
        return user_controller.signup(username,password,method)

@app.route('/api/userProducts/<user_id>',methods=['GET','POST','PUT','DELETE'])
def userProducts():
    # user id is available from the query parameter
    method = request.method 
    json = request.get_json()
    product = json['product']
    return product_controller.Product_controller(product,method)

@app.route('/api/products/<product_id>',methods=['GET'])
def products():
    method = request.method 
    json = request.get_json()
    product = json['product']
    return product_controller.Product_controller(product,method)

#start server
if __name__ == "__main__":
    app.run(debug=True)
