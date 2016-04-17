    <script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <script src="www/js/bootstrap.min.js"></script>
    <script src="www/js/plugins/canvas-to-blob.min.js" type="text/javascript"></script>
    <script src="www/js/fileinput.min.js" type="text/javascript"></script>
    <script src="www/js/fileinput_locale_it.js" type="text/javascript"></script>
	<script src="www/leaflet.js"></script>
    <script src="www/Control.MiniMap.min.js"></script>
    <script src="www/js/l.control.geosearch.js"></script>
    <script src="www/js/l.geosearch.provider.openstreetmap.js"></script>
    <script src="www/js/leaflet-hash.js"></script>
    <script src="www/L.Control.Locate.min.js"></script>
    <script src="www/js/exif.js"></script>
<script src="www/js/trentino.js"></script>
<script src="www/js/map.js"></script>
    <style>
html, body, #container {
  height: 100%;
  overflow: hidden;
  width: 100%;
}
body {
  padding-top: 50px;
}
.navbar {
  min-height: 50px;
}
#map {
  height: 100%;
  width: auto;
}
    </style>
<div class="modal fade" id="errorMessage" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="labelError">ERRORE</h4>
      </div>
      <div class="modal-body">
      <div class="alert alert-warning" role="alert">
        L'immagine caricata non contiene informazioni geografiche.
       </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
<div class="modal fade" id="API" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="labelAPI">API</h4>
      </div>
      <div class="modal-body">
% include('api.tpl')
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
<div class="modal fade" id="info" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="labelInfo">INFO</h4>
      </div>
      <div class="modal-body">
% include('info.tpl')
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
  </body>
</html>
