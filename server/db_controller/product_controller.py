from flask import jsonify

def Product_controller(product,method):
  return jsonify(product=product,method=method)