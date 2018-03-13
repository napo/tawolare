#scarico limiti catastali
wget http://www.territorio.provincia.tn.it/geodati/798_Metadato_12_02_2018.zip -O limiti_comune_catastale.zip
unzip -o limiti_comune_catastale.zip
spatialite_tool -i -shp ammcat -d catasto.sqlite -t ammcat -c CP1252 -s 3044
wget http://www.territorio.provincia.tn.it/geodati/867_Limite_di_Comune_Amministrativo_12_02_2018.zip -O limiti_amministrativi.zip
unzip -o limiti_amministrativi.zip
spatialite_tool -i -shp ammcom -d catasto.sqlite -t ammcom -c CP1252 -s 3044
mkdir data
cd data
wget http://www.territorio.provincia.tn.it/geodati/catasto/2039_catasto_shp.zip -O catasto.zip
unzip -o catasto.zip
rm catasto.zip
for i in `ls *.zip`
do
name="`basename $i _shp.zip`_vl_parcel_poly"
unzip -o $i $name*
nname="`basename $i _shp.zip`"
spatialite_tool -i -shp $name -d ../catasto.sqlite -t $nname -c CP1252 -s 3044
done
cd ..
rm -fr data
rm *.zip
rm amm*


