#create DB session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import SQLALCHEMY_DATABASE_URI

engine = create_engine(SQLALCHEMY_DATABASE_URI)
session = sessionmaker(bind=engine)()
session._model_changes = {}

#import tables
# tested on my machine
from db_models.recommendations import Recommendation, Personal_Rec

from db_controller import product_controller as p_ctrl
from db_controller import user_controller as u_ctrl

def get_recommendation_by_user_id(user_id):
    recommendations = session.query(Recommendation).filter(Recommendation.user_id == user_id).all()
    results = []
    for r in recommendations:
        results.append(
            p_ctrl.get_product_as_dictionary(r.product_id)
            )
    return results
    



def add_recommendation(user_id, product_id, rank):
    recommendation = Recommendation(user_id,product_id,rank)
    session.add(recommendation)
    session.commit()
    return {
        'user_id':user_id,
        'product_id':product_id,
        'rank':rank
    }
# improve this later
def populate_new_user_recommendations(user_id):
    for i in range(1,6):
        product_id = i
        rank = i
        add_recommendation(user_id, product_id, rank)

#Delete all recommendations a user has
def remove_recommendation(user_id):
    session.query(Recommendation).filter(Recommendation.user_id == user_id).delete()

    session.commit()
    return None

#PERSONALS

#retreive personal recs
def get_personal_recs(user_id):
    #filter by to user id
    recs = session.query(Personal_Rec).filter(Personal_Rec.to_user_id == user_id).all()
    results = []
    for r in recs:
        rec = {'id': r.id}
        #replace from_user_id with full user object
        rec['product'] = p_ctrl.get_product_as_dictionary(r.product_id)
        #replace product_id with full product
        rec['from_user'] = u_ctrl.get_user_as_dictionary(r.from_user_id)
        results.append(rec)
    return results

#add personal rec
def add_personal_rec(from_user_id, to_user_id, product_id):
    #check that rec doesn't already exists
    if session.query(Personal_Rec).filter(Personal_Rec.from_user_id == from_user_id, Personal_Rec.to_user_id == to_user_id, Personal_Rec.product_id == product_id).count() > 0:
        return None
    #add recomendation
    rec_id = session.add(Personal_Rec(from_user_id, to_user_id, product_id))
    session.commit()
    #response info
    rec = {'id': rec_id}
    rec['product'] = p_ctrl.get_product_as_dictionary(product_id)
    rec['to_user'] = u_ctrl.get_user_as_dictionary(to_user_id)
    return rec



