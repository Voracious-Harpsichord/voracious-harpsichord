import unittest
import tempfile
import json
import os
os.environ['test'] = 'test'
#remove left over DB rom previous tests
try:
    os.remove('testDB.sqlite')
except OSError:
    pass
import server



class ServerTestCase(unittest.TestCase):

    def setUp(self):
        self.db_fd, server.app.config['DATABASE'] = tempfile.mkstemp()
        server.app.config['TESTING'] = True
        self.app = server.app.test_client()

    def tearDown(self):
        os.close(self.db_fd)
        os.unlink(server.app.config['DATABASE'])

    """test functions need to start with 'test' for TestCase class to automatically run them"""
    #Test that app serves index.html
    def test_0_index(self):
        rv = self.app.get('/')
        assert '<!DOCTYPE html>' in str(rv.data)

    """API ENDPOINTS"""

    #AUTHENTICATION (/user, /newUser)
    def test_1_signup(self):
        self.app.post('/api/newUser',
            content_type='application/json',
            data=json.dumps({'username': 'test1','password': 'test1'}))
        rv = self.app.post('/api/user',
            content_type='application/json',
            data=json.dumps({'username': 'test1','password': 'test1'}))
        assert json.loads(rv.data.decode())['userid'] == 1 


    #FOLLOWERS (/user/follow)
    def test_2_followers(self):
        self.app.post('/api/newUser',
            content_type='application/json',
            data=json.dumps({'username': 'test2','password': 'test2'}))
        rv = self.app.post('/api/user/follow/1',
            content_type='application/json',
            data=json.dumps({'userid':2}))

        rv = self.app.get('/api/user/follow/1',content_type='application/json')
        assert len(json.loads(rv.data.decode())['following']) == 1

        rv = self.app.get('/api/user/follow/2',content_type='application/json')
        assert len(json.loads(rv.data.decode())['followers']) == 1

    #PRODUCTS (/userProducts, products)
    def test_3_products(self):
        #user should be able to add a product to their collection
        self.app.post('/api/userProducts/1',
            content_type='application/json',
            data=json.dumps({
                'product_name': 'HELLO',
                'brand_name': 'WORLD',
                'product_category': 'TEST',
                'product_size': 'TEST',
                'product_status': 'TEST',
                'product_notes': 'TEST',
                'product_color': 'TEST',
                'product_notes': 'Commenting on a product'
                }))

        # more mock-up products to be reccomended
        self.app.post('/api/userProducts/1',content_type='application/json',data=json.dumps({'product_name': 'a','brand_name': 'a','product_category': '','product_size': '','product_status': '','product_notes': '','product_color': ''}))
        self.app.post('/api/userProducts/1',content_type='application/json',data=json.dumps({'product_name': 'b','brand_name': 'b','product_category': '','product_size': '','product_status': '','product_notes': '','product_color': ''}))
        self.app.post('/api/userProducts/1',content_type='application/json',data=json.dumps({'product_name': 'c','brand_name': 'c','product_category': '','product_size': '','product_status': '','product_notes': '','product_color': ''}))
        self.app.post('/api/userProducts/1',content_type='application/json',data=json.dumps({'product_name': 'd','brand_name': 'd','product_category': '','product_size': '','product_status': '','product_notes': '','product_color': ''}))
        self.app.post('/api/userProducts/1',content_type='application/json',data=json.dumps({'product_name': 'e','brand_name': 'e','product_category': '','product_size': '','product_status': '','product_notes': '','product_color': ''}))
        
        #user should be able to retrieve that product information
        rv = self.app.get('/api/userProducts/1', content_type='application/json')
        product = json.loads(rv.data.decode())['userProducts'][0]
        assert product['product_name'] == 'HELLO'
        assert product['brand_name'] == 'WORLD'

        #and only their product information
        rv = self.app.get('/api/userProducts/2', content_type='application/json')
        assert len(json.loads(rv.data.decode())['userProducts']) == 0

    #SITES (/sites)
    def test_4_sites(self):
        #user can add a site
        self.app.post('/api/sites/1',
            content_type='application/json',
            data=json.dumps({
                'url': 'http://www.xkcd.com',
                'comment': 'Commenting on a site'
                }))

        #user can view the sites they have added
        rv = self.app.get('/api/sites/1', content_type='application/json')
        assert len(json.loads(rv.data.decode())['sites']) == 1

    #RECOMMENDATIONS (/recommendations)
    def test_5_reccomendations(self):
        self.app.post('/api/newUser',
            content_type='application/json',
            data=json.dumps({'username': 'test3','password': 'test3'}))

        #should have default recomendations
        # rv = self.app.get('api/recommendations/3', content_type='application/json')
        # assert len(json.loads(rv.data.decode())['universal']) > 0

        # #should be able to reccomend
        # self.app.post('api/recommendations/3',
        #     content_type='application/json',
        #     data=json.dumps({'to_user_id': 2, 'product_id':1}))

        # #should be able view reccomended products
        # rv = self.app.get('api/recommendations/2', content_type='application/json')
        # assert len(json.loads(rv.data.decode())['personal']) > 0

    #NEWS FEED (/events)
    def test_6_feed(self):
        #events are record as user add to the database
        rv = self.app.get('/api/events', content_type='application/json')
        events = json.loads(rv.data.decode())['events']
        #and served in the reverse order they occured
        print("events", events)
        assert events[0]['data']['url'] == 'http://www.xkcd.com'
        assert events[-1]['data']['product_name'] == 'HELLO'
        #and those events will have user generated comments
        assert events[0]['comments'] == 'Commenting on a site'
        assert events[-1]['comments'] == 'Commenting on a product'

if __name__ == '__main__':
    unittest.main()
