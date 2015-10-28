#create DB session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import SQLALCHEMY_DATABASE_URI

engine = create_engine(SQLALCHEMY_DATABASE_URI)
session = sessionmaker(bind=engine)()
session._model_changes = {}

#import tables
from db_models.sites import sites, User_sites

def get_site_by_site_id(site_id):
    return session.query(Site).filter(Site.id == site_id).one()

def verify_site = function(site_name, article=''):
    site = session.query(Site).filter(Site.name == site_name, Site.article == site_article)
    if site.count() > 0:
        return site.first().id
    else:
        return None

def verify_site_by_id(site_id):
    return session.query(Site).filter(Site.id == site_id).count() > 0

def get_sites_by_user(user_id):
    user_site_ids = session.query(User_site).filter(User_site.user_id == user_id).all()
    
    results = []
    for s in user_site_ids:
        site = session.query(Site).filter(Site.id == s.user_site_id).one()
        results.append({
            #id comes from the User_site table id
            'site_id': s.id,
            'site_name': site.name,
            'url': site.url,
            'article_name': site.article,
            'comment': s.comment
        })
    
    return results

def add_site_to_sites(name, url, article):
    session.add(Site(name, url, article))
    session.commit()
    return session.query(Site).filter(Site.id == id).one().id

def add_user_to_site(user_id, site_id, comment):
    site = User_site(int(user_id), int(site_id), comment)
    session.add(site)
    session.commit()
    site_universal = session.query(Site).filter(Site.id == site_id).one()
    site_user = session.query(User_site).filter(User_site.id == site.id).one()

    return {
        #id comes from the User_site table id
        'site_id': site.id,
        'site_name': site_universal.name,
        'url': site_universal.url,
        'article_name': site_universal.article,
        'comment': site_user.comment
    }

def edit_user_to_site(id, user_id, site_id, comment):

    session.query(User_site).\
        filter(User_site.id == id).\
        update({
            'comment': comment
        })

    session.commit()
    site_universal = session.query(Site).filter(Site.id == site_id).one()
    site_user = session.query(User_site).filter(User_site.id == id).one()

    return {
        #id comes from the User_site table id
        'site_id': site.id,
        'site_name': site_universal.name,
        'url': site_universal.url,
        'article_name': site_universal.article,
        'comment': site_user.comment
    }

def remove_user_from_site(site_id):
    session.delete(session.query(User_site).filter(User_site.id == site_id).one())
    session.commit()
    return None
