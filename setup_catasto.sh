wget http://www.territorio.provincia.tn.it/geodati/798_Limiti_di_comune_catastale_07_01_2016.zip
unzip -o 798_Limiti_di_comune_catastale_07_01_2016.zip
spatialite_tool -i -shp ammcat -d catasto.sqlite -t ammcat -c CP1252 -s 3044
wget http://www.territorio.provincia.tn.it/geodati/867_Limite_di_Comune_Amministrativo_07_01_2016.zip
unzip -o 867_Limite_di_Comune_Amministrativo_07_01_2016.zip
spatialite_tool -i -shp ammcom -d catasto.sqlite -t ammcom -c CP1252 -s 3044
mkdir data
cd data
wget http://www.territorio.provincia.tn.it/geodati/catasto/1598/1598.zip
unzip -o 1598.zip
for i in `ls *.zip`
do
unzip -o $i
done
for i in `ls *.dxf`; 
do 
name=`basename $i .dxf`
cp ../ammcom.prj $name.prj
spatialite_tool -i -shp $name -d ../catasto.sqlite -t $name -c CP1252 -s 3044
done
cd ..
rm -fr data
rm *.zip
rm amm*


