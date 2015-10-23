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
    product_ids = session.query(User_product).filter(User_product.user_id == user_id).all()
    #for each product_id in query, push a dictionary into the results
    results = []
    for p in product_ids:
        user_product = session.query(Product).filter(Product.id == p.product_id).one()
        results.append({'product_id': user_product.id, 'brand_name': user_product.product_brand, 'product_name': user_product.product_name}
)
    #return the results
    return results

#Get a product by product_id
def get_product_by_product_id(product_id):
    return session.query(Product).filter(Product.id == product_id).one()

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
    #Add product to Product Table
    session.add(Product(product_name, product_brand))
    session.commit()
    #Return most recently created product
    return session.query(Product).filter(Product.product_name == product_name and Product.product_brand == product_brand).one().id

#Create a relationship between user and product and add user data to product relationship
def add_user_to_product(user_id, product_id, product_size='full', product_status='own', product_notes=''):
    #Add user and product to user/products
    session.add(User_product(int(user_id), int(product_id), product_size, product_status, product_notes))
    session.commit()
    product_universal = session.query(Product).filter(Product.id == product_id).one()
    product_user = session.query(User_product).filter(User_product.product_id == product_id).one()

    #return the new product from Products table
    return {
        'product_id': product_universal.id, 
        'brand_name': product_universal.product_brand, 
        'product_name': product_universal.product_name,
        'product_size': product_user.product_size,
        'product_status': product_user.product_status,
        'product_notes': product_user.product_notes
    }

def edit_user_to_product(product_id, product_size, product_status, product_notes):
    
    session.query(Product).\
        filter(Product.id == product_id).\
        update({
            'product_size': product_size,
            'product_status': product_status,
            'product_notes': product_notes
        })

    session.commit()

    product = session.query(Product).filter(Product.id == product_id).one()
    return {
        'product_id': product.id, 
        'brand_name': product.product_brand, 
        'product_name': product.product_name,
        'product_size': product.product_size,
        'product_status': product.product_status,
        'product_notes': product.product_notes
    }

#Delete a relationship between user and product
def remove_user_from_product(user_product_id):
    db.session.delete(session.query(User_product).filter(User_product.id == product_user_id).one())
    db.session.commit()
    return None
