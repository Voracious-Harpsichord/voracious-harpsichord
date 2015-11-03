from server import db

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    brand = db.Column(db.String(80))
    category = db.Column(db.String(20))
    price = db.Column(db.Integer)
    sephora_id = db.Column(db.String(20))
    image_url = db.Column(db.String(240))
    description = db.Column(db.String(2000))

    def __init__(self, name, brand, category, price, sephora_id, image_url, description):
        self.name = name
        self.brand = brand
        self.category = category
        self.price = price
        self.sephora_id = sephora_id
        self.image_url = image_url
        self.description = description

    def __repr__(self):
        return '<product %r>' % self.name


class User_product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    product_id = db.Column(db.Integer)
    size = db.Column(db.String(20))
    status = db.Column(db.String(20))
    notes = db.Column(db.String(500))
    color = db.Column(db.String(40))
    stars = db.Column(db.Integer)
    review = db.Column(db.String(1000))
    user_product_image_url = db.Column(db.String(240))

    def __init__(self, user_id, product_id, size, status, notes, color, stars, review, user_product_image_url):
        self.user_id = user_id
        self.product_id = product_id
        self.size = size
        self.status = status
        self.notes = notes
        self.color = color
        self.stars = stars
        self.review = review
        self.user_product_image_url = user_product_image_url

    def __repr__(self):
        return '<product_id %r>' % self.product_id

db.create_all()
