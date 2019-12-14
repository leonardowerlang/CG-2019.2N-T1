var emilio_face_url = "./emilio_face.png";

var scene = new THREE.Scene();
var aspect = window.innerHeight / window.innerWidth
var width = 16;
var height = 9;
var player_size = 2;
var player_control = true;
var mov_speed = 0.3;
var pressed_keys = [];

var camera = new THREE.OrthographicCamera( - width, width, height, - height, 1, 1000 );
camera.position.z = 5;

var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xE5E5E5)
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

window.addEventListener('resize', () => {
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
})

const light = new THREE.PointLight(0xFFFFFF, 1, 1000);
light.position.set(0, 0, 0);
scene.add(light);

var geometry = new THREE.CircleGeometry(player_size, 32);
var texture = new THREE.TextureLoader().load(emilio_face_url);
var material = new THREE.MeshBasicMaterial();
material.map = texture;
var player = new THREE.Mesh( geometry, material );
scene.add(player);

const render = () => {
  requestAnimationFrame(render);

  renderer.render(scene, camera);
}

const playerMovement = (key) => {
  const movements = {
    ArrowUp() {
      if ((player.position.y + player_size) < height) player.position.y += mov_speed;
    },
    ArrowDown() {
      if ((player.position.y - player_size) >= -height) player.position.y -= mov_speed;
    },
    ArrowLeft() {
      if ((player.position.x - player_size) >= -width) player.position.x -= mov_speed;
    },
    ArrowRight() {
      if ((player.position.x + player_size) < width) player.position.x += mov_speed;
    }
  };

  const moveFunction = movements[key];

  if (moveFunction && player_control) moveFunction();
}

document.addEventListener("keydown", (event) => playerMovement(event.key));

render();