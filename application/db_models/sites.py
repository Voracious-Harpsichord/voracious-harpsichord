from server import db

class Sites(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    site_name = db.Column(db.String(120))
    site_brand = db.Column(db.String(80))

    def __init__(self, site_name, site_brand):
        self.site_name = site_name
        self.site_brand = site_brand

    def __repr__(self):
        return '<site %r>' % self.site_name


class User_sites(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    site_id = db.Column(db.Integer)

    def __init__(self, user_id, site_id):
        self.user_id = user_id
        self.site_id = site_id

    def __repr__(self):
        return '<site_id %r>' % self.site_id

db.create_all()
