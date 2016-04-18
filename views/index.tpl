% include('header.tpl', title='catasto trentino')
<body>
    <div class="navbar navbar-default navbar-fixed-top" role="navigation">
      <div class="container-fluid">

          <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand">Catasto Fondiario Trentino</a>
          </div>

        <div class="navbar-collapse collapse">
            <ul class="nav navbar-nav">
              <li><a href="#" data-toggle="modal" data-target="#uploadphoto">Localizza con foto</a>
              <li><a href="#" data-toggle="modal" data-target="#info">Info</a></li>
              <li><a href="#" data-toggle="modal" data-target="#API">API</a></li>
            </ul>
        </div>
      </div>
    </div>
   <div id="container">
        <div id="uploadphoto" class="modal fade" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">Carica foto con geotag</h4>
                    </div>
                    <div class="modal-body">
                    <ol>
                    <li>abilita la registrazione del geotag (= salva località) sul tuo smartphone</li>
                    <li>scatta la foto</li>
                    <li>inviala a questo servizio</li>
                    <li>otterrai le informazioni della particella catastale da dove hai scattato la foto</li>
                    </ol>
                        <form enctype="multipart/form-data" method="POST">
                            <input id="uploadfile" class="file" type="file" multiple data-min-file-count="1" name="upload">
                        </form>
                    </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                  </div>
            </div>
        </div>
       </div>
      <div id="map"></div>
    </div>
% include('footer.tpl')
