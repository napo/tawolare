# tawolare
web api per consultare i dati del catasto fondiaro della Provincia Autonoma di Trento
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

# web API
l'applicazione, messa in produzione, offre una serie di API per permettere quindi operazioni come script, nuove interfacce o integrazioni con strumenti come [Open Refine](http://openrefine.org/)
Le API restituiscono geojson

| API        | Descrizione           | Metodo  |
| ------------- |:-------------:| -----:|
| http://servername/api/particella/*latitudine*/*longitudine* | informazioni particella da lat/long | get |
| http://servername/api/comune/catastale/*latitudine*/*longitudine* | informazioni comune catastale da lat/long | get |
| http://servername/api/comune/catastale/*id*| informazioni comune catastale da identificativo univoco | get |
| http://servername/api/comune/amministrativo/*latitudine*/*longitudine* | informazioni comune amministrativo da lat/long | get |
| http://servername/api/comune/amministrativo/*id*| informazioni comune amministrativo da identificativo univoco | get |
| http://servername/api/upload| informazioni particella da foto con geotag | post |

