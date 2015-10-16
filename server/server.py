from flask import Flask, request, send_from_directory

# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_url_path='/..')

#serve index
@app.route('/')
def send_index():
    return app.send_static_file('/client/index.html') 

#serve client dependecies
@app.route('/bower_components/<path:path>')
def send_dependencies(path):
    return send_from_directory('/client/bower_components', path)

#handle api calls


#start server
if __name__ == "__main__":
    app.run()