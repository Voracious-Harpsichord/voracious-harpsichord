#create DB session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import SQLALCHEMY_DATABASE_URI

engine = create_engine(SQLALCHEMY_DATABASE_URI)
session = sessionmaker(bind=engine)()
session._model_changes = {}

#import tables
from db_models.products import Product, User_product

#Get a list of product by user_id
def get_products_by_user_id(user_id):
    #query User_product for the matching user_id
    product_ids = session.query(User_product).filter(User_product.user_id == user_id)
    #for each product_id in query, push a dictionary into the results
    results = []
    for p in product_ids:
        results.append(dict(session.query(Product).filter(Product.id == p.product_id).one()))
    #return the results 
    return results

#Get a product by product_id
def get_product_by_product_id(product_id):
    return dict(session.query(Product).filter(Product.id == product_id).one())

#Verify if a product exists by name and brand and return the product_id or None
def verify_product_by_name_and_brand(product_name, product_brand):
    q = session.query(Product).filter(Product.product_name == product_name and Product.product_brand == product_brand)
    if q.count() > 0:
        return q.one().id
    else:
        return None

#Verify if a product exists by name and brand
def verify_product_by_id(product_id):
    return session.query(Product).filter(Product.id == product_id).count() > 0

#Add a product to the product table and return the newly created product
def add_product_to_products(product_name, product_brand):
    #Add product to Prodcut Table
    session.add(Product(product_name, product_brand))
    session.commit()
    #Return most reecently created product
    return dict(session.query(Product).order_by(Prdocut.id.desc()).first())

#Create a relationship between user and product
def add_user_to_product(user_id, product_id):
    #Add user and product to user/products
    session.add(User_product(user_id, product_id))
    #return the product that whole product
    return dict(session.query(Product).filter(Product.id == product_id).one())

#Delete a relationship between user and product
def remove_user_from_product(user_product_id):
    db.session.delete(session.query(User_product).filter(User_product.id == product_user_id).one())
    db.session.commit()
    return None