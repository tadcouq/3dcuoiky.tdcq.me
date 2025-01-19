// AUTHOR: TRỊNH GIA HƯNG - 20239646
/* Mục tiêu: Nếu ai đã từng xem MV “Không thể cùng nhau suốt kiếp” của nữ ca sĩ Hòa Minzy chắc hắn sẽ ấn tượng bởi một kiến trúc cổ đầy tính nghệ thuật, 
đó chính là cung An Định Huế. Ngay sau khi phát hành, cung An Định Huế đã nhanh chóng chiếm sóng và trở thành điểm check in nổi tiếng tại Huế 
mặc dù trước kia không phải ai du lịch Huế cũng biết địa điểm này nếu không có hướng dẫn viên bản địa chỉ dẫn.*/
// Địa điểm: Cung An Định, bờ sông An Cựu, Phan Đình Phùng, nay thuộc phường Đệ Bát, TP Huế. 
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
export function init(container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    const controls = new OrbitControls( camera, renderer.domElement );
    camera.position.set( -10, 5, -10 );
    controls.update();

    const light = new THREE.AmbientLight( 0x404040, 20 ); // soft white light
    scene.add( light );
    const directionalLight = new THREE.DirectionalLight( 0x404040, 100 );
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

    const listener = new THREE.AudioListener();
    camera.add( listener );

    const sound = new THREE.Audio( listener );
    const sound2 = new THREE.Audio( listener );

    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( './Audio/wind.mp3', function( buffer ) {
    sound.setBuffer( buffer );
    sound.setLoop( true );
    sound.setVolume( 0.3 );
    sound.play();
    });

    audioLoader.load( './Audio/04_cungdinhhue.mp3', function( buffer ) {
        sound2.setBuffer( buffer );
        sound2.setLoop( true );
        sound2.setVolume( 0.2 );
        sound2.play();
    });

    const sphere = new THREE.SphereGeometry( 1, 32, 32 );
    const texture = new THREE.TextureLoader().load( './Tex/football.jpg' );
    const material = new THREE.MeshPhongMaterial( { map: texture } );
    const ball = new THREE.Mesh( sphere, material );
    ball.position.set(2.626, 0.38, 3.084);
    ball.scale.set(0.05, 0.05, 0.05);
    ball.castShadow = true;
    scene.add( ball );

    const cs = new GLTFLoader();
    let mixer;
    cs.load(
        './3D/03_canh_sat.glb',
        function ( gltf ) {
            const model = gltf.scene;
            model.position.set(3.626, 0.31, 3.084);
            model.scale.set(0.15, 0.15, 0.15);

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
}
