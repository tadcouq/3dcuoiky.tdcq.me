//AUTHOR: TRẦN ĐÌNH TÙNG - 20231646
/*
Câu chuyện: Tòa nhà Trung tâm THVN chính thức đi vào hoạt động nhân kỷ niệm 47 năm ngày phát sóng chương trình truyền hình đầu tiên.
Sự kiện này đánh dấu một mốc quan trọng trong sự phát triển của Đài Truyền hình Việt Nam (VTV), với cơ sở hạ tầng hiện đại,
phục vụ cho công tác sản xuất, phát sóng các chương trình truyền hình. Tòa nhà được thiết kế với các trang thiết bị tiên tiến,
đáp ứng nhu cầu phát triển công nghệ và truyền thông trong kỷ nguyên số.
*/
//setup environment
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { Clock } from 'three';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 20, 5, 200 );
controls.update();

// Lights

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(311.462, 233.138, -169.842);
directionalLight.castShadow = true;
directionalLight.shadow.camera.top = 500;
directionalLight.shadow.camera.bottom = -500;
directionalLight.shadow.camera.left = -500;
directionalLight.shadow.camera.right = 500;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 2000;
scene.add(directionalLight);

const hemilight = new THREE.HemisphereLight();
hemilight.groundColor.setHSL(27,240,120);
hemilight.color.setHSL(133,240,120);
hemilight.intensity = 0.5;
hemilight.position.set(3.52, 10.51, 10)
scene.add(hemilight);


//Plane
const planeGeometry = new THREE.PlaneGeometry(1000,1000,1000,1000);
const shadowplaneMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
const shadowplane = new THREE.Mesh(planeGeometry, shadowplaneMaterial);
shadowplane.position.set(200, -0.1, 10)
shadowplane.castShadow = true;
shadowplane.receiveShadow = true;
shadowplane.rotation.x = -Math.PI / 2;
scene.add(shadowplane);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xfdfdfd });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(200, -0.15, 10)
plane.rotation.x = -Math.PI / 2;
scene.add(plane);
//Skybox
const bg = new THREE.CubeTextureLoader()
    .setPath('./Tex/day_skybox/')
    .load(
        [
            'px.png',
            'nx.png',
            'py.png',
            'ny.png',
            'pz.png',
            'nz.png'
        ]
    );
scene.background = bg;

//maybay
let mixer
const maybay = new GLTFLoader();
maybay.load('./3D/Page2/model/maybay.glb', function(gltf){
    const model = gltf.scene;
    gltf.scene.scale.set(50,50,50);
    gltf.scene.position.set(200, 80, 0);
    const animation = gltf.animations;
    mixer = new THREE.AnimationMixer(model);
    animation.forEach(clip => {
        mixer.clipAction(clip).play();
    });
    model.traverse(function(node){
        if(node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });
    scene.add(gltf.scene);
})

//loader
let loader = new GLTFLoader();

// Optional: Provide a DRACOLoader instance to decode compressed mesh data
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( './3D/Page2/model/' );
loader.setDRACOLoader( dracoLoader );

// tháp vtv
loader.load(
	// resource URL
	'./3D/Page2/model/2011690.gltf',
	// called when the resource is loaded
	function ( gltf ) {
        let model = gltf.scene;
        model.position.set(200, 0, 0);
        model.castShadow = true;
        model.receiveShadow = true;
        model.traverse(function(node){
            if(node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        })
        scene.add( model );
        

	}
);

//Ô tô
const xe = new GLTFLoader();
xe.load('./3D/Page2/model/xe.glb', function(gltf){
    const model = gltf.scene;
    model.scale.set(200,200,200);
    model.position.set(330, 1, 15);
    model.rotation.y = Math.PI / 2;
    model.traverse(function(node){
        if(node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });
    scene.add(model);
})
//Add sound
const listener = new THREE.AudioListener();
camera.add( listener );
const sound = new THREE.Audio( listener );
const airplane = new THREE.AudioLoader();
airplane.load( './Audio/02_airplane_sound.mp3', function( buffer ) {
    sound.setBuffer( buffer );
    sound.setLoop( true );
    sound.setVolume( 0.1 );
    sound.play();
});
const sound2 = new THREE.Audio( listener );
const wind = new THREE.AudioLoader();
wind.load('./Audio/wind.mp3', function(buffer){
    sound2.setBuffer( buffer );
    sound2.setLoop( true );
    sound2.setVolume( 0.5 );
    sound2.play();
})
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if(mixer) mixer.update(delta);
    controls.update();
    renderer.render(scene, camera);
  };

animate();