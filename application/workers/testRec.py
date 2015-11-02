# testing db
# user logs into application
# with attributes
from db_controller import user_controller as u_ctrl
from db_controller import product_controller as p_ctrl
from db_controller import recommendations_controller as r_ctrl

# user checks recommendations
u = {
	'username':'John123',
	'email':'john@hotmail.com',
	'name_title':'Mr',
	'name_first':'John',
	'name_last':'T-bone',
	'gender':'M',
	'skin_tone':'fair',
	'birthday':'2010/03/10'
}

u_ctrl.make_new_user(u):

# user saves products

# user checks recommendations

