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


    reader.onload = function(ev){
      var arr = reader.result.split(/\r\n|\r|\n/);//行ごと
      for (var i =0; i < arr.length; i++){
        var tempArr = arr[i].split(' ');
        var _st = tempArr[0];
        if(_st =='v'){
          var _ov = {'x':tempArr[1], 'y':tempArr[2], 'z':tempArr[3] };
          vertex.push(_ov);
        } else if(_st == 'vt'){
          var _ouv = {'u':tempArr[1], 'v':tempArr[2]};
          texcoord.push(_ouv);
        }else if(_st == 'f'){
          var _tp = [];
          for(t =1; t < 4; t++){
            var _pointArr = tempArr[t].split('/');
            _tp.push(_pointArr);// ３つづつ
          }

          index.push(_tp);//トライアングル数
        }

      }

      console.log(vertex.length + " = " + texcoord.length);
      console.log(index.length +" トライアングル");
      var _r = "";
      for (var u =0; u<vertex.length; u++){
        _r += parseFloat(vertex[u].x) + ',\t';
        _r += parseFloat(vertex[u].y) + ',\t';
        _r += parseFloat(vertex[u].z) + ',\t\t';

        _r += (Math.round (parseFloat(texcoord[u].u)* 10000) / 10000) + ',\t';
        _r += (Math.round (parseFloat(texcoord[u].v)* 10000) / 10000)+ ',//\t\t('+u+')\n';
      }

      //テキストエリアに表示する
      document.output.txt1.value = _r;


      var _ir ='';

      for (var j =0; j<index.length; j++){
        console.log(index[j]);
        for(var i=0; i< index[j].length; i++){
          _ir += parseInt(index[j][i][0]) + ',\t';
          _ir += parseInt(index[j][i][1]) + ',\t';
          if(i+1 < index[j].length){
            _ir += parseInt(index[j][i][2]) + ',\t\t\t';
          }else{
            _ir += parseInt(index[j][i][2]) + ',';
          }

        }
        _ir += '//\t\t\t\t ('+(j+1)+' pol)\n';
      }
      //テキストエリアに表示する
      document.output.txt2.value = _ir;

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













var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth * 0.92, window.innerHeight * 0.7);
// document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({
    color: 0x00ff00
});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 5;





var render = function() {
    requestAnimationFrame(render);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.1;
    renderer.render(scene, camera);
};

// instantiate a loader
// var loader = new THREE.OBJLoader();
//
// // load a resource
// loader.load(
//     // resource URL
//     '/tools/sphere.obj',
//     // Function when resource is loaded
//
//     function(object) {
//       loader.setMaterials( material );
//         object.scale.set( 0.6, 0.3, 0.6 );
//         object
//         scene.add(object);
//         console.log(object.children[0].geometry.attributes);
//         console.log(object.children[0].geometry.attributes.position.array);
//     }
// );



// render();
