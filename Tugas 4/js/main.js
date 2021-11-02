import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js";
import { GUI } from "https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js";

function main() {
  const canvas = document.getElementById("canvas");

  const renderer = new THREE.WebGLRenderer({ canvas });

  const fov = 75;
  const aspect = 2;
  const near = 0.1;
  const far = 50;
  
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.y = 10;
  camera.position.z = 20;

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(-4, 0, 0);
  controls.update();

  const scene = new THREE.Scene();

  function updateCamera() {
    camera.updateProjectionMatrix();
  }

  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  function makeInstance(geometry, material, x, y, z) {
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;

    return cube;
  }
  const loader = new THREE.TextureLoader();

  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
    format: THREE.RGBFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
  });

  let sphereCamera = new THREE.CubeCamera(1, 500, cubeRenderTarget);
  sphereCamera.position.set(0, -5, 0);
  scene.add(sphereCamera);

  let sphereMaterial = new THREE.MeshBasicMaterial({
    envMap: sphereCamera.renderTarget,
  });

  const spheres = [makeInstance(new THREE.SphereGeometry(5, 400, 400), sphereMaterial, -4, 0, 0)];

  {
    const loader = new THREE.TextureLoader();
    const texture = loader.load("images/panoramaImage.jpg", () => {
      const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
      rt.fromEquirectangularTexture(renderer, texture);
      scene.background = rt.texture;
    });
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);
    sphereCamera.update(renderer, scene);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
