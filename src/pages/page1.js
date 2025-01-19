// AUTHOR: NGUYỄN QUỐC ĐẠT - 20231570
// Phiên bản ban đầu và credit các asset đã sử dụng có thể xem qua: https://github.com/tadcouq/AC2020
/* Mục tiêu: Hiển thị mô hình 3D của chiếc xe đua RB19 tại đường đua Hà Nội, đồng thời qua đây cũng là trang giới thiệu về đường đua, xe đua 
và câu chuyện về việc tổ chức giải đua không thành do tham nhũng, quan liêu và không đúng thời điểm tại Việt Nam*/
// Địa điểm: Hanoi Circuit, Cột Đồng Hồ Mỹ Đình, Nam Từ Liêm, Hà Nội
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export function init(container) {
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
    container.appendChild(renderer.domElement);

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    page1scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(12.388, 5.760, -15);
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
            model.receiveShadow = true;
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

    // Maybay
    const maybay = new GLTFLoader();
    const maybayDracoLoader = new DRACOLoader();
    maybayDracoLoader.setDecoderPath( '/draco/' );
    maybay.setDRACOLoader( maybayDracoLoader );

    let mixer2;
    maybay.load(
        './3D/01_may_bay.glb',

        function ( gltf ) {
            const model = gltf.scene;

            const animation = gltf.animations;
            if (animation && animation.length) {
                mixer2 = new THREE.AnimationMixer(model);
                animation.forEach((clip) => {
                    mixer2.clipAction(clip).play();
                });
            }

            page1scene.add(model);
        },

        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% maybay loaded' );
        },

        function ( error ) {
            console.error( 'maybay: An error happened, better check the fukin code again' );    
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

    // Ball
    const sphere = new THREE.SphereGeometry( 1, 32, 32 );
    const texture = new THREE.TextureLoader().load( './Tex/soccer.jpg' );
    const material = new THREE.MeshPhongMaterial( { map: texture } );
    const ball = new THREE.Mesh( sphere, material );
    ball.position.set(0, 0.012, 0);
    ball.scale.set(0.01, 0.01, 0.01);
    ball.castShadow = true;
    page1scene.add( ball );

    // Audio
    const listener = new THREE.AudioListener();
    currentCamera.add( listener );

    const sound = new THREE.Audio( listener );
    const sound2 = new THREE.Audio( listener );

    const audioLoader = new THREE.AudioLoader();

    audioLoader.load( './Audio/01_V6HybridEngines.mp3', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( true );
        sound.setVolume( 0.2 );
        sound.play();
    });

    const audioLoader2 = new THREE.AudioLoader();
    audioLoader2.load( './Audio/wind.mp3', function( buffer ) {
        sound2.setBuffer( buffer );
        sound2.setLoop( true );
        sound2.setVolume( 1 );
        sound2.play();
    });

    // Animation
    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        if (mixer) {
            mixer.update(delta);
        }
        if (mixer2) {
            mixer2.update(delta);
        }
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
};