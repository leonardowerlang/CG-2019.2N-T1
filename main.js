var teacher_skins = [
  new THREE.TextureLoader().load('./skins/fernando.png'),
  new THREE.TextureLoader().load('./skins/braulio.png'),
  new THREE.TextureLoader().load('./skins/emilio.png'),
  new THREE.TextureLoader().load('./skins/guilherme.png'),
  new THREE.TextureLoader().load('./skins/marco.png'),
];

var player_skin = './skins/kadu.png';
var reproved_skin = './skins/reproved.png';

var scene = new THREE.Scene();
var width = 16;
var height = 9;

var player_size = 1.5;
var mov_speed = 0.15;

var max_teacher_speed = 0.1;
var teacher_size = 2;
var randon_x = Math.random() * (0, max_teacher_speed);
var randon_y = max_teacher_speed - randon_x;
var dicrection = new THREE.Vector3(randon_x, randon_y, 0);

var shot_delay = 5000;
var shot_timer = null;
var shot_speed = 0.2;

var keys_pressed = [];

var geometry = new THREE.PlaneGeometry(2, 0.5, 32);
var texture = new THREE.TextureLoader().load(reproved_skin);
var material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
var shot = new THREE.Mesh(geometry, material);
shot.position.set(1000, 1000, 0)

scene.add(shot);

var camera = new THREE.OrthographicCamera(-width, width, height, -height, 1, 1000 );
camera.position.z = 5;

var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xE4FFE0);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var light = new THREE.PointLight(0xFFFFFF, 1, 1000);
light.position.set(0, 0, 0);
scene.add(light);

var geometry = new THREE.CircleGeometry(teacher_size, 32);
var material = new THREE.MeshBasicMaterial({ map: teacher_skins[0], transparent: true });
var teacher = new THREE.Mesh(geometry, material);
teacher.position.set(-10, 0, 0);
scene.add(teacher);

var geometry = new THREE.CircleGeometry(player_size, 32);
var texture = new THREE.TextureLoader().load(player_skin);
var material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
var player = new THREE.Mesh(geometry, material);
player.position.set(10, 0, 0);
scene.add(player);

const render = (time) => {
  requestAnimationFrame(render);
  teacherMovement();
  teacherShot(time);
  playerMovement();

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

const changeTeacherSkin = () => {
  teacher.material.map = teacher_skins[Math.floor(Math.random() * (0, 5))];
  teacher.material.needsUpdate = true;
}

const teacherShot = (time) => {
  if (!shot_timer) shot_timer = time;

  if(time - shot_timer >  shot_delay) {
    shot_timer = time;
    shot.position.copy(teacher.position);
    var x =  player.position.x - teacher.position.x;
    var y =  player.position.y - teacher.position.y;
    var vector_shot = new THREE.Vector3(x, y, 0);
    var angle = Math.atan2(vector_shot.y, vector_shot.x)
    shot.rotation.z = angle;
    changeTeacherSkin();
  }
  
  shot.translateX(shot_speed);
  if (shot.position.distanceTo(player.position) < 1.5)  reset();
}

const reset = () => {
  player.position.set(10, 0, 0);
  teacher.position.set(-10, 0, 0);
  shot.position.set(1000, 1000, 0);
  shot_timer = null;
}

const playerMovementByKey = (key) => {
  var movements = {
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

  var moveFunction = movements[key];

  if (moveFunction) moveFunction();
}

const playerMovement = () => {
  keys_pressed.forEach(key => {
    playerMovementByKey(key);
  })
}

const addKey = (key) => {
  let keys = keys_pressed.filter(key_pressed => key_pressed === key);
  if (keys.length > 0) return;

  keys_pressed.push(key);
}

const removeKey = (key) => {
  keys_pressed = keys_pressed.filter(key_pressed => key_pressed !== key);
}

document.addEventListener("keydown", (event) => addKey(event.key));
document.addEventListener("keyup", (event) => removeKey(event.key));

render();