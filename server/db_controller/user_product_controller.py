from flask import jsonify

def User_product_controller(user_id,json,method):
  return jsonify(user_id=user_id,product=product,method=method)
