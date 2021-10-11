let scene, camera, renderer;
let speed = 0.05;
let camAngle = 0.0;

let cube, sphere, torus, cone, cylinder;
let pointLight, hemiLight, dirLight, spotLight, ambLight;
const lights = [];

const light = document.querySelector('#light');

let createCube = function() {
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let material = new THREE.MeshStandardMaterial({color: 0x00a1cb});
    let mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    return mesh;
}

function createTorus() {
    const geometry = new THREE.TorusGeometry(1, 0.5, 16, 16);
    const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    return mesh;
}

function createCylinder() {
    const geometry = new THREE.CylinderGeometry(1, 1, 4, 32);
    const material = new THREE.MeshLambertMaterial({color: 0x00ff00});
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    return mesh;
}

function createWireframeSphere() {
    const geometry = new THREE.SphereGeometry(1, 10, 10);
    const wireframe = new THREE.WireframeGeometry(geometry);

    const line = new THREE.LineSegments(wireframe);
    line.material.depthTest = false;
    line.material.opacity = 0.25;
    line.material.transparent = false;

    scene.add(line);

    return line;
}

function createPointLight() {
    const lgt = new THREE.PointLight(0xffffff, 5, 100);
    scene.add(lgt);

    return lgt;
}

function createAmbientLight() {
    const lgt = new THREE.AmbientLight(0x808080);
    scene.add(lgt);

    return lgt;
}

function createDirectionalLight() {
    const lgt = new THREE.DirectionalLight(0xffffff, 0.5);
    scene.add(lgt);

    return lgt;
}

function createHemisphereLight() {
    const lgt = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    scene.add(lgt);

    return lgt;
}

function createSpotlight() {
    const lgt = new THREE.SpotLight(0xffffff);
    lgt.position.set(100, 1000, 100);

    lgt.castShadow = true;

    lgt.shadow.mapSize.width = 1024;
    lgt.shadow.mapSize.height = 1024;

    lgt.shadow.camera.near = 500;
    lgt.shadow.camera.far = 4000;
    lgt.shadow.camera.fov = 30;

    scene.add(lgt);

    return lgt;
}

function init() {
    // Create scene

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xababab);

    // Create camera

    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 15;

    // Add objects

    cube = createCube();
    cube.position.x = -4;

    sphere = createWireframeSphere();
    sphere.position.z = 2;
    sphere.position.y = 1;

    torus = createTorus();
    torus.position.x = 4;

    cylinder = createCylinder();
    cylinder.position.y = -2;
    cylinder.position.z = -10;

    // Add lights

    pointLight = createPointLight();
    dirLight = createDirectionalLight();
    hemiLight = createHemisphereLight();
    spotLight = createSpotlight();
    ambLight = createAmbientLight();

    lights.push(pointLight, dirLight, hemiLight, spotLight, ambLight);
    lights.forEach((lgt) => {
        lgt.visible = false;
    })

    lights[0].visible = true;

    // Create renderer

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    // Changing lights

    light.addEventListener("change", () => {
        lights.forEach((lgt) => {
            lgt.visible = false;
        });

        lights[light.selectedIndex].visible = true;
    });
}

function mainLoop() {
    renderer.render(scene, camera);

    // Animate cube

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Animate sphere

    sphere.rotation.x += 0.025;
    sphere.rotation.z += 0.025;

    // Animate torus

    torus.rotation.x += 0.1;
    torus.rotation.y -= 0.01;

    // Animate cylinder

    cylinder.position.x += speed;
    cylinder.rotation.z += 0.1;
    cylinder.rotation.y += 0.01;

    if (cylinder.position.x >= 4.0 || cylinder.position.x <= -4.0)
        speed *= -1;

    requestAnimationFrame(mainLoop);
}

init();
mainLoop();