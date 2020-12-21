

var stats = initStats();

var scene = new THREE.Scene();

var mutualCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
var dollyCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
var followingCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);

var step = 0;
var rot = 0;


followingCamera.position.x = 0;
followingCamera.position.y = 0;
followingCamera.position.z = 500;
followingCamera.lookAt(new THREE.Vector3(0, 0, 0));

mutualCamera.rotation.set(Math.PI/2 , 0, 0);
var webGLRenderer = new THREE.WebGLRenderer();
webGLRenderer.setSize(window.innerWidth, window.innerHeight);
webGLRenderer.shadowMapEnabled = true;

mutualCamera.position.x = -500;
mutualCamera.position.y = 0;
mutualCamera.position.z = 0;
mutualCamera.rotation.set(-Math.PI/2, -Math.PI/2, Math.PI); 


dollyCamera.position.x = -500;
dollyCamera.position.y = 40;
dollyCamera.position.z = 100;
dollyCamera.lookAt(new THREE.Vector3(0, 0, 0));
dollyCamera.rotation.set(-Math.PI/2, -Math.PI/2, Math.PI); 
		
        
var positions  =  new THREE.Vector3(0, 0, 0);

var controls = new function () {


    this.segmentai = 15;
    this.laukas1 = 45;
    this.laukas2 = 45;
    this.camera = 1;

    this.redraw = function () {
    
        scene.remove(king);

        generateKing(controls.segments, positions.x, positions.y, positions.y);
        
        var v = mutualCamera.position;
        var e = mutualCamera.rotation;
        scene.remove(mutualCamera);
        

        createMutualCamera(controls.laukas1, v, e, positions);
        createCasualCamera(controls.laukas2);
    };
}

		

$("#WebGL-output").append(webGLRenderer.domElement);  
camControl = new THREE.TrackballControls( dollyCamera, webGLRenderer.domElement );    


const dollyC = 150 ;
function createMutualCamera(fov, v, e, objectLocation){
    
    mutualCamera.fov = fov;
    
    mutualCamera.updateProjectionMatrix ();
    
    var length = Math.sqrt(v.x *  v.x + v.y * v.y + v.z *v.z);
    var distance = Math.abs(dollyC/ (2*Math.tan(fov/360 * Math.PI)));
    
    
    mutualCamera.position.x = v.x/length  *  distance;
}

function createCasualCamera(fov){
    dollyCamera.fov = fov;
    dollyCamera.updateProjectionMatrix ();
    dollyCamera.rotation.set(-Math.PI/2, -Math.PI/2, Math.PI); 
}

var step = 0;
var king;


generateKing(12, 0, 0, 0);
generateKing(12, 0, 500, 0);
    
addFloor();

function addFloor() {
    var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 20, 20);

    const loader = new THREE.TextureLoader();
    loader.crossOrigin = '*';
    loader.load(
        'https://i.imgur.com/KOgaj60.png',
        (texture) => {
            const textureMaterial = new THREE.MeshBasicMaterial({ map: texture});
            texture.minFilter = THREE.NearestFilter;
            const floorMesh = THREE.SceneUtils.createMultiMaterialObject(floorGeometry, [textureMaterial]);
            floorMesh.position.z = -80;
            scene.add(floorMesh);
        }
    );
}



    

var gui = new dat.GUI();

gui.add(controls, 'laukas1', 1, 90).step(1).onChange(controls.redraw);
gui.add(controls, 'laukas2', 10, 170).step(1).onChange(controls.redraw);
gui.add(controls, 'segmentai', 0, 50).step(1).onChange(controls.redraw);
gui.add(controls, 'camera', 1, 3).step(1).onChange(controls.redraw);

var cam1, cam2, firstCam, secondCamera;
addCam();
render();

		
function generateKing(segments, x, y, z) {
    var pointsX = [
    0, 50, 50, 
    50, 50, 100, 
    100, 75, 50, 
    50, 50, 100,
    110, 120, 140,
    160, 190, 210,
    205, 200, 190,
    180, 170, 160,
    150, 140, 130,
    120, 115, 110,
    105, 100, 100,
    100, 105, 110,
    115, 120, 130,
    140, 150, 160,
    170, 180, 190,
    200, 205, 210,
    240, 250, 250,
    250, 240, 210,
    210, 180, 150,
    180, 200, 210,
    210, 220, 230,
    240, 250, 280,
    300, 300, 0,
    ];

    var points = [];
    var height = 5;
    var count = 72;
    for (var i = 0; i < count; i++) {
        points.push(new THREE.Vector3(pointsX[i]/10, 0, (750-i*20)/10));
    }

    var latheGeometry = new THREE.LatheGeometry(points, Math.ceil(segments), 0, 2 * Math.PI);
    king = createMesh(latheGeometry);
    king.position.set(x, y,z);
    scene.add(king);
}
		
		
		

function createMesh(geom) {

    var meshMaterial = new THREE.MeshNormalMaterial();
    meshMaterial.side = THREE.DoubleSide;
    var wireFrameMat = new THREE.MeshBasicMaterial();
    wireFrameMat.wireframe = true;

    var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);

    return mesh;
}
		
		
var line;
function createLine()
{
	var material = new THREE.LineBasicMaterial({ color: 0x000000 });

	var geometry = new THREE.Geometry();

	var r = mutualCamera.rotation;
	var v = mutualCamera.position;
	var length = Math.sqrt(v.x *  v.x + v.y * v.y + v.z *v.z);
	
	geometry.vertices.push(mutualCamera.position);
	geometry.vertices.push(new THREE.Vector3( -Math.sin(r.y -  controls.fov/360*Math.PI   ) * 0, Math.cos(r.y -  controls.fov/360*Math.PI   ) * length, 100));
	geometry.vertices.push(mutualCamera.position);
	geometry.vertices.push(new THREE.Vector3( -Math.sin( r.y +  controls.fov/360*Math.PI  ) * 0, Math.cos( r.y +  controls.fov/360*Math.PI  ) * length, 100));
	

	geometry.vertices.push(mutualCamera.position);
	geometry.vertices.push(new THREE.Vector3( -Math.sin(r.y -  controls.fov/360*Math.PI   ) * 0, Math.cos(r.y -  controls.fov/360*Math.PI   ) * length, -100));
	geometry.vertices.push(mutualCamera.position);
	geometry.vertices.push(new THREE.Vector3( -Math.sin( r.y +  controls.fov/360*Math.PI  ) * 0, Math.cos( r.y +  controls.fov/360*Math.PI  ) * length, -100));
	
	
	geometry.vertices.push(new THREE.Vector3( -Math.sin(r.y -  controls.fov/360*Math.PI   ) * 0, Math.cos(r.y -  controls.fov/360*Math.PI   ) * length, -100));
	geometry.vertices.push(new THREE.Vector3( -Math.sin(r.y -  controls.fov/360*Math.PI   ) * 0, Math.cos(r.y -  controls.fov/360*Math.PI   ) * length, 100));
	geometry.vertices.push(new THREE.Vector3( -Math.sin( r.y +  controls.fov/360*Math.PI  ) * 0, Math.cos( r.y +  controls.fov/360*Math.PI  ) * length, 100));
		
    geometry.vertices.push(new THREE.Vector3( -Math.sin( r.y +  controls.fov/360*Math.PI  ) * 0, Math.cos( r.y +  controls.fov/360*Math.PI  ) * length, -100));
		
		
	line = new THREE.Line(geometry, material);

	scene.add(line);
	
}



function addCam() {

    const cameraGeometry = new THREE.BoxGeometry( 50, 150, 50 );
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = '';
    loader.load(
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPRVJ2sxRH7o6QVfCF6F9jRdBSgVTO5xNo4Q&usqp=CAU',
        (texture) => {
            const textureMaterial = new THREE.MeshBasicMaterial({ map: texture});

            cam1 = THREE.SceneUtils.createMultiMaterialObject(cameraGeometry, [textureMaterial]);
            cam1.position.x = mutualCamera.position.x;
            cam1.position.y = mutualCamera.position.y;
            cam1.position.z = mutualCamera.position.z;
			cam1.rotation.set(0 ,0, Math.PI/2); 
            scene.add(cam1);
            
            cam2 = THREE.SceneUtils.createMultiMaterialObject(cameraGeometry, [textureMaterial]);
            cam2.position.x = followingCamera.position.x;
            cam2.position.y = followingCamera.position.y;
            cam2.position.z = followingCamera.position.z;	
			cam2.rotation.set(Math.PI/2 + followingCamera.rotation.x, followingCamera.rotation.z, 0); 
            scene.add(cam2);
			
        }
    );
}


function render() {
    stats.update();

    scene.remove(line);
    if ( controls.camera != 2){
        createLine();
    }

    if (cam1){
        cam1.position.x = mutualCamera.position.x;
        cam1.position.y = mutualCamera.position.y;
        cam1.position.z = mutualCamera.position.z;
        cam1.rotation.set(0 ,0, Math.PI/2);
        
        cam2.position.x = followingCamera.position.x;
        cam2.position.y = followingCamera.position.y;
        cam2.position.z = followingCamera.position.z;
        cam2.rotation.set(Math.PI/2 + followingCamera.rotation.x, followingCamera.rotation.z, 0); 
        
    }
		
			
    step += 0.02;
    positions =  new THREE.Vector3( 0,  300 * Math.cos(step), 1.5 + 180 * Math.abs(Math.sin(step)));
    scene.remove(king);
    generateKing(controls.segments, positions.x, positions.y, positions.z);

    requestAnimationFrame(render);
    camControl.update(); 
    
    
    followingCamera.lookAt(positions);
    var crot = followingCamera.rotation;
    if (crot.x < 0 && rot < Math.PI) rot += 0.05;
    else if (rot > 0 && crot.x >0) rot -=0.05;
    
    followingCamera.rotation.set(followingCamera.rotation.x, 0, rot); 
    followingCamera.updateProjectionMatrix ();

    if (controls.camera == 1){
        webGLRenderer.render(scene, dollyCamera);
    }
    else if ( controls.camera == 2){
        webGLRenderer.render(scene, followingCamera);
    }
    else {
        webGLRenderer.render(scene, mutualCamera);
    }
}

function initStats() {

    var stats = new Stats();
    stats.setMode(0);

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    $("#Stats-output").append(stats.domElement);

    return stats;
}
