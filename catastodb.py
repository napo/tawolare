# -*- coding: utf-8 -*-
from __future__ import unicode_literals
#import sqlite3
from pysqlite2 import dbapi2 as sqlite3
import geojson
import shapely.wkt
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

class Catasto():
    defaultSRS = 3044
    wgs84 = 4326
    ammcom = 'ammcom'
    ammcom_id = 'COMU'
    ammcom_label = 'DESC_'
    ammcat = 'ammcat'
    ammcat_id = 'CCAT'
    ammcat_label = 'DCAT'
    ext_tablecadastry = "cp000"
    db = "catasto.sqlite"
    
    con = None
    cur = None
    def __init__(self):
        con=sqlite3.connect(self.db)        
        con.enable_load_extension(True)
        self.cur = con.cursor()
        self.cur.execute('SELECT load_extension("mod_spatialite")');
        geo = self.cur.execute("SELECT count(name) FROM sqlite_master WHERE type='table' AND name='geometry_columns';").fetchall()[0][0]
        if (geo == 0):
            self.cur.execute('SELECT InitSpatialMetadata();')

    def sqlPoint(self,x,y):
        sql = "Transform(MakePoint(%s,%s,%s),%s)" % (x,y,self.wgs84,self.defaultSRS)
        return sql

    def aroundPoint(self,table,id,label,x,y,distance=100):
        point = self.sqlPoint(x,y)
        circle = 'buffer(%s,%s)' % (point,distance)       
        sql = """select %s, %s, ST_Intersects(Geometry,%s) as touch, X(transform(centroid(geometry),4326)) as centroidX, Y(transform(centroid(geometry),4326)) as centroidY from %s where touch == 1""" % (id,label,circle,table)
        data = self.cur.execute(sql).fetchall()
        return data
        
    def touch(self,table,id,label,x,y):
        point = self.sqlPoint(x,y)
        sql = """select %s,%s,ST_Intersects(Geometry,%s) as touch, X(transform(centroid(geometry),4326)) as centroidX, Y(transform(centroid(geometry),4326)) as centroidY from %s where touch == 1""" % (id,label,point,table)
        data = self.cur.execute(sql).fetchall()
        return data        
    
    def distances(self,table,id,label,x,y,distance=100):
        data = self.aroundPoint(table,id,label,x,y,distance)
        point = self.sqlPoint(x,y)
        ids = []
        for d in data:
            ids.append(d[0])
        ids = tuple(ids)
        if len(ids) == 1:
            sids = "(%s)" % ids[0]
            ids = sids
        sql = 'select %s,%s,st_distance(%s,geometry) as distance, asWkt(st_transform(Geometry,4326)) as geometry, X(transform(centroid(geometry),4326)) as centroidX, Y(transform(centroid(geometry),4326)) as centroidY from %s where %s in %s' % (id,label,point,table,id,ids)
        data = self.cur.execute(sql).fetchall()
        return data
    
    def findTownship(self,x,y):
        result = self.distances(self.ammcom,self.ammcom_id,self.ammcom_label,x,y)
        towns = []
        for data in result:
            town = {}
            town['id'] = data[0]
            town['name']= data[1].lower()
            town['distance'] = data[2]
            town['geometry']= data[3]
	    town['centroidX'] = data[4]
	    town['centroidY'] = data[5]
            towns.append(town)
        towns = sorted(towns, key=lambda k:k['distance'])
        return towns

    def findGeoTownship(self,x,y):
        towns = self.findTownship(x,y)
        idgeom = 0
        d = []
        geotowns = []
        if len(towns) > 0:
            for data in towns:
                properties = {}
                properties['id_comune'] =  data['id']
                properties['comune_amministrativo'] = data['name']
                properties['distanza_da_punto'] = data['distance']
		properties['centroidX'] = data['centroidX']
		properties['centroidY'] = data['centroidY']
                geometry = shapely.wkt.loads(data['geometry'])
                parcel = geojson.Feature(geometry=geometry, id=idgeom,properties=properties)
                idgeom += 1
                geotowns.append(parcel)
            d = self.joinGeoJSON(geotowns)
        return d


    def joinGeoJSON(self,data):
        out = []
        if type(data) == list:
            out = '{"type": "FeatureCollection","features": ['
            for d in data:
                out += str(d) + ","
            out = out.strip(',')
            out += "]}"
        return out

    
    def findCadastry(self,x,y):
        result = self.distances(self.ammcat,self.ammcat_id,self.ammcat_label,x,y)
        cadastries = []
        for data in result:
            cadastry = {}
            cadastry['id'] = data[0]
            cadastry['name']= data[1].lower()
            cadastry['distance'] = data[2]
            cadastry['geometry']= data[3]
            cadastry['centroidX']= data[4]
            cadastry['centroidY']= data[5]
            cadastries.append(cadastry)
        cadastries = sorted(cadastries, key=lambda k:k["distance"])
        return cadastries      

    def findGeoCadastry(self,x,y):
        cadastries = self.findCadastry(x,y)
        idgeom = 0
        d = []
        geocadastries = []
        if len(cadastries) > 0:
            for data in cadastries:
                properties = {}
                properties['id_catastale'] =  data['id']
                properties['comune_catastale'] = data['name']
                properties['distanza_da_punto'] = data['distance']
                properties['centroidX'] = data['centroidX']
                properties['centroidY'] = data['centroidY']
                geometry = shapely.wkt.loads(data['geometry'])
                parcel = geojson.Feature(geometry=geometry, id=idgeom,properties=properties)
                idgeom += 1
                geocadastries.append(parcel)
            d = self.joinGeoJSON(geocadastries)
        return d

    
    def idCadastryships(self,x,y):
        cadastries = self.findCadastry(x,y)
        ids = []
        for cadastry in cadastries: 
            idcat = str(cadastry['id']).zfill(3)
            iddu = "%s%s" % (idcat,self.ext_tablecadastry)
            ids.append(iddu)
        return ids

    def dataCadastryTownship(self,ccat):
        sql = 'select %s,%s, asWkt(st_transform(Geometry,4326)) as geometry, X(transform(centroid(geometry),4326)) as centroidX, Y(transform(centroid(geometry),4326)) as centroidY from %s where %s=%s' % (self.ammcat_label,self.ammcom_id,self.ammcat,self.ammcat_id,ccat)
        results = self.cur.execute(sql).fetchall()
        return results

    def nameTownship(self,comu):
        sql = 'select %s,asWkt(st_transform(Geometry,4326)) as geometry, X(transform(centroid(geometry),4326)) as centroidX, Y(transform(centroid(geometry),4326)) as centroidY from %s where %s=%s' % (self.ammcom_label,self.ammcom,self.ammcom_id,comu)
        results = self.cur.execute(sql).fetchall()
        return results   
        
    def nameGeoTowhship(self,comu):
        town = self.nameTownship(comu)
        idgeom = 0
        d = []
        geotowns = []
        properties = {}
        properties['id_comune'] =  comu
        properties['comune_amministrativo'] = town[0][0]
        properties['centroidX'] = town[0][2] 
	properties['centroidY'] = town[0][3]
        geometry = shapely.wkt.loads(town[0][1])
        geometry = geojson.Feature(geometry=geometry, id=idgeom,properties=properties)
        geotowns.append(geometry)
        d = self.joinGeoJSON(geotowns) 
        return d
        
    def findLandParcel(self,x,y):
        idgeom = 0
        parcels = []
        results = self.idCadastryships(x,y)
        point = self.sqlPoint(x,y)
        for r in results:
            sql = 'select codcc, num, dsup_sopra, dsup_sotto, fab, aswkt(transform(geometry,4326)) as wkt, ctwexpr_ as ctwexpr, ctwexpr_id, tipop,  area, perimeter, X(transform(centroid(geometry),4326)) as centroidX, Y(transform(centroid(geometry),4326)) as centroidY  from `%s` where within(%s,Geometry) ==1' % (r,point);
            fparcels = self.cur.execute(sql).fetchall()
            if len(fparcels) > 0:
                for fparcel in fparcels:
                    properties = {}
                    properties['codcc'] = fparcel[0]
                    properties['num']= fparcel[1]
                    properties['dsup_sopra']= fparcel[2]
                    properties['dsup_sotto']= fparcel[3]
                    properties['fab']=fparcel[4]
                    properties['ctwexpr']=fparcel[6]
                    properties['ctwexpr_id']=fparcel[7]
                    properties['tipop']=fparcel[8]
                    properties['area']=fparcel[9]
                    properties['perimeter']=fparcel[10]  
                    properties['centroidX']=fparcel[11]
                    properties['centroidY']=fparcel[12]
                    dcat = self.dataCadastryTownship(fparcel[0])
                    properties['dcat'] = dcat[0][0]
                    properties['comu'] = dcat[0][1]
                    namecomu = self.nameTownship(dcat[0][1])[0][0]
                    properties['comune'] = namecomu
                    geometry = shapely.wkt.loads(fparcel[5])
                    parcel = geojson.Feature(geometry=geometry, id=idgeom,properties=properties)
                    idgeom += 1
                    parcels.append(parcel)
        return parcels


