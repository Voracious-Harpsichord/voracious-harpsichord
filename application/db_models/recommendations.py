# user id prod id rec number
from server import db

class Recommendation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    product_id = db.Column(db.Integer)
    rank = db.Column(db.String(20))

    def __init__(self, user_id, product_id, rank):
        self.user_id = user_id
        self.product_id = product_id
        self.rank = rank

    def __repr__(self):
        return '<recommendation %r>' % self.rank

class Personal_Rec(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    from_user_id = db.Column(db.Integer)
    to_user_id = db.Column(db.Integer)
    product_id = db.Column(db.Integer)

    def __init__(self, from_user_id, to_user_id, product_id):
        self.from_user_id = from_user_id
        self.to_user_id = to_user_id
        self.product_id = product_id

    def __repr__(self):
        return '<personal rec for user %r>' % self.to_user_id

db.create_all()
