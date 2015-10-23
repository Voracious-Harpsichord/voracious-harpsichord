from server import db

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(120))
    product_brand = db.Column(db.String(80))

    def __init__(self, product_name, product_brand):
        self.product_name = product_name
        self.product_brand = product_brand

    def __repr__(self):
        return '<product %r>' % self.product_name


class User_product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    product_id = db.Column(db.Integer)
    product_size = db.Column(db.String(20))
    product_status = db.Column(db.String(20))
    product_notes = db.Column(db.String(500))

    def __init__(self, user_id, product_id, product_size, product_status, product_notes):
        self.user_id = user_id
        self.product_id = product_id
        self.product_size = product_size
        self.product_status = product_status
        self.product_notes = product_notes

    def __repr__(self):
        return '<product_id %r>' % self.product_id

db.create_all()
