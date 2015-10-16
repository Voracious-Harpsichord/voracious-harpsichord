from flask import Flask, request, send_from_directory, jsonify

# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_url_path='')

@app.route('/')
def send_js():
    return send_from_directory('static', 'index.html')

#serve client dependecies
@app.route('/bower_components/<path:path>')
def send_dependencies(path):
    return send_from_directory('/client/bower_components', path)

#handle api calls

#start server
if __name__ == "__main__":
    app.run()
