from server import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_at =db.Column(db.String(40))
    username = db.Column(db.String(80), unique=True)
    pw_hash = db.Column(db.String(120))
    email = db.Column(db.String(80))
    name_title = db.Column(db.String(80))
    name_first = db.Column(db.String(80))
    name_last = db.Column(db.String(80))
    gender = db.Column(db.String(40))
    location = db.Column(db.String(80))
    birthday = db.Column(db.String(40))
    skin_tone = db.Column(db.String(100))
    
    def __init__(self, created_at, username, pw_hash, email, name_title, name_first, name_last, gender, location, birthday, skin_tone):
        self.created_at = created_at
        self.username = username
        self.pw_hash = pw_hash
        self.email = email
        self.name_title = name_title
        self.name_first = name_first
        self.name_last = name_last
        self.gender = gender
        self.location = location
        self.birthday = birthday
        self.skin_tone = skin_tone

    def __repr__(self):
        return '<User %r>' % self.username

class Follower(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    is_following = db.Column(db.Integer)

    def __init__(self, user_id, is_following):
        self.user_id = user_id
        self.is_following = is_following

    def __repr__(self):
        return '<Follower %r>' % str(self.user_id) +'>'+ str(self.is_following)

db.create_all()
