import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';

// fetch data
const request = async (url) => {
  const res = await fetch(url);
  return res.text();
}

// parse data text
const parseData = (text) => {
  const data = [];
  const settings = { data };
  let max, min;
  text.split('\n').forEach(line => {
    const parts = line.trim().split(/\s+/);
    // key value paires
    if (parts.length === 2) {
      settings[parts[0]] = parseFloat(parts[1]);
    } else if (parts.length > 2) {
      // mesh data
      const values = parts.map(v => {
        const value = parseFloat(v);
        if (value === settings.NODATA_value) {
          return undefined;
        }
        max = Math.max(max === undefined ? value : max, value);
        min = Math.min(min === undefined ? value : min, value);
        return value;
      });
      data.push(values);
    }

  });
  return Object.assign(settings, { min, max })
}

// draw data
const draw = (file) => {
  const { data, min, max, ncols, nrows } = file;
  const range = max - min;
  const ctx = document.getElementById('canvas').getContext('2d');
  ctx.canvas.width = ncols;
  ctx.canvas.height = nrows;
  ctx.canvas.style.width = px(ncols * 2);
  ctx.canvas.style.height = px(nrows * 2);
  ctx.fillStyle = '#444';
  ctx.fillRect(0, 0, ncols, nrows);

  data.forEach((row, latNdx) => {
    row.forEach((value, lonNdx) => {
      if (value === undefined) {
        return;
      }
      const amount = (value - min) / range;
      const hue = 1;
      const saturation = 1;
      const lightness = amount;
      ctx.fillStyle = hsl(hue, saturation, lightness);
      ctx.fillRect(lonNdx, latNdx, 1, 1);
    })
  })
}
const px = (v) => `${v | 0}px`;
const hsl = (h, s, l) => `hsl(${h * 360 | 0}, ${s * 100 | 0}%, ${l * 100 | 0}%)`;

// (async () => {
//   const text = await request('resources/gpw_v4_basic_demographic_characteristics_rev10_a000_014mt_2010_cntm_1_deg.asc');
//   const file = parseData(text);
//   draw(file);
// })();

const main = () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10);
  camera.position.z = 2.5;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = true;
  controls.minDistance = 1.2;
  controls.maxDistance = 4;
  controls.update();

  const loader = new THREE.TextureLoader();
  const texture = loader.load('resources/world.jpeg');
  const geometry = new THREE.SphereGeometry(1, 64, 32);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  let renderRequested = false;


  const addBoxes = (file) => {
    const { min, max, data } = file;
    const range = max - min;

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    // 沿着Y轴缩放
    geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 0.5));

    const lonHelper = new THREE.Object3D();
    scene.add(lonHelper);

    const latHelper = new THREE.Object3D();
    lonHelper.add(latHelper);

    const positionHelper = new THREE.Object3D();
    positionHelper.position.z = 1;
    latHelper.add(positionHelper);

    const lonFudege = Math.PI * .5;
    const latFudege = Math.PI * -0.135;
    data.forEach((row, latNdx) => {
      row.forEach((value, lonNdx) => {
        if (value === undefined) {
          return;
        }
        const amount = (value - min) / range;
        const material = new THREE.MeshBasicMaterial();
        const hue = THREE.MathUtils.lerp(0.7, 0.3, amount);
        const saturation = 1;
        const lightness = THREE.MathUtils.lerp(0.4, 1.0, amount);
        material.color.setHSL(hue, saturation, lightness);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        lonHelper.rotation.y = THREE.MathUtils.degToRad(lonNdx + file.xllcorner) + lonFudege;
        latHelper.rotation.x = THREE.MathUtils.degToRad(latNdx + file.yllcorner) + latFudege;

        positionHelper.updateWorldMatrix(true, false);
        mesh.applyMatrix4(positionHelper.matrixWorld);

        mesh.scale.set(0.005, 0.005, THREE.MathUtils.lerp(0.01, 0.5, amount));
      })
    })
  }

  const requestRenderIfNotRequested = () => {
    if (!renderRequested) {
      renderRequested = true;
      requestAnimationFrame(render);
    }
  }
  const render = () => {
    renderRequested = undefined;
    controls.update();
    renderer.render(scene, camera);
  }
  render();
  request('resources/gpw_v4_basic_demographic_characteristics_rev10_a000_014mt_2010_cntm_1_deg.asc')
    .then(parseData)
    .then(addBoxes)
    .then(render)

  controls.addEventListener('change', requestRenderIfNotRequested);
  window.addEventListener('resize', requestRenderIfNotRequested);
}

main()
