# testing db
# user logs into application
# with attributes
from db_controller import user_controller as u_ctrl
from db_controller import product_controller as p_ctrl
from db_controller import recommendation_controller as r_ctrl

# user checks recommendations
u = {
	'username':'John1234',
	'password':12345,
	'email':'john@hotmail.com',
	'name_title':'Mr',
	'name_first':'John',
	'name_last':'T-bone',
	'gender':'M',
	'skin_tone':'fair',
	'birthday':'2010/03/10'
}
# delete test case
from db_models.users import User
#create DB session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import SQLALCHEMY_DATABASE_URI

engine = create_engine(SQLALCHEMY_DATABASE_URI)
session = sessionmaker(bind=engine)()
session._model_changes = {}
session.rollback()

session.delete(session.query(User).filter(User.username == u['username']).all())
session.delete(session.query(Recommendation).filter(Recommendation.user_id == user_id).all())
session.commit()
# make new user shoudl trigger some recomendations
u_ctrl.make_new_user(u)

user_id = u_ctrl.get_user_id(u['username'])
print('user_id *************',user_id)
# now we should have some 5 recommendations
recs = get_recommendation_by_user_id(user_id)

print(recs)

# user saves products with ratings

# the recommendations should now be updated


# user checks recommendations
# after some delay the recommendations should be changed

