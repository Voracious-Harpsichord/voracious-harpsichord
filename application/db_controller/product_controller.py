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
    
    user_products = session.query(User_product).filter(User_product.user_id == user_id).all()
    
    results = []
    for user_product in user_products:
        product = session.query(Product).filter(Product.id == user_product.product_id).one()
        results.append({
            'product_id': product.id, 
            'brand_name': product.brand, 
            'product_name': product.name,
            'product_category': product.category,
            'product_size': user_product.size,
            'product_status': user_product.status,
            'product_notes': user_product.notes,
            'product_color': user_product.color,
            'product_rating': user_product.stars,
            'sephora_id': product.sephora_id
        })
    
    return results

#currently only being used by event and recs controller
def get_product_as_dictionary(product_id):
    p = session.query(Product).filter(Product.id == product_id).one()
    product = {
        'product_id': p.id,
        'brand_name': p.brand,
        'product_name': p.name,
        'product_category': p.category,
        'product_size': '',
        'product_status': 'Wishlist',
        'product_notes': '',
        'product_color': '',
        'product_image_url': p.image_url,
        'product_description': p.description
    }
    return product

#Get a product by product_id
def get_product_by_product_id(product_id):
    return session.query(Product).filter(Product.id == product_id).one()


#Get a product by product_id
def get_product_id_by_sephora_product_id(sephora_product_id):
    return session.query(Product).filter(Product.sephora_id == sephora_product_id).one().id

#Verify if a product exists by name and brand and return the product_id or None
def verify_product_by_name_and_brand(product_name, product_brand):
    q = session.query(Product).filter(Product.name == product_name, Product.brand == product_brand)
    if q.count() > 0:
        return q.first().id
    else:
        return None

#Verify if a product exists by name and brand
def verify_product_by_id(product_id):
    return session.query(Product).filter(Product.id == product_id).count() > 0

#Add a product to the product table and return the newly created product
def add_product_to_products(name, brand, category='', price='', sephora_id='', image_url='', description=''):
    session.add(Product(name, brand, category, price, sephora_id, image_url, description))
    session.commit()
    #Return most recently created product
    return session.query(Product).filter(Product.name == name, Product.brand == brand).one().id

#Create a relationship between user and product and add user data to product relationship
def add_user_to_product(user_id, product_id, size='Full', status='Own', notes='', color='', stars='', review='', user_product_image_url=''):
    #Add user and product to user/products
    product = User_product(int(user_id), int(product_id), size, status, notes, color, stars, review, user_product_image_url)
    session.add(product)
    session.commit()
    product_universal = session.query(Product).filter(Product.id == product_id).one()
    product_user = session.query(User_product).filter(User_product.id == product.id).one()

    #return the new product from Products table
    return {
        'product_id': product.id, 
        'brand_name': product_universal.brand, 
        'product_name': product_universal.name,
        'product_category':product_universal.category,
        'product_price':product_universal.price,
        'product_sephora_id':product_universal.sephora_id,
        'product_image_url':product_universal.image_url,
        'product_description':product_universal.description,
        'product_size': product_user.size,
        'product_status': product_user.status,
        'product_notes': product_user.notes,
        'product_color': product_user.color,
        'product_stars': product_user.stars,
        'product_review': product_user.review,
        'product_user_product_image_url': product_user.user_product_image_url
    }

def edit_user_to_product(id, user_id, product_id, size='full', status='own', notes='', color='', stars='', review='', user_product_image_url=''):

    session.query(User_product).\
        filter(User_product.id == id).\
        update({
            'size': size,
            'status': status,
            'notes': notes,
            'color': color,
            'stars': stars,
            'review': review,
            'user_product_image_url': user_product_image_url
        })

    session.commit()
    product_universal = session.query(Product).filter(Product.id == product_id).one()
    product_user = session.query(User_product).filter(User_product.id == id).one()

    return {
        'product_id': product_user.id, 
        'brand_name': product_universal.brand, 
        'product_name': product_universal.name,
        'product_category': product_universal.category,
        'product_size': product_user.size,
        'product_status': product_user.status,
        'product_notes': product_user.notes,
        'product_color': product_user.color
    }

#Delete a relationship between user and product
def remove_user_from_product(product_id):
    session.delete(session.query(User_product).filter(User_product.id == product_id).one())
    session.commit()
    return None
