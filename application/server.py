from flask import Flask, request, send_from_directory, jsonify
from flask.ext.bower import Bower

# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_url_path='')

@app.route('/')
def send_js():
    return send_from_directory('static', 'index.html')

Bower(app)

#handle api calls
import db_controller.user_controller as user_controller
import db_controller.product_controller as product_controller
import db_controller.user_product_controller as user_product_controller
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
    return user_product_controller.User_product_controller(user_id,product,method)

@app.route('/api/products/<product_id>',methods=['GET'])
def products():
    method = request.method 
    json = request.get_json()
    product = json['product']
    return product_controller.Product_controller(product,method)

#start server
if __name__ == "__main__":
    app.run(debug=True)
