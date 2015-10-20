from server import app
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import SQLALCHEMY_DATABASE_URI

db = SQLAlchemy(app)
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI

engine = create_engine(app)
session = sessionmaker(bind=engine)()
session._model_changes = {}

from users import User
from products import Product, User_Product

db.create_all()

