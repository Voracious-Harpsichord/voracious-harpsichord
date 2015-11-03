#create DB session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import SQLALCHEMY_DATABASE_URI

engine = create_engine(SQLALCHEMY_DATABASE_URI)
session = sessionmaker(bind=engine)()
session._model_changes = {}

#import tables
from db_models.events import Event

from db_controller import user_controller as u_ctrl
from db_controller import product_controller as p_ctrl
from db_controller import sites_controller as s_ctrl

import datetime

#Add event to events
def add_event(user_id, action, view_type, data_id):
    session.add(Event(user_id, action, view_type, data_id, str(datetime.datetime.now())))
    session.commit()
    return None

#Get 100 most recent events list of events
def get_events():
    events = session.query(Event).order_by(Event.id.desc()).limit(100).all()
    results = []
    for e in events:
        event = {
            'user': u_ctrl.get_user_as_dictionary(e.user_id),
            'action': e.action,
            'view_type': e.view_type,
            'time_stamp': e.time_stamp,
            'data': None #just a default
        }
        if e.view_type == 'product':
            event['data'] = p_ctrl.get_product_as_dictionary(e.data_id)
            event['data']['comments'] = p_ctrl.get_notes(e.user_id, e.data_id)
        if e.view_type in ['article', 'blog']:
            try:
                site_info_Q = s_ctrl.query_by_id_and_type(e.data_id, e.view_type).one()
                site_info = {}
                for column in site_info_Q.__table__.columns:
                    site_info[column.name] = getattr(site_info_Q, column.name)
                event['data'] = site_info
            except:
                None
            event['data']['comments'] = s_ctrl.get_comments(e.user_id, e.view_type, e.data_id)
        
        results.append(event)

    return {'events':results}
