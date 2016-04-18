# -*- coding: utf-8 -*-
"""
Created on Tue Apr 07 15:11:49 2014
@author: Maurizio Napolitano <napo@fbk.eu>
The MIT License (MIT)
Copyright (c) 2016 Fondazione Bruno Kessler http://fbk.eu
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
"""

from catastodb import Catasto
from gpsphoto import Photo
from bottle import Bottle, view, request, template,  static_file
import os
import json
app =Bottle()
app.config['autojson'] = True

@app.route('/serverinfo')
def serverInfo():
    servername = request.environ.get('SERVER_NAME')
    port =  request.environ.get('SERVER_PORT')
    scriptname = request.script_name
    scriptname.strip("/")
    if port != "80":
        port = ":" + port 
    else:
	port = ""
    servername = "http://" + servername +port + scriptname 
    return servername

@app.route('/www/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root= './www/')
    
@app.route('/api')
@view('api.tpl')
def apidesc():
    try:
        return {"servername": serverInfo() }
    except Exception as e:
        return e
    
@app.route('/showip')
def show_ip():
    ip = request.environ.get('REMOTE_ADDR')
    return template("Your IP is: {{ip}}", ip=ip)

@app.route('/api/particella/<y>/<x>')
def particella(x,y):
    try:
        catasto = Catasto()
        landParcel = catasto.findLandParcel(x,y)  
        return catasto.joinGeoJSON(landParcel)
    except Exception as e:
        return e

@app.route('/api/comune/amministrativo/<id>')
def nametownship(id):
    catasto = Catasto()
    return catasto.nameGeoTowhship(id)

@app.route('/api/comune/amministrativo/<y>/<x>')
def township(x,y):
    catasto = Catasto()
    township = catasto.findGeoTownship(x,y)
    return township

@app.route('/api/comune/catastale/<id>')
def namecadastry(id):
    catasto = Catasto()
    name = catasto.dataCadastryTownship(id)
    amm = catasto.nameTownship(name[0][1])
    d = {
    'id_amministrativo':name[0][1],
    'comune_amministrativo': amm[0][0],
    'comune_catastale': name[0][0],
    'id_comune_catastale':id}
    return json.dumps(d)

@app.route('/api/comune/catastale/<y>/<x>')
def findcadastry(x,y):
    catasto = Catasto()
    cadastries = catasto.findGeoCadastry(x,y)
    return cadastries

@app.error(404)
@view('404.tpl')
def error404(error):
    try:
        return
    except Exception as e:
        return e


@app.route('/api/upload', method='POST')
def do_upload():
    upload = request.files.get('upload')
    data = request.files.upload
    name, ext = os.path.splitext(upload.filename)
    if ext not in ('.png','.jpg','.jpeg'):
        return 'File extension not allowed.'
    save_path = os.path.curdir + os.sep + "www" + os.sep + "photos" +  os.sep + upload.filename
    if os.path.isfile(save_path):
        os.remove(save_path)
    with open(save_path, 'w') as open_file:
        open_file.write(data.file.read())
    open_file.close()
    p = Photo(save_path)
    geoposition = []
    if p.latitudine != None:
        geoposition.append(str(p.getGeoJSON()))
        catasto = Catasto()
        particelle = catasto.findLandParcel(p.longitudine,p.latitudine)  
        for p in particelle:
            geoposition.append(p)
        geoposition = catasto.joinGeoJSON(geoposition)
    return str(geoposition)

        
@app.route("/")
@view('index.tpl')
def home():
    try:
        return {"servername": serverInfo()}
    except Exception as e:
        return e
        
@app.route('/test')
def test():
    try:
        y = '46.06683'
        x = '11.12164'
        y = '46.05867'
        x = '11.11297' #?z=19
        catasto = Catasto()
        landParcel = catasto.findLandParcel(x,y)
        print len(landParcel)
        print landParcel
        cadastry = catasto.findCadastry(x,y)
        comune = catasto.findTownship(x,y)
        print cadastry
        print comune
        dimmi = catasto.touch(catasto.ammcat,catasto.ammcat_id,catasto.ammcat_label,x,y)
        print dimmi
        return "<a href='./api/particella/46.06683/11.12164'>particella/</a>"
    except Exception as e:
        print(e)
        
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8515, debug=True,reloader=True)

