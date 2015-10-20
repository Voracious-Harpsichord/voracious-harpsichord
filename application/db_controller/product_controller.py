from flask import Flask
#import Bcrypt for hashing
from server import bcrypt
#import users model
from db_models import models
session = models.session
Product = models.Product
User_product = models.User_product

#Get a list of product by user_id
def get_products_by_user_id(user_id):
    return None
#Get a product by product_id
def get_product_by_product_id(product_id):
    return None
#Verify if a product exists by name and brand
def verify_product_by_name_and_brand(product_name, product_brand):
    return None
#Verify if a product exists by name and brand
def verify_product_by_id(product_id):
    return None
#Add a product to the product table and return the id
def add_product_to_products(product_name, product_brand):
    return None
#Create a relationship between user and product
def add_product_to_user(product_id, user_id):
    return None
#Delete a relationship between user and product
def remove_product_from_user(product_id, user_id):
    return None