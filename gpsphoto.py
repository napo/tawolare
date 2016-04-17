# -*- coding: utf-8 -*-
#from __future__ import unicode_literals
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

import exifread
import PIL
from PIL import Image
import os
from geojson import Feature, Point


class Photo():    
    latdegree = None
    lotdegree = None
    latref = None
    lonref = None
    latitudine = None
    longitudine = None
    altitude = None
    timestampimg = None
    tags = None
    photofile = None

    def dms2dd(self,degrees, minutes, seconds, direction):
        dd = float(degrees) + float(minutes)/60 + float(seconds)/(60*60);
        if direction == 'S' or direction == 'W':
            dd *= -1
        return dd;
    

    def __init__(self,photofile):
        self.photofile = photofile
        f = open(photofile,"rb")
        tags = exifread.process_file(f)      
        if tags.has_key('GPS GPSLatitude'):
            try:
                self.latdegree = tags['GPS GPSLatitude'].values
                degreelat = self.latdegree[0].num
                minuteslat = self.latdegree[1].num
                secondslat = self.latdegree[2].num/self.latdegree[2].den
                self.lotdegree = tags['GPS GPSLongitude'].values
                degreelon = self.lotdegree[0].num
                minuteslon = self.lotdegree[1].num
                secondslon = self.lotdegree[2].num/self.lotdegree[2].den
                self.latref = tags['GPS GPSLatitudeRef'].values
                self.lonref = tags['GPS GPSLongitudeRef'].values
                self.latitudine = self.dms2dd(degreelat,minuteslat,secondslat,self.latref)
                self.longitudine = self.dms2dd(degreelon,minuteslon,secondslon,self.lonref)
                self.altitude = tags['GPS GPSAltitude'].values[0]
                self.timestampimg = tags['Image DateTime'].values
            except KeyError:
                pass
            self.tags = tags
                      
    def name(self):
        name = self.photofile.split(os.sep)[len(self.photofile.split(os.sep))-1]
        return name
        
    def resizedname(self,thumb="thumb_"):
        resize_name = thumb + self.name()
        return resize_name


    def getGeoJSON(self,id=0,basewidth=300):
        photoPoint = []
        if self.latitudine is not None:
            geometry = Point((self.longitudine, self.latitudine))
            properties = {}
            if self.altitude is not None:
                properties["altitudine"] = str(self.altitude)
            properties["img"] = self.resize(basewidth)
            if self.timestampimg is not None:
                properties["timestamp"] = str(self.timestampimg)
            photoPoint = Feature(geometry=geometry, id=0,properties=properties)
        return photoPoint

    def resize(self,basewidth=300):
        img = Image.open(self.photofile)
        wpercent = (basewidth / float(img.size[0]))
        hsize = int((float(img.size[1]) * float(wpercent)))
        img = img.resize((basewidth, hsize), PIL.Image.ANTIALIAS)
        destdir = str(self.photofile).replace(self.name(),"")
        img.save(destdir + self.resizedname())
        return self.resizedname()
