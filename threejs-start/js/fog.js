import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
const main = () => {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5);
  camera.position.set(0, 0, 2);

  const renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  scene.fog = new THREE.Fog('lightblue', 1, 2);
  scene.background = new THREE.Color('lightblue');

  const light = new THREE.DirectionalLight('white', 1);
  light.position.set(-1, 2, 4)
  scene.add(light);

  const geometry = new THREE.BoxGeometry(1, 1, 1);

  function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({
      color
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, 0, 0);
    scene.add(cube);
    return cube;
  }

  const cubes = [
    makeInstance(geometry, 0x44aa88, 0),
    makeInstance(geometry, 0x8844aa, -2),
    makeInstance(geometry, 0xaa8844, 2),
  ];

  function render(time) {
    time *= 0.001;
    cubes.forEach((cube, index) => {
      const speed = 1 + index * 0.1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

}
main()