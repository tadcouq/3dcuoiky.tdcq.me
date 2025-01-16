// AUTHOR: TRỊNH GIA HƯNG - 20239646
/* Mục tiêu: Nếu ai đã từng xem MV “Không thể cùng nhau suốt kiếp” của nữ ca sĩ Hòa Minzy chắc hắn sẽ ấn tượng bởi một kiến trúc cổ đầy tính nghệ thuật, 
đó chính là cung An Định Huế. Ngay sau khi phát hành, cung An Định Huế đã nhanh chóng chiếm sóng và trở thành điểm check in nổi tiếng tại Huế 
mặc dù trước kia không phải ai du lịch Huế cũng biết địa điểm này nếu không có hướng dẫn viên bản địa chỉ dẫn.*/
// Địa điểm: Cung An Định, bờ sông An Cựu, Phan Đình Phùng, nay thuộc phường Đệ Bát, TP Huế. 
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

const light = new THREE.AmbientLight( 0x404040, -0.01 ); // soft white light
scene.add( light );
const directionalLight = new THREE.DirectionalLight( 0xff0000, 100000 );
directionalLight.position.set(12.388, 3.760, -18);
directionalLight.castShadow = true;
scene.add( directionalLight );

// Skybox background
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

const loader = new GLTFLoader();
loader.load(
	// resource URL
	'./3D/04_andinh_palace.glb',
	// called when the resource is loaded
	function ( gltf ) {
    const model = gltf.scene;
		scene.add( model );
    model.rotation.x = -0.04;
	},
	// called while loading is progressing
	function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);

function animate() {
    requestAnimationFrame(animate);

    render();
  };
  function render() {
    renderer.render(scene, camera || camera);
  };

animate();