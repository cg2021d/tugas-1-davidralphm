let scene, camera, renderer, controls, rayCast;

// Warna - warna untuk object

const colors = [
    0x0000AA,
    0x00AA00,
    0x00AAAA,
    0xAA0000,
    0xAA00AA,
    0xAAAA00,
    0xAAAAAA
];

const scoreCorrect = 10; // Skor jika 2 benda yang terpilih memiliki warna yang sama
const scoreWrong = -5; // Skor jika 2 benda yang terpilih memiliki warna berbeda

const elementScore = document.getElementById("score"); // Elemen HTML untuk menampilkan skor
let currentScore = 0; // Skor

let selectedObject = []; // Array objek yang terpilih
let originalColors = []; // Warna - warna original

let createObjectSpeed = 2500;
const baseCreateObjectSpeed = 2500;

const timer = new THREE.Clock();

const maxObjects = 60; // Jumlah object maksimum

// Fungsi random

function randomRange(a, b)
{
    let x = Math.floor(Math.random() * (b - a + 1));
    return x + a;
};

function createObject()
{
    let geom;

    // Random bentuk object

    if (randomRange(0, 1))
        geom = new THREE.SphereGeometry(3, 16, 20);
    else
        geom = new THREE.BoxGeometry(4, 4, 4);

    const color = colors[randomRange(0, colors.length - 1)]; 
    const mat = new THREE.MeshPhongMaterial({
        color: color,
        shineness: 100,
        emissive: color + 0.05
    });

    const mesh = new THREE.Mesh(geom, mat);

    // Random posisi objek
    
    mesh.position.x = randomRange(-35, 35);
    mesh.position.y = randomRange(-35, 35);
    mesh.position.z = randomRange(-35, 35);

    scene.add(mesh);
};

function addCurrentScore(newScore) {
    currentScore += newScore;
    elementScore.innerHTML = currentScore;
}

function onMouseClick(e) {
    // Raycasting

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
    mouse.z = 1;

    rayCast.setFromCamera(mouse, camera);

    let intersectedObjects = rayCast.intersectObjects(scene.children, false);

    if (intersectedObjects.length > 0)
    {   
        selectedObject.push(intersectedObjects);
        originalColors.push(intersectedObjects[0].object.material.color.getHex());
    
        if (selectedObject.length > 1 )
        {
            if (selectedObject[0][0].object.uuid === selectedObject[1][0].object.uuid)
            {
                selectedObject[0][0].object.material.emissive.setHex(originalColors[0]);
                selectedObject[0][0].object.rotation.x = 0;
                selectedObject[0][0].object.rotation.y = 0;
            } else if (originalColors[0] == (originalColors[1])) {
                // Jika objek yang dipilih warnanya sama

                selectedObject.forEach(object => {
                    object[0].object.geometry.dispose();
                    object[0].object.material.dispose();

                    scene.remove(object[0].object);
                    renderer.renderLists.dispose();
                });

                addCurrentScore(scoreCorrect); // Tambahkan score
            } else {
                // Jika benda yang dipilih berbeda warna

                selectedObject[0][0].object.material.emissive.setHex(originalColors[0]);
                selectedObject[0][0].object.rotation.x = 0;
                selectedObject[0][0].object.rotation.y = 0;

                addCurrentScore(scoreWrong); // Kurangi score
            }

            selectedObject = [];
            originalColors = [];
        } else if (selectedObject.length > 2) {
            selectedObject = [];
            originalColors = [];
        }
    } 
};

function createObjects()
{
    if(scene.children.length >= maxObjects)
    {
        createObjectSpeed = baseCreateObjectSpeed;

        currentScore = 0;
        elementScore.innerHTML = currentScore;

    } else {
        createObjectSpeed -= 150;
        createObject();
    }

    setTimeout(createObjects, createObjectSpeed);
}


function init()
{
    // Buat scene

    scene = new THREE.Scene();

    // Background untuk scene

    const backgroundTexture = new THREE.TextureLoader().load('./background.jpg');
    scene.background = backgroundTexture;

    // Buat camera

    camera = new THREE.PerspectiveCamera(70, 
                    window.innerWidth / window.innerHeight, 
                    1, 1000);

    camera.position.z = 70;

    // Lights

    var light1 = new THREE.SpotLight(0xfffff,0.5);
    var light2 = new THREE.SpotLight(0xfffff,0.5);

    light1.position.set(0, 30, 0);
    light2.position.set(0, -30, 0);

    scene.add(new THREE.SpotLightHelper(light1)); 
    scene.add(light1);
    scene.add(light2);
    
    // Buat objek - objek

    for(let i = 0; i < maxObjects / 2; i++, createObject());

    createObjects(); // Untuk membuat objek bertambah secara pelan - pelan

    // Buat renderer
    
    renderer = new THREE.WebGLRenderer();   
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    document.body.appendChild(renderer.domElement);
    document.addEventListener("click", onMouseClick, false);  
    
    // Orbit control

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    
    // Raycaster

    rayCast = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    mouse.x = mouse.y = -1;
};

function mainLoop()
{
    if (selectedObject.length == 1) {
        // Highlight object terpilih

        const colorHex = timer.getElapsedTime() % 0.5 >= 0.25 ? originalColors[0] : (originalColors[0] * 3);
        selectedObject[0][0].object.material.emissive.setHex(colorHex);

        // Animasikan object terpilih

        selectedObject[0][0].object.rotation.x += 0.1;
        selectedObject[0][0].object.rotation.y += 0.1;
    }
    
    renderer.render(scene, camera);
    controls.update();        
    window.requestAnimationFrame(mainLoop);
};

init();
mainLoop();