
// convert Sprite Sheet XML > Objective-c

var _readTypeIsPlist = false;
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



    var fileName = files[0].name;
    if ( fileName.match(/.plist/)) {
      _readTypeIsPlist = true;
    }


    var reader = new FileReader();
    //テキスト形式で読み込む
    reader.readAsText(files[0]);

    var vertex = [];
    var texcoord = [];

    var index = [];
    var indexCon =[];


    reader.onload = function(ev){

        var xml = $(reader.result);

        var inputAllSize = parseInt(document.output.baseSQ.value);
        var inputBaseUnitSize = parseInt(document.output.unitsize.value);// ユニットサイズ　無視


        var masterBaseSize = 4096 * 2;//parseInt( $x.attr('width'));//8192で換算

        var calcScale = inputAllSize / masterBaseSize;
        calcScale =1;// 割合なので、強制的に 1に

        var _r = "";

        if(_readTypeIsPlist){

          $pp = $(xml[2]).children().eq(0).children('dict').eq(0);//.find('plist');

          var plistArr = [];
          $pp.children('key').each(function() {
              _v = $(this);
              var _w = {};
              _w.name = _v.text();


              var _tempStr = [];
              _v.next().find('string').each(function(){
                var _strp = $(this).text();
                if(_strp != 'undefined'){
                  _strp = _strp.replace(/{/g,'');
                  _strp = _strp.replace(/}/g,'');
                  _tempStr.push(_strp);
                }
              });
              _tempStr[10] =[];
              $.each(_tempStr[0].split(','), function(index, elem) {
                _tempStr[10].push(Number(elem));
              });
              $.each(_tempStr[1].split(','), function(index, elem) {
                _tempStr[10].push(Number(elem));//4,5
              });
              $.each(_tempStr[2].split(','), function(index, elem) {
                _tempStr[10].push(Number(elem));//6,7
              });
              _w.offsetX = parseInt(_tempStr[10][0] * 2) - 9;
              _w.offsetY = parseInt(_tempStr[10][1] * 2) - 9;

              _w.trimW = parseInt(_tempStr[10][2] * 2) + 18;//uv上の幅
              _w.trimH = parseInt(_tempStr[10][3] * 2) + 18;

              _w.originalW = parseInt(_tempStr[10][6] * 2);// 必ず正方形で使うこと
              _w.originalH = parseInt(_tempStr[10][7] * 2);
              //
              var _ww = _tempStr[10][4] * 2;
              _w.trimLeft = (_w.originalW - _w.trimW) /2 + _ww;
              var _hh = _tempStr[10][5] * 2;
              _w.trimTop = (_w.originalH - _w.trimH) /2 - _hh;// なんで逆やねん！ cocosStudio!!

              plistArr.push(_w);
          });
          _r += "//SQoffsetX  \tSQoffsetY  \ttrimLeft/u  \ttrimTop/v  \ttrimLeft+trimW/u\ttrimTop+trimH/v\t/orojinalWH/all\t_count=" + ((plistArr.length * 7)) + ';\n\n';

          for (var u =0; u<plistArr.length; u++){
            var _a = plistArr[u];
            var unitScale = _a.originalH / masterBaseSize;

            // ((_a.offsetX - _a.trimLeft) / masterBaseSize).toFixed(7)
            _r += (calcScale * (_a.offsetX - _a.trimLeft) / masterBaseSize).toFixed(7) + ',\t';
            _r += (calcScale * (_a.offsetY - _a.trimTop) / masterBaseSize).toFixed(7) + ',\t';
            _r += (1 * (_a.trimLeft) / _a.originalW).toFixed(7) + ',\t';
            _r += (1 * (_a.trimTop) / _a.originalH).toFixed(7) + ',\t';
            _r += (1 * (_a.trimLeft + _a.trimW) / _a.originalW).toFixed(7) + ',\t';
            _r += (1 * (_a.trimTop + _a.trimH) / _a.originalH).toFixed(7) + ',\t';
            // _r += (calcScale * _a.originalW / masterBaseSize).toFixed(7) + ',\t';
            _r += (calcScale * _a.originalH / masterBaseSize).toFixed(7) + ',// no.'+ (u) + '\t' + _a.name +'　'+_a.originalW+'/'+masterBaseSize+' \n';

          }


        }else{
          // xml SpriteSheet

          var $x = $(xml[8]);

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

              _t.trimW = parseInt(_txml.attr('w'));//uv上の幅
              _t.trimH = parseInt(_txml.attr('h'));

              _t.trimLeft = parseInt(_txml.attr('oX'));//uv上で隠れてるpadding
              _t.trimTop = parseInt(_txml.attr('oY'));

              _t.originalW = parseInt(_txml.attr('oW'));// 必ず正方形で使うこと
              _t.originalH = parseInt(_txml.attr('oH'));


              spArr.push(_t);
              //==========
          });





        // _r += "GLfloat unitSize = " + ((calcScale * inputBaseUnitSize / inputAllSize).toFixed(12)) + ';\n\n';
        // _r += "//offsetX  \toffsetY  \ttrimLeft  \ttrimTop  \ttrimW  \ttrimH  \torojinalWH\t\t _count=" + ((spArr.length * 8)) + ';\n\n';
        _r += "//SQoffsetX  \tSQoffsetY  \ttrimLeft/u  \ttrimTop/v  \ttrimLeft+trimW/u\ttrimTop+trimH/v\t/orojinalWH/all\t_count=" + ((spArr.length * 7)) + ';\n\n';

        for (var u =0; u<spArr.length; u++){

          var _a = spArr[u];
          // console.log((calcScale * _a.offsetX / masterBaseSize) );

          // _r += (calcScale * _a.offsetX / masterBaseSize).toFixed(7) + ',\t';
          // _r += (calcScale * _a.offsetY / masterBaseSize).toFixed(7) + ',\t';
          // _r += (calcScale * _a.trimLeft / masterBaseSize).toFixed(7) + ',\t';
          // _r += (calcScale * _a.trimTop / masterBaseSize).toFixed(7) + ',\t';
          // _r += (calcScale * _a.trimW / masterBaseSize).toFixed(7) + ',\t';
          // _r += (calcScale * _a.trimH / masterBaseSize).toFixed(7) + ',\t';
          // // _r += (calcScale * _a.originalW / masterBaseSize).toFixed(7) + ',\t';
          // _r += (calcScale * _a.originalH / masterBaseSize).toFixed(7) + ',// no.'+ (u) + '\t' + _a.name +'　'+_a.originalW+'/'+masterBaseSize+' \n';
          //

          var unitScale = _a.originalH / masterBaseSize;

          // ((_a.offsetX - _a.trimLeft) / masterBaseSize).toFixed(7)
          _r += (calcScale * (_a.offsetX - _a.trimLeft) / masterBaseSize).toFixed(7) + ',\t';
          _r += (calcScale * (_a.offsetY - _a.trimTop) / masterBaseSize).toFixed(7) + ',\t';
          _r += (1 * (_a.trimLeft-5) / _a.originalW).toFixed(7) + ',\t';
          _r += (1 * (_a.trimTop-5) / _a.originalH).toFixed(7) + ',\t';
          _r += (1 * (_a.trimLeft + _a.trimW +5) / _a.originalW).toFixed(7) + ',\t';
          _r += (1 * (_a.trimTop + _a.trimH+5) / _a.originalH).toFixed(7) + ',\t';
          // _r += (calcScale * _a.originalW / masterBaseSize).toFixed(7) + ',\t';
          _r += (calcScale * _a.originalH / masterBaseSize).toFixed(7) + ',// no.'+ (u) + '\t' + _a.name +'　'+_a.originalW+'/'+masterBaseSize+' \n';

        }

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
