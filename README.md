# tawolare ver 0.1
web api per consultare i dati del catasto fondiaro della Provincia Autonoma di Trento

# demo
[http://tavolare.labmod.org](http://tavolare.labmod.org/map/)
## screenshot
![particella catastale](https://github.com/napo/tawolare/blob/master/screenshots/particella_da_clic.png?raw=true)
![particella foto aerea](https://github.com/napo/tawolare/blob/master/screenshots/particella_foto_area.png?raw=true)
![layer particelle catastali](https://github.com/napo/tawolare/blob/master/screenshots/particelle_catastali.png?raw=true)
![ricerca per numero particella](https://github.com/napo/tawolare/blob/master/screenshots/ricerca_particella.png?raw=true)
![da interrogazione per codice](https://github.com/napo/tawolare/blob/master/screenshots/catasto_su_osm.png?raw=true)
![caricamento foto](https://github.com/napo/tawolare/blob/master/screenshots/carica_foto.png?raw=true)
![foto caricata](https://github.com/napo/tawolare/blob/master/screenshots/foto_parco.png?raw=true)


# descrizione
L'applicazione mostra i dati del catasto della Provincia Autonoma di Trento<br/>
I dati vengono dal rilascio in open data da parte del servizio competente sul geocatalogo provinciale e sul portale dati.trentino.it

Funzioni principali
- doppio clic sulla mappa<br/>visualizza una poligonale contenente le informazioni sulla particella catastale nel punto dove si è fatto il clic
- upload photo<br/> è possibile caricare fotografie arricchite da coordinate gps per individuare le particelle catastali
  


# installazione
## pre-requisiti
- libreria [spatialite](https://www.gaia-gis.it/fossil/libspatialite/index) versione 4.3 o successiva
- [spatialite-tools](https://www.gaia-gis.it/fossil/spatialite-tools/index) versione 4.3 o successivo (necessario per la preparazione dei dati)
- python e librerie dipedenti (pysqlite2, ExifRead, PIL, bottle, geojson, Shapely)

## preparazione dei dati
i dati vengono serviti attraverso spatialite. Il file è generato attraverso il download dei file .shp dal sito http://dati.trentino.it in merito a catasto e confini amministrativi.
Il totale dei dati corrisponde a 600Mb<br/>
Per il download è sufficente seguire queste istruzioni da una bash shell.
```bash
chmod +x setup_catasto.sh
./setup_catasto.sh
```
nota: sulla macchina deve essere presente wget

## utilizzo
Una volta preparati i dati, e sufficente installare le librerie python dipendenti attraverso pip
```bash
pip install -r requirements)
```
L'applicazione è quindi pronta per essere utilizzata sul proprio computer avviandola da command line
```bash
python tawolare.py
```
e aprire un browser all'indirizzo http://127.0.0.1:8515

## installazione su un server
l'applicazione può essere installata su un server pubblico attraverso il modulo WSGI di Apache.<br/>
Sono forniti come esempio i file:
- *catasto.conf*<br/> che contiene la configurazione di un virtualhost di apache
- *adapter.wsgi*<br/> lo script python di unione al modulo WSGI

# web API
l'applicazione, messa in produzione, offre una serie di API per permettere quindi operazioni come script, nuove interfacce o integrazioni con strumenti come [Open Refine](http://openrefine.org/)<br/>
Le API restituiscono [geojson](http://geojson.org/)<br/>

| API        | Descrizione           | Metodo  |
| ------------- |:-------------:| -----:|
| http://servername/api/particella/*latitudine*/*longitudine* | informazioni particella da latitudine e longitudine espresse in WGS84 | GET |
| http://servername/api/comune/catastale/*latitudine*/*longitudine* | informazioni comune catastale da latitudine e longitudine espresse in WGS84 | GET |
| http://servername/api/comune/catastale/*id*| informazioni comune catastale da identificativo univoco | GET |
| http://servername/api/comune/amministrativo/*latitudine*/*longitudine* | informazioni comune amministrativo latitudine e longitudine espresse in WGS84 | GET |
| http://servername/api/comune/amministrativo/*id*| informazioni comune amministrativo da identificativo univoco | GET |
| http://servername/api/upload| informazioni particella da foto con geotag - l'immagine va inviata con la variabile *filename* | POST |

# ulteriori librerie utili
## gpsphoto.py
classe python che recupera, in formato geojson, le informazioni geografiche contenute in una foto<br/>
Es.
```python
from gpsphoto import Photo
foto = Photo('esempi/trento.jpg')
print foto.getGeoJSON()
```
output
```json
{
	"geometry": {
		"coordinates": [11.125277777777779, 46.07194444444445],
		"type": "Point"
	},
	"id": 0,
	"properties": {
		"altitudine": "270",
		"img": "thumb_trento.jpg",
		"timestamp": "2016:03:23 08:24:20"
	},
	"type": "Feature"
}
```
## catastodb.py
classe python attraverso cui interrogare il file sqlite usato dall'applicazione
Es.
```python
from catastodb import Catasto
catasto = Catasto()
print catasto.findLandParcel(46.0910463043362,11.118695139884947)
```

```bash
[{
	"geometry": {
		"coordinates": [
			[
				[11.11869463631923, 46.09079590119148],
				[11.11868418911383, 46.09081610474358],
				[11.11861400188874, 46.09079783932385],
				[11.1186087469858, 46.0908137220765],
				[11.11862113862539, 46.09081592521822],
				[11.11856896592929, 46.09090610060361],
				[11.11834704763568, 46.09084766256548],
				[11.11832622002732, 46.09087650760118],
				[11.11834272759176, 46.09088233531565],
				[11.11829472161798, 46.0909681846816],
				[11.11828025857287, 46.090966698588],
				[11.11826461982089, 46.09099194307986],
				[11.11854845636919, 46.091066440393],
				[11.11851919254612, 46.09112632077393],
				[11.11833135309015, 46.09107666442293],
				[11.1182447500223, 46.09123029721121],
				[11.11890210222146, 46.09140332179578],
				[11.11898665945666, 46.09125043692791],
				[11.11880813775941, 46.09120442922584],
				[11.11883947711033, 46.09114383780485],
				[11.11912324507631, 46.0912183152132],
				[11.11913578054734, 46.09119451338703],
				[11.11912340902204, 46.09118942228664],
				[11.1191704033271, 46.09110286998068],
				[11.1191838166997, 46.09110651969297],
				[11.11920156137272, 46.09107550638532],
				[11.11897454315785, 46.09101562617958],
				[11.11902673686483, 46.09092329483017],
				[11.11904014778205, 46.09092766793137],
				[11.11904746370041, 46.09091323825563],
				[11.11897213179379, 46.09089279370324],
				[11.11898257645909, 46.09087331452769],
				[11.11869463631923, 46.09079590119148]
			]
		],
		"type": "Polygon"
	},
	"id": 0,
	"properties": {
		"area": 2833.49580653012,
		"centroidX": 11.118700942224383,
		"centroidY": 46.091088891205395,
		"codcc": 406,
		"comu": 205,
		"comune": "TRENTO",
		"ctwexpr": 639,
		"ctwexpr_id": 608,
		"dcat": "TRENTO",
		"dsup_sopra": "",
		"dsup_sotto": "",
		"fab": "S",
		"num": ".6280",
		"perimeter": 325.956489060617,
		"tipop": "C"
	},
	"type": "Feature"
}]
```
