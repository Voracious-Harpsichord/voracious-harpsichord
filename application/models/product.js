from flask import Flask
import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
db = SQLAlchemy(app)


class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(120), unique=True)
    brand_name = db.Column(db.String(80))

    def __init__(self, product_name,brand_name):
        self.product_name = product_name
        self.brand_name = brand_name

    def __repr__(self):
        return '<product %r>' % self.product_name

        