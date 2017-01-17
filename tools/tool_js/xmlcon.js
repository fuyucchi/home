
// convert Sprite Sheet XML > Objective-c


var dropZone = document.getElementById('drop_zone');

function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    console.log("fdrop");
    var files = evt.dataTransfer.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
        output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
            f.size, ' bytes, last modified: ',
            f.lastModifiedDate.toLocaleDateString(), '</li>');
    }
    document.getElementById('file_list').innerHTML = '<ul>' + output.join('') + '</ul>';

    var reader = new FileReader();
    //テキスト形式で読み込む
    reader.readAsText(files[0]);

    var vertex = [];
    var texcoord = [];

    var index = [];
    var indexCon =[];


    reader.onload = function(ev){

        var xml = $(reader.result);
        var $x = $(xml[8]);


        var inputAllSize = parseInt(document.output.baseSQ.value);
        var inputBaseUnitSize = parseInt(document.output.unitsize.value);// ユニットサイズ





        var masterBaseSize = parseInt( $x.attr('width'));//8192で換算


        var calcScale = inputAllSize / masterBaseSize;

        // n  => name of the sprite
        // x  => sprite x pos in texture
        // y  => sprite y pos in texture
        // w  => sprite width (may be trimmed)
        // h  => sprite height (may be trimmed)
        // pX => x pos of the pivot point (relative to sprite width)
        // pY => y pos of the pivot point (relative to sprite height)
        // oX => sprite's x-corner offset (only available if trimmed)
        // oY => sprite's y-corner offset (only available if trimmed)
        // oW => sprite's original width (only available if trimmed)
        // oH => sprite's original height (only available if trimmed)




        var spArr = [];
        xml.find('sprite').each(function() {
          var _t = {};
            var _txml = $(this);
            _t.name = _txml.attr('n');

            _t.offsetX = parseInt(_txml.attr('x'));
            _t.offsetY = parseInt(_txml.attr('y'));

            _t.trimW = parseInt(_txml.attr('w'));
            _t.trimH = parseInt(_txml.attr('h'));

            _t.trimLeft = parseInt(_txml.attr('oX'));
            _t.trimTop = parseInt(_txml.attr('oY'));

            _t.originalW = parseInt(_txml.attr('oW'));
            _t.originalH = parseInt(_txml.attr('oH'));


            spArr.push(_t);


            //==========


        });



      var _r = "";

      // _r += "GLfloat unitSize = " + ((calcScale * inputBaseUnitSize / inputAllSize).toFixed(12)) + ';\n\n';

      _r += "//offsetX    \toffsetY    \ttrimLeft    \t    trimTop    \ttrimW    \ttrimH    \toriginalW    \torojinalH\t\t _count=" + ((spArr.length * 8)) + ';\n\n';

      for (var u =0; u<spArr.length; u++){

        var _a = spArr[u];
        // console.log((calcScale * _a.offsetX / masterBaseSize) );

        _r += (calcScale * _a.offsetX / masterBaseSize).toFixed(7) + ',\t';
        _r += (calcScale * _a.offsetY / masterBaseSize).toFixed(7) + ',\t';
        _r += (calcScale * _a.trimLeft / masterBaseSize).toFixed(7) + ',\t';
        _r += (calcScale * _a.trimTop / masterBaseSize).toFixed(7) + ',\t';
        _r += (calcScale * _a.trimW / masterBaseSize).toFixed(7) + ',\t';
        _r += (calcScale * _a.trimH / masterBaseSize).toFixed(7) + ',\t';
        _r += (calcScale * _a.originalW / masterBaseSize).toFixed(7) + ',\t';
        _r += (calcScale * _a.originalH / masterBaseSize).toFixed(7) + ',// no.'+ (u) + '\t' + _a.name +'\n';

      }

      //テキストエリアに表示する
      document.output.txt1.value = _r;



      ///
    }

    return false
}

function handleDragEnter(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    dropZone.className ="over";
}
function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    dropZone.className ="drop";
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}
function handleDragOut(evt){
  evt.stopPropagation();
  evt.preventDefault();
  dropZone.className ="";
}


// Setup the dnd listeners.

dropZone.addEventListener('dragenter', handleDragEnter, false);
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('dragleave', handleDragOut, false);
dropZone.addEventListener('drop', handleFileSelect, false);
