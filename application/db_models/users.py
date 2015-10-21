from server import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    pw_hash = db.Column(db.String(120))
    
    def __init__(self, username, pw_hash):
        self.username = username
        self.pw_hash = pw_hash

    def __repr__(self):
        return '<User %r>' % self.username

db.create_all()
