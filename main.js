var emilio_face_url = "./emilio_face.png";

var scene = new THREE.Scene();
var aspect = window.innerHeight / window.innerWidth
var width = 16;
var height = 9;
var player_size = 1.5;
var max_teacher_speed = 0.1;

var teacher_size = 2;
var mov_speed = 0.2;
var pressed_keys = [];

var randon_x = Math.random() * (0, max_teacher_speed);
var randon_y = max_teacher_speed - randon_x;

var dicrection = new THREE.Vector3(randon_x, randon_y, 0);

var camera = new THREE.OrthographicCamera(-width, width, height, -height, 1, 1000 );
camera.position.z = 5;

var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xE5E5E5)
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.PointLight(0xFFFFFF, 1, 1000);
light.position.set(0, 0, 0);
scene.add(light);

var geometry = new THREE.CircleGeometry(teacher_size, 32);
var texture = new THREE.TextureLoader().load(emilio_face_url);
var material = new THREE.MeshBasicMaterial();
material.map = texture;
var teacher = new THREE.Mesh(geometry, material);
scene.add(teacher);

var geometry = new THREE.CircleGeometry(player_size, 32);
var texture = new THREE.TextureLoader().load(emilio_face_url);
var material = new THREE.MeshBasicMaterial();
material.map = texture;
var player = new THREE.Mesh(geometry, material);
scene.add(player);

const render = () => {
  requestAnimationFrame(render);
  teacherMovement();

  renderer.render(scene, camera);
}

const teacherMovement = () => {
  if ((teacher.position.y + teacher_size) >= height || (teacher.position.y - teacher_size) < -height) {
    dicrection.y *= -1;
  }

  if ((teacher.position.x + teacher_size) >= width || (teacher.position.x - teacher_size) < -width) {
    dicrection.x *= -1;
  }

  teacher.position.x += dicrection.x;
  teacher.position.y += dicrection.y;
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

  if (moveFunction) moveFunction();
}

document.addEventListener("keydown", (event) => playerMovement(event.key));

render();