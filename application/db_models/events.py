from server import db

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer) #The user who added a thing
    action = db.Column(db.String(40)) #..."added an article"
    view_type = db.Column(db.String(40)) #the type of thing that was added ie product, blog
    data_id = db.Column(db.Integer) #the id for the type of thing that was added, to retrive more info about it
    time_stamp = db.Column(db.String(40)) #when the action was performed

    def __init__(self, user_id, action, view_type, data_id, time_stamp):
        self.user_id = user_id
        self.action = action
        self.view_type = view_type
        self.data_id = data_id
        self.time_stamp = time_stamp

    def __repr__(self):
        return '<Event %r>' % self.view_type

db.create_all()
