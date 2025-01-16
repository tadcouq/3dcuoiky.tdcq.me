// AUTHOR: NGUYỄN QUỐC ĐẠT - 20231570
// Phiên bản ban đầu và credit các asset đã sử dụng có thể xem qua: https://github.com/tadcouq/AC2020
/* Mục tiêu: Hiển thị mô hình 3D của chiếc xe đua RB19 tại đường đua Hà Nội, đồng thời qua đây cũng là trang giới thiệu về đường đua, xe đua 
và câu chuyện về việc tổ chức giải đua không thành do tham nhũng, quan liêu và không đúng thời điểm tại Việt Nam*/
// Địa điểm: Hanoi Circuit, Cột Đồng Hồ Mỹ Đình, Nam Từ Liêm, Hà Nội
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// Set up scene
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

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);
camera.position.set(5, 5, 5);
camera.lookAt(0, 2, 0);
let currentCamera = camera;

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 2, 0);
controls.update();

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0);
page1scene.add(ambientLight);

const daylight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
page1scene.add(daylight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(3.52, 10.51, 10);
directionalLight.castShadow = true;
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 40;
page1scene.add(directionalLight);


// Skybox background
const daybg = new THREE.CubeTextureLoader()
    .setPath('./Tex/day_skybox/')
    .load(
        [
            'px.png',
            'nx.png',
            'py.png',
            'ny.png',
            'pz.png',
            'nz.png'
        ],
        // onLoad callback
        () => {
            console.log('Skybox images loaded successfully');
        },
        // onProgress callback
        undefined,
        // onError callback
        (error) => {
            console.error('Error loading skybox images:', error);
        }
    );

page1scene.background = daybg;

// Ground
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 500),
    new THREE.MeshStandardMaterial({ color: 0x808080 })
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

// Car
const cameras = {};
const rb19 = new GLTFLoader();
const rb19DracoLoader = new DRACOLoader();
rb19DracoLoader.setDecoderPath( '/draco/' );
rb19.setDRACOLoader( rb19DracoLoader );

let mixer;
rb19.load(
    './3D/testplaygound.glb',

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

        createCameraDropdown();
        page1scene.add(model);
    },

    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% rb19 loaded' );
    },

    function ( error ) {
        console.error( 'rb19: An error happened, better check the fukin code again' );
    }
);

function createCameraDropdown() {
    const cameraDropdown = document.createElement('select');
    cameraDropdown.style.position = 'absolute';
    cameraDropdown.style.bottom = '50px';
    cameraDropdown.style.left = '10px';
    cameraDropdown.style.zIndex = '1000';
    cameraDropdown.style.padding = '2px';
    cameraDropdown.style.backgroundColor = 'white';
    cameraDropdown.style.border = '1px solid #ccc';

    // Add default camera option
    const defaultOption = document.createElement('option');
    defaultOption.value = 'default';
    defaultOption.text = 'Default Camera';
    cameraDropdown.appendChild(defaultOption);

    // Add model cameras
    Object.keys(cameras).forEach(camKey => {
        const option = document.createElement('option');
        option.value = camKey;
        option.text = camKey;
        cameraDropdown.appendChild(option);
    });

    // Add event listener
    cameraDropdown.addEventListener('change', (e) => {
        currentCamera = e.target.value === 'default' ? camera : cameras[e.target.value];
    });

    document.body.appendChild(cameraDropdown);
};

// Audio

function animate() {
    requestAnimationFrame(animate);
    if (mixer) {
      mixer.update(clock.getDelta())
    };
    render();
  };
  
const clock = new THREE.Clock();
function render() {
    renderer.render(page1scene, currentCamera || camera);
  };

animate();
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
