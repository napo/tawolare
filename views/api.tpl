<div id="apicontent">
<ul id="tabs" class="nav nav-tabs nav-stacked" data-tabs="tabs">
    <li class="active"><a href="#api1" data-toggle="tab">particella catastale da latitudine e longitudine</a></li>
    <li><a href="#api2" data-toggle="tab">comune castale da latitudine e longitudine</a></li>
    <li><a href="#api3" data-toggle="tab">comune amministrativo da latitudine e longitudine</a></li>
    <li><a href="#api4" data-toggle="tab">comune catastale da codice identificativo</a></li>
    <li><a href="#api5" data-toggle="tab">comune amministrativo da codice identificativo</a></li>
    <li><a href="#api6" data-toggle="tab">particella catastale da foto con geotag</a></li>
</ul>

<div id="tab-apicontent" class="tab-content">
    <div class="tab-pane active" id="api1">
    <h2>particella da latitudine e longitudine</h2>
    <h3>endpoint</h3>
    <div class="well well-sm"><span style="font-family: courier">{{servername}}/api/particella/<em>latitudine</em>/<em>longitudine</em></span></div>
    <p>
    restituisce un geojson con particella catastale che contiene il punto espresso il latitudine e longitudine (WGS84).<br/>
Il geojson contiene la poligonale della particella e i seguenti attributi:
    </p>
    <p>
    <table class="table">
    <tr>
        <td>comu</td><td><em>identificativo del comune amministrativo</em></td>
    </tr>
    <tr>
        <td>comune</td><td><em>nome del comune amministrativo</em></td>
    </tr>
    <tr>
        <td>codcc</td><td><em>identificativo del comune catastale</em></td>
    </tr>
    <tr>
        <td>dcat</td><td><em>nome del comune catastale</em></td>
    </tr>
    <tr>
        <td>num</td><td><em>numero della particella catastale</em></td>
    </tr>
    <tr>
        <td>tipop</td><td><em>tipo particella (<strong>P</strong>=principale, <strong>C=</strong>pertinenza)</em></td>
    </tr>
    <tr>
        <td>fab</td><td><em>particella fabbricabile (<strong>S</strong> = si, <strong>N</strong> = no)</em></td>
    </tr>
    <tr>
        <td>dsup_sopra</td><td><em>numero delle particelle che identificano diritto di
 superficie sopra il suolo </em></td>
    </tr>
    <tr>
        <td>dsup_sotto</td><td><em>numero delle particelle che identificano diritto di
 superficie sotto il suolo </em></td>
    </tr>
    <tr>
        <td>perimeter</td><td><em>perimetro dell'area in metri</em></td>
    </tr>
    <tr>
        <td>area</td><td><em>area della particella in metri quadri</em></td>
     </tr>
    <tr>
        <td>centroidX</td><td><em>contiene la longitudine del centroide del poligono</em></td>
    </tr>
    <tr>
        <td>centroidX</td><td><em>contiene la latitudine del centroide del poligono</em></td>
     </tr>
    </table>
    </p>
    <h3>esempio</h3>
<div class="well well-sm"><span style="font-family: courier"><a target="_new" href="{{servername}}/api/particella/46.0910463043362/11.118695139884947">{{servername}}/api/particella/46.0910463043362/11.118695139884947</a></div>
     </div>
     <div class="tab-pane" id="api2">
        <h2>comune catastale da latitudine e longitudine</h2>
        <h3>endpoint</h3>
        <div class="well well-sm"><span style="font-family: courier">{{servername}}/api/comune/catastale/<em>latitudine</em>/<em>longitudine</em></span></div>
        <p>
        restituisce un geojson con i dati sul comune catastale che contiene il punto espresso il latitudine e longitudine (WGS84).<br/>
    Il geojson contiene la poligonale del confine catastale, il nome del comune catastale (<em>comune_catastale</em>, l'identificativo univoco catastale (<em>id_catastale</em>) e la distanza dal punto (<em>distanza_da_punto</em>).
        </p>
    <h3>esempio</h3>
<div class="well well-sm"><span style="font-family: courier"><a target="_new" href="{{servername}}/api/comune/catastale/46.0910463043362/11.118695139884947">{{servername}}/api/comune/catastale/46.0910463043362/11.118695139884947</a></div>
        </div>
        <div class="tab-pane" id="api3">
        <h2>comune amministrativo da latitudine e longitudine</h2>
        <h3>endpoint</h3>
        <div class="well well-sm"><span style="font-family: courier">{{servername}}/api/comune/amministrativo/<em>latitudine</em>/<em>longitudine</em></span></div>
        <p>
        restituisce un geojson con il comune amministrativo che contiene il punto espresso il latitudine e longitudine (WGS84).<br/>
    Il geojson contiene la poligonale del confine amministrativo, il nome del comune amministrativo (<em>comune_catastale</em>, l'identificativo univoco amministrativo (<em>id_amministrativo</em>) e la distanza dal punto (<em>distanza_da_punto</em>).
        </p>
    <h3>esempio</h3>
<div class="well well-sm"><span style="font-family: courier"><a target="_new" href="{{servername}}/api/comune/amministrativo/46.0910463043362/11.118695139884947">{{servername}}/api/comune/amministrativo/46.0910463043362/11.118695139884947</a></div>
        </div>
        <div class="tab-pane" id="api4">
	<h2>comune catastale da codice univoco</h2>  
  	<h3>endpoint</h3>
        <div class="well well-sm"><span style="font-family: courier">{{servername}}/api/comune/catastale/<em>id</em></span></div>
	<p>restistuisce un geojson con il comune catastale corrispondente al codice catastale univoco</p>
	<h3>esempio</h3>
	<div class="well well-sm"><span style="font-family: courier"><a target="_new" href="{{servername}}/api/comune/catastale/116">{{servername}}/api/comune/catastale/116</a></div>
	</div>
        <div class="tab-pane" id="api5">
	<h2>comune amministrativo da codice univoco</h2>
        <h3>endpoint</h3>
        <div class="well well-sm"><span style="font-family: courier">{{servername}}/api/comune/catastale/<em>id</em></span></div>
        <p>restistuisce un geojson con il comune amministrativo corrispondente al codice amministrativo univoco</p>
        <h3>esempio</h3>
        <div class="well well-sm"><span style="font-family: courier"><a target="_new" href="{{servername}}/api/comune/amministrativo/116">{{servername}}/api/comune/amministrativo/116</a></div>
        </div>
        <div class="tab-pane" id="api6">
            <h2>particella catastale da foto con geotag</h2>
            <h3>endpoint</h3>
  	    <div class="well well-sm"><span style="font-family: courier">{{servername}}/api/upload/</span></div>
	    <p>
	    il metodo funziona solo in POST e va inviato il file associandolo alla variabile <em>filename</em>
	    </p>
	</div>
    </div>
</div>


  
<script type="text/javascript">
    jQuery(document).ready(function ($) {
        $('#tabs').tab();
    });
</script>    
