from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
from bson import json_util
from bson.json_util import dumps
from itertools import groupby

app = Flask(__name__)

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'outlier'
COLLECTION_NAME = 'projects'
FIELDS = {'protocol_type': True, 'service': True, 'flag': True, 'src_bytes': True, 'dst_bytes': True, 'label': True,'_id': False}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/outlier/projects")
def outlier_projects():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME][COLLECTION_NAME]
    projects = collection.find(projection=FIELDS)
    json_projects = []
    for project in projects:
        #print project
        if len(project) == 6:
            json_projects.append(project)
    json_projects.sort(key=lambda r: r['label'])
	
    #file = open('dump.json','w')
    
    root = []
    for label, items in groupby(json_projects, key=lambda r: r['label']):
        l = []
        parent = {}
        parent['name'] = label
        l.extend(items)
        child = []
        l.sort(key=lambda r: r['service'])
        for service, p_items in groupby(l, key=lambda r: r['service']):
            subchild = {}
            subchild["name"] = service
            subchild["size"] = len(list(p_items))
            child.append(subchild)
        parent['children'] = child
        root.append(parent)
        
    print root
    json_projects = json.dumps({'name':'grandparent', 'children':root}, default=json_util.default)
    #file.write(json_projects)
    connection.close()
    return json_projects

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)