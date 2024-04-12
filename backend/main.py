from flask import Flask, jsonify, request
from flask_pymongo import PyMongo

app = Flask(__name__)
CQRS(app)
# Replace the URI with your actual MongoDB Atlas URI
app.config["MONGO_URI"] = "mongodb+srv://root:root@localhost:3001/test"

mongo = PyMongo(app)

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = mongo.db.tasks.find()
    result = []
    for task in tasks:
        result.append({'_id': str(task['_id']), 'title': task['title']})
    return jsonify(result)

@app.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.get_json()
    mongo.db.tasks.insert_one({'title': data['title']})
    return jsonify({'message': 'Task added successfully'}), 201

if __name__ == '__main__':
    app.run(debug=True)