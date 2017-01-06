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
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
    return false
}

function handleDragEnter(evt) {
    evt.stopPropagation();
    evt.preventDefault();


    dropZone.className ="over";
}
function handleDragOver(evt) {
    // evt.stopPropagation();
    evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}
function handleDragOut(evt){
  evt.stopPropagation();
  evt.preventDefault();
  dropZone.className ="";
}


// Setup the dnd listeners.

// dropZone.addEventListener('dragenter', handleDragEnter, false);
dropZone.addEventListener('drageover', handleDragOver, false);
// dropZone.addEventListener('dragleave', handleDragOut, false);
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
