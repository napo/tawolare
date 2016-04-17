import sys, os, bottle
installationpath = '/var/catasto' # questa variabile deve puntare alla directory dove si trova il codice sorgente
sys.path = [installationpath] + sys.path
os.chdir(os.path.dirname(__file__))

from tawolare import app as application # This loads your application

#pplication = bottle.default_app()
