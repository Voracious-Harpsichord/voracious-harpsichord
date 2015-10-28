from server import db

class Site(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    url = db.Column(db.String(500))
    article = db.Column(db.String(8))

    def __init__(self, name, url, article):
        self.name = name
        self.url = url
        self.article = article

    def __repr__(self):
        return '<site %r>' % self.site_name


class User_site(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    site_id = db.Column(db.Integer)
    comment = db.Column(db.String(500))

    def __init__(self, user_id, site_id, comment):
        self.user_id = user_id
        self.site_id = site_id
        self.comment = comment

    def __repr__(self):
        return '<site_id %r>' % self.site_id

db.create_all()
