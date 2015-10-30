# user id prod id rec number
from server import db

class Recommendation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    product_id = db.Column(db.Integer)
    rank = db.Column(db.Integer)

    def __init__(self, user_id, product_id, rank):
        self.user_id = user_id
        self.product_id = product_id
        self.rank = rank

    def __repr__(self):
        return '<recommendation %r>' % self.rank

db.create_all()