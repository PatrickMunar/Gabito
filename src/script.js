import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import gsap from 'gsap'
import testVertexShader from './shaders/vertex.glsl'
import testFragmentShader from './shaders/fragment.glsl'
import { Controller } from 'lil-gui'

// Clear Scroll Memory
window.history.scrollRestoration = 'manual'

// -----------------------------------------------------------------
/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Loading Manager
const loadingBar = document.getElementById('loadingBar')
const loadingPage = document.getElementById('loadingPage')

const loadingManager = new THREE.LoadingManager(
    // Loaded
    () => {
       
    },
    // Progress
    (itemUrl, itemsLoaded, itemsTotal) => {
        const progressRatio = itemsLoaded/itemsTotal
        loadingBar.style.transform = 'scaleX(' + progressRatio + ')'
    }
)

const textures = []

// Texture loader
const textureLoader = new THREE.TextureLoader()
textures[0] = textureLoader.load('./images/1.jpg')
textures[1] = textureLoader.load('./images/2.jpg')
textures[2] = textureLoader.load('./images/5.jpg')
textures[3] = textureLoader.load('./images/9.jpg')
textures[4] = textureLoader.load('./images/8.jpg')

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader(loadingManager)
gltfLoader.setDRACOLoader(dracoLoader)

// Font Loader
const fontLoader = new FontLoader()
fontLoader.load('./fonts/Simpsonfont.ttf')

// gltfLoader.load(
//     'Bed.glb',
//     (obj) => {
       
//         scene.add(obj.scene)
//         obj.scene.scale.set(0.05,0.05,0.05)

//         // 
//         topBedframeGroup.add(obj.scene)
//         obj.scene.children[0].castShadow = true
//         obj.scene.children[0].receiveShadow = true
//     }
// )

// Lighting

const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.set(10,-10,10)
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {    
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0,0,16)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enabled = false
controls.enableDamping = true

// Animations
const waveDownAnimation = (y) => {
    if (waveClickParameters.waveAmplitude >= 0.1) {
        waveClickParameters.waveAmplitude -= 0.02
        setTimeout(() => {
            waveDownAnimation(y)
        }, 10)
    }
    else {
        waveClickParameters.waveAmplitude = 0
        noClicks = false
    }
    y.uniforms.uAmplitude.value = waveClickParameters.waveAmplitude
}

const waveUpAnimation = (x) => {
    if (waveClickParameters.waveAmplitude <= 1) {
        waveClickParameters.waveAmplitude += 0.05
        setTimeout(() => {
            waveUpAnimation(x)
        }, 10)
    }
    else {
        waveDownAnimation(x)
    }
    x.uniforms.uAmplitude.value = waveClickParameters.waveAmplitude
}

// Mesh Carousel
const carouselGroup = new THREE.Group
scene.add(carouselGroup)

// Picture Parameters
const parameters = {
    widthFactor: 8,
    heightFactor: 8,
    amplitudeFactor: 0.3,
    speedFactor: 5,
    wideWidthFactor: 16,
    wideHeightFactor: 9
}

const waveClickParameters = {
    waveFrequency: 1,
    waveAmplitude: 0
}

const planeSize = {
    width: 32*parameters.widthFactor,
    height: 32*parameters.heightFactor,
    wideWidth: 32*parameters.wideWidthFactor,
    wideHeight: 32*parameters.wideHeightFactor,
}

// Picture Parameters
const pm2geometry = new THREE.PlaneGeometry(parameters.wideWidthFactor * 0.5, parameters.wideHeightFactor * 0.5, planeSize.wideWidth, planeSize.wideHeight)
const count = pm2geometry.attributes.position.count

// Material
const pm2material = new THREE.RawShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    uniforms: {
        uFrequency: {value: waveClickParameters.waveFrequency * 1.5},
        uTime: {value: 0},
        uOscillationFrequency: {value: 5},
        uColor: {value: new THREE.Color('#aa00ff')},
        uTexture: { value: textures[0] },
        uAmplitude: {value: waveClickParameters.waveAmplitude},
        uRotationX: {value: 0},
        uRotationZ: {value: 1},
    },
    side: THREE.DoubleSide,
})

// Picture Mesh 2
let pictureMesh2 = new THREE.Mesh(pm2geometry, pm2material)
pictureMesh2.position.set(0,0,5)
pictureMesh2.rotation.z = Math.PI * 8/180
scene.add(pictureMesh2)
carouselGroup.add(pictureMesh2)

// Picture Parameters
const pm3geometry = new THREE.PlaneGeometry(parameters.wideWidthFactor * 0.5, parameters.wideHeightFactor * 0.5, planeSize.wideWidth, planeSize.wideHeight)

// Material
const pm3material = new THREE.RawShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    uniforms: {
        uFrequency: {value: waveClickParameters.waveFrequency * 1.5},
        uTime: {value: 0},
        uOscillationFrequency: {value: 5},
        uColor: {value: new THREE.Color('#aa00ff')},
        uTexture: { value: textures[1] },
        uAmplitude: {value: waveClickParameters.waveAmplitude},
        uRotationX: {value: -1},
        uRotationZ: {value: 0},
    },
    side: THREE.DoubleSide
})

// Picture Mesh 3
let pictureMesh3 = new THREE.Mesh(pm3geometry, pm3material)
pictureMesh3.position.set(-5,-1.5,0)
pictureMesh3.rotation.y = -Math.PI/2
pictureMesh3.rotation.x = -Math.PI * 8/180
scene.add(pictureMesh3)
carouselGroup.add(pictureMesh3)

// Picture Parameters
const pm4geometry = new THREE.PlaneGeometry(parameters.wideWidthFactor * 0.5, parameters.wideHeightFactor * 0.5, planeSize.wideWidth, planeSize.wideHeight)

// Material
const pm4material = new THREE.RawShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    uniforms: {
        uFrequency: {value: waveClickParameters.waveFrequency * 1.5},
        uTime: {value: 0},
        uOscillationFrequency: {value: 5},
        uColor: {value: new THREE.Color('#aa00ff')},
        uTexture: { value: textures[2] },
        uAmplitude: {value: waveClickParameters.waveAmplitude},
        uRotationX: {value: 0},
        uRotationZ: {value: -1},
    },
    side: THREE.DoubleSide
})

// Picture Mesh 4
let pictureMesh4 = new THREE.Mesh(pm4geometry, pm4material)
pictureMesh4.position.set(0,-3,-5)
pictureMesh4.rotation.y = Math.PI
pictureMesh4.rotation.z = Math.PI * 8/180
scene.add(pictureMesh4)
carouselGroup.add(pictureMesh4)

// Picture Parameters
const pm5geometry = new THREE.PlaneGeometry(parameters.wideWidthFactor * 0.5, parameters.wideHeightFactor * 0.5, planeSize.wideWidth, planeSize.wideHeight)

// Material
const pm5material = new THREE.RawShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    uniforms: {
        uFrequency: {value: waveClickParameters.waveFrequency * 1.5},
        uTime: {value: 0},
        uOscillationFrequency: {value: 5},
        uColor: {value: new THREE.Color('#aa00ff')},
        uTexture: { value: textures[3] },
        uAmplitude: {value: waveClickParameters.waveAmplitude},
        uRotationX: {value: 1},
        uRotationZ: {value: 0},
    },
    side: THREE.DoubleSide
})

// Picture Mesh 5
let pictureMesh5= new THREE.Mesh(pm5geometry, pm5material)
pictureMesh5.position.set(5,-4.5,0)
pictureMesh5.rotation.y = Math.PI/2
pictureMesh5.rotation.x = Math.PI * 8/180
scene.add(pictureMesh5)
carouselGroup.add(pictureMesh5)

// Picture Parameters
const pm6geometry = new THREE.PlaneGeometry(parameters.wideWidthFactor * 0.5, parameters.wideHeightFactor * 0.5, planeSize.wideWidth, planeSize.wideHeight)

// Material
const pm6material = new THREE.RawShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    uniforms: {
        uFrequency: {value: waveClickParameters.waveFrequency * 1.5},
        uTime: {value: 0},
        uOscillationFrequency: {value: 5},
        uColor: {value: new THREE.Color('#aa00ff')},
        uTexture: { value: textures[4] },
        uAmplitude: {value: waveClickParameters.waveAmplitude},
        uRotationX: {value: 0},
        uRotationZ: {value: 1},
    },
    side: THREE.DoubleSide
})

// Picture Mesh 6
let pictureMesh6= new THREE.Mesh(pm6geometry, pm6material)
pictureMesh6.position.set(0,-6,5)
pictureMesh6.rotation.z = Math.PI * 8/180
scene.add(pictureMesh6)
carouselGroup.add(pictureMesh6)

// Arrays
const pictureMaterials = [pm2material, pm3material, pm4material, pm5material, pm6material]
const pictureGeometries = [pm2geometry, pm3geometry, pm4geometry, pm5geometry, pm6geometry]
const pictureMeshes = [pictureMesh2, pictureMesh3, pictureMesh4, pictureMesh5, pictureMesh6]
const meshRotations = [pictureMesh2.rotation, pictureMesh3.rotation, pictureMesh4.rotation, pictureMesh5.rotation, pictureMesh6.rotation]

// Curvature
const curveMesh = (x) => {
    const curvature = new Float32Array(count)
    let angle = 0 
    
    for (let i = 0; i <= 9*32; i++) {
        for (let j = 0; j <= 16*32; j++) {
            if (j != 9*32) {
                angle = j/(9*32) + Math.PI/4
                curvature[j + (16*32+1)*i] = Math.sin(angle)
            }
            else {
                curvature[j + (16*32+1)*i] = 1
            }
        }
    }  
    
    pictureGeometries[x].setAttribute('aCurvature', new THREE.BufferAttribute(curvature, 1))
}

// Flatten
const flattenMesh = (x) => {
    const curvature = new Float32Array(count)
    
    for (let i = 0; i <= 9*32; i++) {
        for (let j = 0; j <= 16*32; j++) {
            curvature[j + (16*32+1)*i] = 1
        }
    }  
    
    pictureGeometries[x].setAttribute('aCurvature', new THREE.BufferAttribute(curvature, 1))
}

// Straighten
const straightenMesh = (x) => {
    gsap.to(pictureMeshes[x].scale, {duration: 0.5, x: 1.4, y: 1.4})
    if (x%2 == 0 || x == 0) {
        gsap.to(pictureMeshes[x].rotation, {duration: 0.5, z: 0})
        if (x == 0) {
            gsap.to(pictureMeshes[x].position, {duration: 0.5, x: pictureMeshes[x].position.x + 2.25, y: pictureMeshes[x].position.y - 0.85})
        }
        else if ((x/2)%2 == 0) {
            gsap.to(pictureMeshes[x].position, {duration: 0.5, x: pictureMeshes[x].position.x + 2.25, y: pictureMeshes[x].position.y - 0.85})
        }
        else {
            gsap.to(pictureMeshes[x].position, {duration: 0.5, x: pictureMeshes[x].position.x - 2.25, y: pictureMeshes[x].position.y - 0.85})
        }
    }
    else {
        gsap.to(pictureMeshes[x].rotation, {duration: 0.5, x: 0})
        if (((x+1)/2)%2 != 0) {
            gsap.to(pictureMeshes[x].position, {duration: 0.5, z: pictureMeshes[x].position.z + 2.25, y: pictureMeshes[x].position.y - 0.85})
        }
        else {
            gsap.to(pictureMeshes[x].position, {duration: 0.5, z: pictureMeshes[x].position.z - 2.25, y: pictureMeshes[x].position.y - 0.85})
        }
    }
}

// Ske
const skewMesh = (x) => {
    gsap.to(pictureMeshes[x].scale, {duration: 0.5, x: 1, y: 1})
    if (x%2 == 0 || x == 0) {
        gsap.to(pictureMeshes[x].rotation, {duration: 0.5, z: Math.PI*8/180})
        if (x == 0) {
            gsap.to(pictureMeshes[x].position, {duration: 0.5, x: pictureMeshes[x].position.x - 2.25, y: pictureMeshes[x].position.y + 0.85})
        }
        else if ((x/2)%2 == 0) {
            gsap.to(pictureMeshes[x].position, {duration: 0.5, x: pictureMeshes[x].position.x - 2.25, y: pictureMeshes[x].position.y + 0.85})
        }
        else {
            gsap.to(pictureMeshes[x].position, {duration: 0.5, x: pictureMeshes[x].position.x + 2.25, y: pictureMeshes[x].position.y + 0.85})
        }
    }
    else {
        if (((x+1)/2)%2 != 0) {
            gsap.to(pictureMeshes[x].rotation, {duration: 0.5, x: -Math.PI*8/180})
            gsap.to(pictureMeshes[x].position, {duration: 0.5, z: pictureMeshes[x].position.z - 2.25, y: pictureMeshes[x].position.y + 0.85})
        }
        else {
            gsap.to(pictureMeshes[x].rotation, {duration: 0.5, x: Math.PI*8/180})
            gsap.to(pictureMeshes[x].position, {duration: 0.5, z: pictureMeshes[x].position.z + 2.25, y: pictureMeshes[x].position.y + 0.85})
        }
    } 
}

// Curve Calls
curveMesh(0)
curveMesh(1)
curveMesh(2)
curveMesh(3)
curveMesh(4)

/**
 * Renderer
 */
 const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})
renderer.setClearColor( 0x000000, 0 )
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.CineonToneMapping

// Raycaster
const raycaster = new THREE.Raycaster()

// Parallax Camera Group
const cameraGroup = new THREE.Group
cameraGroup.add(camera)
cameraGroup.position.set(0,0,0)
scene.add(cameraGroup)

// Mouse
const mouse = new THREE.Vector2()
let cursorY = 0

window.addEventListener('mousemove', (event) =>
{
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1

    // Cursor Follower
    cursorY = event.clientY - 10
    // gsap.to('.cursorFollower', {x: event.clientX - 15, y: event.clientY - 15 + scrollY})
})

// Raycasting Click
let landingCurrentIntersect = null
let noClicks = false
let carouselRemoved = false

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; } 
  }));
} catch(e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
function disableScroll() {
    document.body.style.overflow = 'hidden';
  window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

// call this to Enable
function enableScroll() {
    document.body.style.overflowY = 'visible';
    document.body.style.overflowX = 'hidden';
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
  window.removeEventListener('touchmove', preventDefault, wheelOpt);
  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}

const removeCarousel = (x) => {
    disableScroll()
    for (let i = 0; i < pictureMeshes.length; i++) {
        if (i < x) {
            gsap.to(pictureMeshes[i].position, {duration: 1, delay: 0.25, y: pictureMeshes[i].position.y + 20})
        }
        else if (i > x) {
            gsap.to(pictureMeshes[i].position, {duration: 1, delay: 0.25, y: pictureMeshes[i].position.y - 20})
        }
    }
    setTimeout(() => {
        flattenMesh(x)
        straightenMesh(x)
    }, 200)
    carouselRemoved = true
}

const addCarousel = (x) => {
    setTimeout(() => {
        skewMesh(x)
        curveMesh(x)
    }, 200)
    enableScroll()
    carouselRemoved = false
    for (let i = 0; i < pictureMeshes.length; i++) {
        if (i < x) {
            gsap.to(pictureMeshes[i].position, {duration: 1, delay: 0.25, y: pictureMeshes[i].position.y - 20})
        }
        else if (i > x) {
            gsap.to(pictureMeshes[i].position, {duration: 1, delay: 0.25, y: pictureMeshes[i].position.y + 20})
        }
    }
}

window.addEventListener('click', () => {
    if (noClicks == false) {
        if (landingCurrentIntersect) {
            if (landingCurrentIntersect.object == pictureMesh2) {
                waveUpAnimation(pm2material)
                if (carouselRemoved == false) {
                    removeCarousel(0)
                }
                else {
                    addCarousel(0)
                }
                noClicks = true
            }
            if (landingCurrentIntersect.object == pictureMesh3) {
                waveUpAnimation(pm3material)
                if (carouselRemoved == false) {
                    removeCarousel(1)
                }
                else {
                    addCarousel(1)
                }
                noClicks = true
            }
            if (landingCurrentIntersect.object == pictureMesh4) {
                waveUpAnimation(pm4material)
                if (carouselRemoved == false) {
                    removeCarousel(2)
                }
                else {
                    addCarousel(2)
                }
                noClicks = true
            }
            if (landingCurrentIntersect.object == pictureMesh5) {
                waveUpAnimation(pm5material)
                if (carouselRemoved == false) {
                    removeCarousel(3)
                }
                else {
                    addCarousel(3)
                }
                noClicks = true
            }
            if (landingCurrentIntersect.object == pictureMesh6) {
                waveUpAnimation(pm6material)
                if (carouselRemoved == false) {
                    removeCarousel(4)
                }
                else {
                    addCarousel(4)
                }
                noClicks = true
            }
        }
    }
})

// Scroll
const sectionDistance = 1.5

let scrollX = 0
let scrollY = 0
window.addEventListener('scroll', () => {
    scrollY = window.scrollY
    scrollX = window.scrollX
    // gsap.to('.cursorFollower', {y: cursorY + scrollY})
})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const parallaxTime = elapsedTime

    // Camera Scroll
    camera.position.y = -scrollY / sizes.height * sectionDistance

    // Update uTime
    pm2material.uniforms.uTime.value = elapsedTime
    pm3material.uniforms.uTime.value = elapsedTime
    pm4material.uniforms.uTime.value = elapsedTime
    pm5material.uniforms.uTime.value = elapsedTime
    pm6material.uniforms.uTime.value = elapsedTime

    // Camera Parallax
    const parallaxY = - mouse.y * 0.05 
    cameraGroup.position.y += ( parallaxY - cameraGroup.position.y )

    // Mesh Parallax

    //Raycasting
    raycaster.setFromCamera(mouse, camera)

    const landingTestBox = [pictureMesh2, pictureMesh3, pictureMesh4, pictureMesh5, pictureMesh6]
    const landingIntersects = raycaster.intersectObjects(landingTestBox)

    if (landingIntersects.length) {
        if(!landingCurrentIntersect)
        {
            canvas.style.cursor = 'pointer'
            // gsap.to('.cursorFollower', {backgroundColor: 'rgba(219, 0, 0, 0.7)', opacity: 1})
        }
        if (landingCurrentIntersect === null) {
            landingCurrentIntersect = landingIntersects[0]
        }
    }
    else {
        if(landingCurrentIntersect)
        {
            canvas.style.cursor = 'default'
            // gsap.to('.cursorFollower', {backgroundColor: '#703f12d0', opacity: 0})
        }
        if (landingCurrentIntersect) {
            landingCurrentIntersect = null
        }
        landingCurrentIntersect = null
    }

    // Update controls
    if (controls.enabled == true) {
        controls.update()
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    setTimeout(() => {
        window.requestAnimationFrame(tick)
      }, 1000 / 240)
    // window.requestAnimationFrame(tick)

    
}

tick()

// Sets

// Scroll Triggers

gsap.registerPlugin(ScrollTrigger)
const vhValue = (coef) => {
    window.innerHeight*(coef/100)
}

gsap.to(cameraGroup.rotation , {
    scrollTrigger: {
        trigger: '.sections',
        start: 'top top',
        end: vhValue(800),
        scrub: true,
        snap: 1/8
    },
    y: - Math.PI*4,
    ease: 'none',
})
