// AUTHOR: NGUYỄN NGỌC HẢI - 20231588
/*Mục tiêu: Bảo tàng Hùng Vương được ví như một “cuốn sử bằng hiện vật” khi lưu giữ và trưng bày hàng nghìn hiện vật gốc quý hiếm, 
tái hiện rõ nét lịch sử hình thành, phát triển của tỉnh Phú Thọ từ thời Hùng Vương dựng nước cho đến ngày nay.*/
// ĐỊA ĐIỂM: Bảo tàng Hùng Vương, Phú Thọ
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( -10, 5, -10 );
controls.update();

const light = new THREE.AmbientLight( 0x404040, 1 );
scene.add( light );
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.set(12.388, 3.760, -18);
directionalLight.castShadow = true;
scene.add( directionalLight );

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

const map = new GLTFLoader();
map.load(
    './3D/03_map.glb',
    function ( gltf ) {
    const model = gltf.scene;
    model.position.set(0, 0, 0);
    model.scale.set(2, 2, 2);
    model.receiveShadow = true;
    scene.add( model );
    },
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    function ( error ) {
        console.log( 'An error happened' );
    }
);

const flag = new GLTFLoader();
flag.load(
    './3D/03_vn_flag.glb',
    function ( gltf ) {
    const model = gltf.scene;
    model.position.set(0.43, 2, 2.592);
    model.scale.set(0.03, 0.03, 0.03);
    model.castShadow = true;
    scene.add( model );
    },
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    function ( error ) {
        console.log( 'An error happened' );
    }
);

const cs = new GLTFLoader();
let mixer;
cs.load(
    './3D/03_canh_sat.glb',
    function ( gltf ) {
        const model = gltf.scene;
        model.position.set(-0.22, 0.75, 0.6);
        model.scale.set(0.1, 0.1, 0.1);
        model.rotation.y = Math.PI;

        const animation = gltf.animations;
            if (animation && animation.length) {
                mixer = new THREE.AnimationMixer(model);
                animation.forEach((clip) => {
                    mixer.clipAction(clip).play();
                });
            }
        scene.add(model);
    },
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    function ( error ) {
        console.log( 'An error happened' );
    }
);

const sphere = new THREE.SphereGeometry( 1, 32, 32 );
const texture = new THREE.TextureLoader().load( './Tex/gray-concrete.jpg' );
const material = new THREE.MeshPhongMaterial( { map: texture } );
const ball = new THREE.Mesh( sphere, material );
ball.position.set(0.588, 0.8, -0.201);
ball.scale.set(0.1, 0.1, 0.1);
ball.castShadow = true;
scene.add( ball );

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshStandardMaterial({ color: 0x008000 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
ground.position.y = 0;
scene.add(ground);

const listener = new THREE.AudioListener();
camera.add( listener );

const sound = new THREE.Audio( listener );
const sound2 = new THREE.Audio( listener );

const audioLoader = new THREE.AudioLoader();
audioLoader.load( './Audio/wind.mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 2 );
	sound.play();
});

audioLoader.load( './Audio/03_Footsteps.mp3', function( buffer ) {
    sound2.setBuffer( buffer );
    sound2.setLoop( true );
    sound2.setVolume( 0.2 );
    sound2.play();
});

function animate() {
    requestAnimationFrame(animate);
    if (mixer) {
      mixer.update(clock.getDelta())
    };
    render();
  };
  
const clock = new THREE.Clock();
function render() {
    renderer.render(scene, camera);
  };

animate();
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});