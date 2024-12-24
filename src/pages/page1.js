// AUTHOR: NGUYỄN QUỐC ĐẠT - 20231570
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const page1scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: false
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
document.body.appendChild(renderer.domElement);

const defcamera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);
defcamera.position.set(5, 5, 5);
defcamera.lookAt(0, 2, 0);

const controls = new OrbitControls(defcamera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 2, 0);
controls.update();

const ambientLight = new THREE.AmbientLight(0xffffff, 20);
page1scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.position.set(3.52, 10.51, 10);
directionalLight.castShadow = true;
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 40;
page1scene.add(directionalLight);

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 500),
    new THREE.ShadowMaterial({ 
        color: 0x808080, 
        opacity: 0.5 
    })
);
ground.rotation.x = Math.PI / 2;
ground.receiveShadow = true;
ground.position.y = -0.2;
page1scene.add(ground);

// Map
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( 'examples/js/libs/draco/' );
loader.setDRACOLoader(dracoLoader);

loader.load(
    './3D/01_hanoi_circuit.glb',

    function ( gltf ) {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        model.scale.set(1, 1, 1);
        page1scene.add(model);
    },

    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% maps loaded' );
    },

    function ( error ) {
        console.error( 'maps: An error happened, better check the fukin code again' );
    },
);

// xe
loader.load(
    './3D/01_rb19.glb',

    function ( gltf ) {
        const model = gltf.scene;

        const animation = gltf.animations;
        if (animation && animation.length) {
            mixer = new THREE.AnimationMixer(model);
            animation.forEach((clip) => {
                mixer.clipAction(clip).play();
            });
        }

        gltf.cameras.forEach((cam, index) => {
            cameras[`rb19_${index+1}`] = cam;
        });

    page1scene.add(model);
    },

    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% rb19 loaded' );
    },

    function ( error ) {
        console.error( 'rb19: An error happened, better check the fukin code again' );
    }
);

// Tổng hợp camera
const cameras = {
    default: defcamera,
    // còn cam của model sẽ tự add chèn vào dưới đây dưới dạng `"tên gì đó"_(index+1)`
};

let currentCamera = defcamera;

// Ngày và hoàng hôn
function toggelDayNight() {
    isDay = !isDay;
    if (isDay) {
        scene.background = daybg;
    }
    else {
        scene.background = duskbg;
    }
};

const daybg = new THREE.CubeTextureLoader()
    .setPath('./Tex/day_skybox')
    .load([
        'px.png',
        'nx.png',
        'py.png',
        'ny.png',
        'pz.png',
        'nz.png'
    ]);

const duskbg = new THREE.CubeTextureLoader()
    .setPath('./Tex/dusk_skybox')
    .load([
        'px.png',
        'nx.png',
        'py.png',
        'ny.png',
        'pz.png',
        'nz.png'
    ]);

let isDay = true;
let dayduskButton = document.getElementById('day-dusk');