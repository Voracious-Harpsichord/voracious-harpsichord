#create DB session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import SQLALCHEMY_DATABASE_URI

engine = create_engine(SQLALCHEMY_DATABASE_URI)
session = sessionmaker(bind=engine)()
session._model_changes = {}

#import tables
# tested on my machine
from db_models.recommendations import Recommendation 

def get_recommendation_by_user_id(user_id):
    return session.query(Recommendation).filter(Recommendation.user_id == user_id).all()

# 
def add_recommendation(user_id, product_id, rank):
    recommendation = Recommendation(int(user_id),int(product_id),int(rank))
    session.add(product)
    session.commit()
    return {
        'user_id':int(user_id),
        'product_id':int(user_id),
        'rank':int(rank)
    }

#Delete all recommendations a user has
def remove_recommendation(user_id):
    session.delete(session.query(Recommendation).filter(Recommendation.user_id == user_id).all())
    session.commit()
    return None
