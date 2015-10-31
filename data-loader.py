
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

app = Flask(__name__, static_url_path='')

#BEGIN DB SETUP
from flask.ext.sqlalchemy import SQLAlchemy
import os
BASE_DIR = os.path.abspath(os.path.dirname(__file__))  

SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, 'application/app.db')

#Config path and instantiate
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
db = SQLAlchemy(app)

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine(SQLALCHEMY_DATABASE_URI)
session = sessionmaker(bind=engine)()
session._model_changes = {}

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    brand = db.Column(db.String(80))
    category = db.Column(db.String(20))
    price = db.Column(db.Integer)
    sephora_id = db.Column(db.String(20))
    image_url = db.Column(db.String(240))
    description = db.Column(db.String(500))

    def __init__(self, name, brand, category, price, sephora_id, image_url, description):
        self.name = name
        self.brand = brand
        self.category = category
        self.price = price
        self.sephora_id = sephora_id
        self.image_url = image_url
        self.description = description

    def __repr__(self):
        return '<product %r>' % self.product_name

db.create_all()

#Add a product to the product table and return the newly created product
def add_product_to_products(name, brand, category='', price=0, sephora_id='', image_url='', description=''):
    session.add(Product(name, brand, category, price, sephora_id, image_url, description))
    session.commit()

import json

jsonProducts = open('data/products.json', 'r')
products = json.loads(jsonProducts.read())
jsonProducts.close()

for p in products:
                              # name,             brand,      category='', price='', sephora_id='', image_url='', description=''
  add_product_to_products(p.get('display_name', ''), p.get('brand_name',''), '', 0, p.get('id', ''), '', p.get('quick_look_desc', ''))
