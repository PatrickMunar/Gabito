import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import gsap from 'gsap'
import testVertexShader from './shaders/vertex.glsl'
import testFragmentShader from './shaders/fragment.glsl'
import flagFragmentShader from './shaders/flagFragment.glsl'
import flagVertexShader from './shaders/flagVertex.glsl'
import seaFragmentShader from './shaders/seaFragment.glsl'
import seaVertexShader from './shaders/seaVertex.glsl'
import { Vector2 } from 'three'
import ScrollToPlugin from "gsap/ScrollToPlugin";

// Clear Scroll Memory
window.history.scrollRestoration = 'manual'

// -----------------------------------------------------------------
/**
 * Base
 */
// Site States

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
        // const progressRatio = itemsLoaded/itemsTotal
        // loadingBar.style.transform = 'scaleX(' + progressRatio + ')'
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
textures[5] = textureLoader.load('./images/6.jpg')
textures[6] = textureLoader.load('./images/3.jpg')
textures[7] = textureLoader.load('./images/7.jpg')
const PHMapTexture = textureLoader.load('./images/philippines.png')
const leavesTexture = textureLoader.load('./images/leaf.svg')

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader(loadingManager)
gltfLoader.setDRACOLoader(dracoLoader)

// Load GLTF
const cameraBase = new THREE.Group
const cameraOtherLens = new THREE.Group
const cameraFocus = new THREE.Group
const cameraZoom = new THREE.Group
const cameraOuterLens = new THREE.Group
const cameraModel = new THREE.Group

gltfLoader.load(
    'CameraBase.glb',
    (obj) => {
       
        scene.add(obj.scene)
             obj.scene.scale.set(0.09, 0.09, 0.09)

        cameraBase.add(obj.scene)
        obj.scene.castShadow = true
        obj.scene.children[0].children[0].castShadow = true
        obj.scene.children[0].children[0].receiveShadow = true
        obj.scene.children[0].children[0].frustumCulled = false
        obj.scene.children[0].children[1].castShadow = true
        obj.scene.children[0].children[1].receiveShadow = true
        obj.scene.children[0].children[1].frustumCulled = false

    }
)

gltfLoader.load(
    'CameraOtherLens.glb',
    (obj) => {
       
        scene.add(obj.scene)
             obj.scene.scale.set(0.09, 0.09, 0.09)

        cameraOtherLens.add(obj.scene)
        obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'CameraFocus.glb',
    (obj) => {
       
        scene.add(obj.scene)
             obj.scene.scale.set(0.09, 0.09, 0.09)

        cameraFocus.add(obj.scene)
        obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true 
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'CameraZoom.glb',
    (obj) => {
       
        scene.add(obj.scene)
             obj.scene.scale.set(0.09, 0.09, 0.09)

        cameraZoom.add(obj.scene)
        obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'CameraOuterLens.glb',
    (obj) => {
       
        scene.add(obj.scene)
             obj.scene.scale.set(0.09, 0.09, 0.09)

        cameraOuterLens.add(obj.scene)
        obj.scene.castShadow = true
        obj.scene.children[0].children[0].castShadow = true
        obj.scene.children[0].children[0].receiveShadow = true
        obj.scene.children[0].children[0].frustumCulled = false
        obj.scene.children[0].children[1].castShadow = true
        obj.scene.children[0].children[1].receiveShadow = true
        obj.scene.children[0].children[1].frustumCulled = false
    }
)

gsap.to(cameraOuterLens.rotation, {z: Math.PI/2})

// scene.add(cameraBase)
// scene.add(cameraOtherLens)
// scene.add(cameraFocus)
// scene.add(cameraZoom)
// scene.add(cameraOuterLens)

cameraModel.add(cameraBase)
cameraModel.add(cameraOtherLens)
cameraModel.add(cameraFocus)
cameraModel.add(cameraZoom)
cameraModel.add(cameraOuterLens)
cameraModel.rotation.set(Math.PI/2, 0, Math.PI/2)
cameraModel.position.set(0,-20,0)
scene.add(cameraModel)

let CorCCW = -1

const rotateCameraZoom = () => {
    if (CorCCW == -1){
        CorCCW = 1
    }
    else {
        -1
    }
    const mainRot = (Math.PI/2 + (Math.random() - 0.5)*Math.PI/2) * CorCCW
    const OLdz = (mainRot)/(Math.PI*1.5) * 1 - 0.4
    gsap.to(cameraZoom.rotation, {duration: 2, z: mainRot})
    gsap.to(cameraOuterLens.rotation, {duration: 2, z: -mainRot})
    gsap.to(cameraOuterLens.position, {duration: 2, z: OLdz})
    setTimeout(() => {
        rotateCameraZoom()
    }, 2000)
} 

const rotateCameraFocus = () => {
    if (CorCCW == -1){
        CorCCW = 1
    }
    else {
        -1
    }
    const time = Math.random()*3 + 0.5 
    const STtime = time * 1000
    const mainRot = (Math.PI + (Math.random() - 0.5)*Math.PI) * CorCCW
    gsap.to(cameraFocus.rotation, {duration: Math.random()*3 + 0.5 , z: mainRot})
    setTimeout(() => {
        rotateCameraFocus()
    }, STtime)
} 

rotateCameraZoom()
rotateCameraFocus()

// Font Loader
const fontLoader = new FontLoader()

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.set(0, 10, 20)
scene.add(pointLight)

pointLight.castShadow = true
pointLight.shadow.mapSize.x = 1024*4
pointLight.shadow.mapSize.y = 1024*4
pointLight.shadow.camera.near = 5
pointLight.shadow.camera.far = 50
pointLight.shadow.normalBias = 0.05

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

    // seaMaterial.uniforms.uResolution.value.x = renderer.domElement.width;
    // seaMaterial.uniforms.uResolution.value.y = renderer.domElement.height;
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
carouselGroup.position.set(0,-11.5,0)
scene.add(carouselGroup)

// Picture Parameters
const parameters = {
    widthFactor: 8,
    heightFactor: 8,
    amplitudeFactor: 1,
    speedFactor: 0.75,
    wideWidthFactor: 16,
    wideHeightFactor: 9,
    mapWidthFactor: 515,
    mapHeightFactor: 1045
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
    mapWidth: 50,
    mapHeight: 100,
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
pictureMesh2.frustumCulled = false
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
pictureMesh3.frustumCulled = false
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
pictureMesh4.frustumCulled = false
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
pictureMesh5.frustumCulled = false
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
pictureMesh6.frustumCulled = false
scene.add(pictureMesh6)
carouselGroup.add(pictureMesh6)

// Picture Parameters
const pm7geometry = new THREE.PlaneGeometry(parameters.wideWidthFactor * 0.5, parameters.wideHeightFactor * 0.5, planeSize.wideWidth, planeSize.wideHeight)

// Material
const pm7material = new THREE.RawShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    uniforms: {
        uFrequency: {value: waveClickParameters.waveFrequency * 1.5},
        uTime: {value: 0},
        uOscillationFrequency: {value: 5},
        uColor: {value: new THREE.Color('#aa00ff')},
        uTexture: { value: textures[5] },
        uAmplitude: {value: waveClickParameters.waveAmplitude},
        uRotationX: {value: -1},
        uRotationZ: {value: 0},
    },
    side: THREE.DoubleSide
})

// Picture Mesh 7
let pictureMesh7= new THREE.Mesh(pm7geometry, pm7material)
pictureMesh7.position.set(-5,-7.5,0)
pictureMesh7.rotation.y = -Math.PI/2
pictureMesh7.rotation.x = -Math.PI * 8/180
pictureMesh7.frustumCulled = false
scene.add(pictureMesh7)
carouselGroup.add(pictureMesh7)

// Picture Parameters
const pm8geometry = new THREE.PlaneGeometry(parameters.wideWidthFactor * 0.5, parameters.wideHeightFactor * 0.5, planeSize.wideWidth, planeSize.wideHeight)

// Material
const pm8material = new THREE.RawShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    uniforms: {
        uFrequency: {value: waveClickParameters.waveFrequency * 1.5},
        uTime: {value: 0},
        uOscillationFrequency: {value: 5},
        uColor: {value: new THREE.Color('#aa00ff')},
        uTexture: { value: textures[6] },
        uAmplitude: {value: waveClickParameters.waveAmplitude},
        uRotationX: {value: 0},
        uRotationZ: {value: -1},
    },
    side: THREE.DoubleSide
})

// Picture Mesh 8
let pictureMesh8= new THREE.Mesh(pm8geometry, pm8material)
pictureMesh8.position.set(0,-9,-5)
pictureMesh8.rotation.y = Math.PI
pictureMesh8.rotation.z = Math.PI * 8/180
pictureMesh8.frustumCulled = false
scene.add(pictureMesh8)
carouselGroup.add(pictureMesh8)

// Picture Parameters
const pm9geometry = new THREE.PlaneGeometry(parameters.wideWidthFactor * 0.5, parameters.wideHeightFactor * 0.5, planeSize.wideWidth, planeSize.wideHeight)

// Material
const pm9material = new THREE.RawShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    uniforms: {
        uFrequency: {value: waveClickParameters.waveFrequency * 1.5},
        uTime: {value: 0},
        uOscillationFrequency: {value: 5},
        uColor: {value: new THREE.Color('#aa00ff')},
        uTexture: { value: textures[7] },
        uAmplitude: {value: waveClickParameters.waveAmplitude},
        uRotationX: {value: 1},
        uRotationZ: {value: 0},
    },
    side: THREE.DoubleSide
})

// Picture Mesh 5
let pictureMesh9= new THREE.Mesh(pm9geometry, pm9material)
pictureMesh9.position.set(5,-10.5,0)
pictureMesh9.rotation.y = Math.PI/2
pictureMesh9.rotation.x = Math.PI * 8/180
pictureMesh9.frustumCulled = false
scene.add(pictureMesh9)
carouselGroup.add(pictureMesh9)

// Picture Parameters
const PHgeometry = new THREE.PlaneGeometry(parameters.mapWidthFactor * 0.05, parameters.mapHeightFactor * 0.05, planeSize.mapWidth, planeSize.mapHeight)
const PHCount = PHgeometry.attributes.position.count

// Material
const PHmaterial = new THREE.RawShaderMaterial({
    vertexShader: flagVertexShader,
    fragmentShader: flagFragmentShader,
    uniforms: {
        uFrequency: {value: waveClickParameters.waveFrequency * 1.5},
        uTime: {value: 0},
        uOscillationFrequency: {value: 5},
        uColor: {value: new THREE.Color('#345028')},
        uTexture: { value: PHMapTexture },
        uAmplitude: {value: waveClickParameters.waveAmplitude},
        uRotationX: {value: 1},
        uRotationZ: {value: 1},
    },
    side: THREE.DoubleSide,
    transparent: true,
    // wireframe: true
})

// PH Map
let PHMap= new THREE.Mesh(PHgeometry, PHmaterial)
PHMap.position.set(10,-5,-30)
scene.add(PHMap)

// // Sea
// // Geometry
// const seaParameters = {
//     widthFactor: 150,
//     heightFactor: 150,
//     amplitudeFactor: 0.3,
//     speedFactor: 5
// }

// const seaPlaneSize = {
//     width: 16*parameters.widthFactor,
//     height: 16*parameters.heightFactor
// }

// const seaGeometry = new THREE.PlaneGeometry(seaParameters.widthFactor, seaParameters.heightFactor, seaPlaneSize.width, seaPlaneSize.height)

// const seaCount = seaGeometry.attributes.position.count
// const seaRandoms = new Float32Array(count)

// const randomize = () => {
//     for (let i = 0; i < seaCount; i++) {
//         seaRandoms[i] = (Math.random()) * seaParameters.amplitudeFactor * Math.random()
//     }  
    
//     seaGeometry.setAttribute('aRandom', new THREE.BufferAttribute(seaRandoms, 1))
// }

// const runRandomize = () => {
//     randomize()
//     setTimeout(() => {
//         runRandomize()
//     }, 50/seaParameters.speedFactor)
// }

// runRandomize()

// // Material
// const seaMaterial = new THREE.RawShaderMaterial({
//     vertexShader: seaVertexShader,
//     fragmentShader: seaFragmentShader,
//     uniforms: {
//         uFrequency: {value: new Vector2(5, 3)},
//         uTime: {value: 0},
//         uOscillationFrequency: {value: 5},
//         uColor: {value: new THREE.Color('#001a33')},
//         uRotationX: {value: 0},
//         uRotationZ: {value: 1},
//         uUpdate: {value: 1},
//         uResolution: {value: new THREE.Vector2() },
//     },
//     // wireframe: true,
//     transparent: true
// })


// // Mesh
// let seaMesh = new THREE.Mesh(seaGeometry, seaMaterial)
// seaMesh.position.z = -50
// scene.add(seaMesh)

// Arrays
const pictureMaterials = [pm2material, pm3material, pm4material, pm5material, pm6material, pm7material, pm8material, pm9material]
const pictureGeometries = [pm2geometry, pm3geometry, pm4geometry, pm5geometry, pm6geometry, pm7geometry, pm8geometry, pm9geometry]
const pictureMeshes = [pictureMesh2, pictureMesh3, pictureMesh4, pictureMesh5, pictureMesh6, pictureMesh7, pictureMesh8, pictureMesh9]
const meshRotations = [pictureMesh2.rotation, pictureMesh3.rotation, pictureMesh4.rotation, pictureMesh5.rotation, pictureMesh6.rotation, pictureMesh7.rotation, pictureMesh8.rotation, pictureMesh9.rotation]
const pictureCLickDivs = ['#pm2Click', '#pm3Click', '#pm4Click', '#pm5Click', '#pm6Click', '#pm7Click', '#pm8Click', '#pm9Click']

// Converters
const vhValue = (coef) => {
    window.innerHeight*(coef/100)
}
const vwValue = (coef) => {
    window.innerWidth*(coef/100)
}

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
    gsap.to(pictureCLickDivs[x], {x:'14vw', y: '10vh', transform: 'rotateZ(0deg) scale(1.4)'})
    gsap.to('.eyeIcon', {duration: 0.5, opacity: 0})
    gsap.to('.exitIcon', {duration: 0.5, opacity: 1})
    cursorState = 'EXIT'
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
    gsap.to(pictureCLickDivs[x], {x:'0vw', y: '0vh', transform: 'rotateZ(-8deg) scale(1)'})
    gsap.to('.eyeIcon', {duration: 0.5, opacity: 1})
    gsap.to('.exitIcon', {duration: 0.5, opacity: 0})
    cursorState = 'EYES'
}

// Curve Calls
curveMesh(0)
curveMesh(1)
curveMesh(2)
curveMesh(3)
curveMesh(4)
curveMesh(5)
curveMesh(6)
curveMesh(7)

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

// seaMaterial.uniforms.uResolution.value.x = renderer.domElement.width;
// seaMaterial.uniforms.uResolution.value.y = renderer.domElement.height;

// Parallax Camera Group
const cameraGroup = new THREE.Group
cameraGroup.add(camera)
cameraGroup.position.set(0,0,0)
scene.add(cameraGroup)
cameraGroup.add(PHMap)
cameraGroup.add(pointLight)
// cameraGroup.add(seaMesh)

// // Particles
// const particlesCount = 1
// const positions = new Float32Array(particlesCount * 3)

// for (let i=0; i<particlesCount*3; i++) {
//     // positions[i*3 + 0] = ( Math.random() - 0.5 ) * 20
//     // positions[i*3 + 1] = ( Math.random() - 0.5 ) * 20 + ( Math.random() * 10 )
//     // positions[i*3 + 2] = ( Math.random() - 0.5 ) * 20
//     positions[i*3 + 0] = 0
//     positions[i*3 + 1] = 0
//     positions[i*3 + 2] = 0
// }

// const particlesGeometry = new THREE.BufferGeometry()
// particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// const particlesMaterial = new THREE.PointsMaterial({
//     size: 1,
//     sizeAttenuation: true,
//     depthWrite: false,
//     // blending: THREE.AdditiveBlending,
//     map: leavesTexture,
//     transparent: true
// })

// const particles = new THREE.Points(particlesGeometry, particlesMaterial)
// scene.add(particles)

// Leaves 
const leavesCount = 2000

const leavesMaterial = new THREE.MeshBasicMaterial({
    map: leavesTexture,
    transparent: true,
    depthWrite: false,
    blending: THREE.SubtractiveBlending,
    side: THREE.DoubleSide
})

const leavesGeometry = new THREE.PlaneGeometry(1,1)

const leavesGroup = new THREE.Group
const leaves = []
let NorP = 1

for (let i = 0; i < leavesCount; i++) {
    const leaf = new THREE.Mesh(leavesGeometry, leavesMaterial)

    NorP = Math.random()
    if (NorP < 0.5) {
        NorP = -1
    }
    else {
        NorP = 1
    }

    NorP * Math.random() * 50
    
    const x = (Math.random() - 0.5)*40
    const z = (400 - x*x)**0.5 * NorP
    const y = (Math.random() - 0.5) * 50

    leaf.position.set(x,y,z)
    leaf.rotation.set(x,y,z)
    leaves[i] = leaf
    scene.add(leaf)
    leavesGroup.add(leaf)
}

scene.add(leavesGroup)

// Mouse
const mouse = new THREE.Vector2()
let cursorY = 0
let adjustFactor = 25

// Scroll
const sectionDistance = 1.5

let scrollX = 0
let scrollY = 0

window.addEventListener('mousemove', (event) =>
{
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1

    // Cursor Follower
    cursorY = event.clientY - 25
    gsap.to('.cursorFollower', {x: event.clientX - adjustFactor, y: event.clientY - adjustFactor})
})

let scrollTimer = null
window.addEventListener('scroll', (e) => {
    isScrolling = true
    scrollY = window.scrollY
    scrollX = window.scrollX
    gsap.to('.cursorFollower', {y: cursorY})
    if(scrollTimer !== null) {
        clearTimeout(scrollTimer)   
    }
    scrollTimer = setTimeout(() => {
        isScrolling = false
    }, 400)
}, false)


// Raycasting Click
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
let scrollDisabled = false

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

gsap.to('.pictureClickDiv', {transform: 'rotateZ(-8deg)'})

let isScrolling = false

document.querySelector('#pm2Click').addEventListener('click', () => {
    if (noClicks == false && isScrolling == false) {
        waveUpAnimation(pm2material)
        if (carouselRemoved == false) {
            removeCarousel(0)
            scrollDisabled = true
        }
        else {
            addCarousel(0)
            setTimeout(() => {
                scrollDisabled = false
            }, 1250)
        }
        noClicks = true
        setTimeout(() => {
            noClicks = false
        }, 1250)
    }
})

document.querySelector('#pm3Click').addEventListener('click', () => {
    if (noClicks == false && isScrolling == false) {
        waveUpAnimation(pm3material)
        if (carouselRemoved == false) {
            removeCarousel(1)
            scrollDisabled = true
        }
        else {
            addCarousel(1)
            setTimeout(() => {
                scrollDisabled = false
            }, 1250)
        }
        noClicks = true
        setTimeout(() => {
            noClicks = false
        }, 1250)
    }
})

document.querySelector('#pm4Click').addEventListener('click', () => {
    if (noClicks == false && isScrolling == false) {
        waveUpAnimation(pm4material)
        if (carouselRemoved == false) {
            removeCarousel(2)
            scrollDisabled = true
        }
        else {
            addCarousel(2)
            setTimeout(() => {
                scrollDisabled = false
            }, 1250)
        }
        noClicks = true
        setTimeout(() => {
            noClicks = false
        }, 1250)
    }
})

document.querySelector('#pm5Click').addEventListener('click', () => {
    if (noClicks == false && isScrolling == false) {
        waveUpAnimation(pm5material)
        if (carouselRemoved == false) {
            removeCarousel(3)
            scrollDisabled = true
        }
        else {
            addCarousel(3)
            setTimeout(() => {
                scrollDisabled = false
            }, 1250)
        }
        noClicks = true
        setTimeout(() => {
            noClicks = false
        }, 1250)
    }
})

document.querySelector('#pm6Click').addEventListener('click', () => {
    if (noClicks == false && isScrolling == false) {
        waveUpAnimation(pm6material)
        if (carouselRemoved == false) {
            removeCarousel(4)
            scrollDisabled = true
        }
        else {
            addCarousel(4)
            setTimeout(() => {
                scrollDisabled = false
            }, 1250)
        }
        noClicks = true
        setTimeout(() => {
            noClicks = false
        }, 1250)
    }
})

document.querySelector('#pm7Click').addEventListener('click', () => {
    if (noClicks == false && isScrolling == false) {
        waveUpAnimation(pm7material)
        if (carouselRemoved == false) {
            removeCarousel(5)
            scrollDisabled = true
        }
        else {
            addCarousel(5)
            setTimeout(() => {
                scrollDisabled = false
            }, 1250)
        }
        noClicks = true
        setTimeout(() => {
            noClicks = false
        }, 1250)
    }
})

document.querySelector('#pm8Click').addEventListener('click', () => {
    if (noClicks == false && isScrolling == false) {
        waveUpAnimation(pm8material)
        if (carouselRemoved == false) {
            removeCarousel(6)
            scrollDisabled = true
        }
        else {
            addCarousel(6)
            setTimeout(() => {
                scrollDisabled = false
            }, 1250)
        }
        noClicks = true
        setTimeout(() => {
            noClicks = false
        }, 1250)
    }
})

document.querySelector('#pm9Click').addEventListener('click', () => {
    if (noClicks == false && isScrolling == false) {
        waveUpAnimation(pm9material)
        if (carouselRemoved == false) {
            removeCarousel(7)
            scrollDisabled = true
        }
        else {
            addCarousel(7)
            setTimeout(() => {
                scrollDisabled = false
            }, 1250)
        }
        noClicks = true
        setTimeout(() => {
            noClicks = false
        }, 1250)
    }
})

// Cursor Animations
let cursorState = 'EYES'
document.querySelectorAll('.pictureClickDiv').forEach((e) => {
    e.addEventListener(('mouseenter'), (f) => {
        adjustFactor = 50
        gsap.to('.cursorFollower', {duration: 0.5, width: '100px', height: '100px'})
        if (cursorState == 'EYES') {
            gsap.to('.eyeIcon', {duration: 0.5, opacity: 1})
        }
        else if (cursorState == 'EXIT') {
            gsap.to('.exitIcon', {duration: 0.5, opacity: 1})
        }
    })
    e.addEventListener(('mouseleave'), () => {
        adjustFactor = 25
        gsap.to('.cursorFollower', {duration: 0.5, width: '50px', height: '50px'})
        gsap.to('.eyeIcon', {duration: 0.5, opacity: 0})
        gsap.to('.exitIcon', {duration: 0.5, opacity: 0})
    })
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let siteState = 'GREETINGS'
let specialAnimations = false

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const parallaxTime = elapsedTime

    // Leaves
    for (let i = 0; i < leaves.length; i++) {
        leaves[i].rotation.z += Math.random()*0.01
        leaves[i].rotation.y += Math.random()*0.01
        leaves[i].rotation.x += Math.random()*0.01
    }

    leavesGroup.rotation.y = elapsedTime * 0.1

    // Site State
    if (scrollY < window.innerHeight) {
        siteState = 'GREETINGS'
    }
    else if  (scrollY >= window.innerHeight && scrollY < window.innerHeight*10) {
        siteState = 'GALLERY'
    }
    else {
        siteState = 'GOODBYE'
    }

    // Camera Model Parallax
    if (siteState == 'GOODBYE' && isScrolling == false && specialAnimations == false) {
        cameraModel.rotation.z += Math.sin(elapsedTime) * 0.001
        cameraModel.rotation.x += Math.cos(elapsedTime) * 0.0005
    }

    // Camera Scroll
    camera.position.y = -scrollY / sizes.height * sectionDistance

    // Update uTime
    pm2material.uniforms.uTime.value = elapsedTime
    pm3material.uniforms.uTime.value = elapsedTime
    pm4material.uniforms.uTime.value = elapsedTime
    pm5material.uniforms.uTime.value = elapsedTime
    pm6material.uniforms.uTime.value = elapsedTime
    pm7material.uniforms.uTime.value = elapsedTime
    pm8material.uniforms.uTime.value = elapsedTime
    pm9material.uniforms.uTime.value = elapsedTime
    PHmaterial.uniforms.uTime.value = elapsedTime
    // seaMaterial.uniforms.uTime.value = elapsedTime

    // Camera Parallax
    const parallaxY = - mouse.y * 0.05 
    cameraGroup.position.y += ( parallaxY - cameraGroup.position.y )

    // Update controls
    if (controls.enabled == true) {
        controls.update()
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    // setTimeout(() => {
    //     window.requestAnimationFrame(tick)
    //   }, 1000 / 500)
    window.requestAnimationFrame(tick)  
}

tick()

// Click Events
window.addEventListener('click', () => {
    if (siteState == 'GOODBYE' && specialAnimations == false) {
        specialAnimations = true
        gsap.fromTo(cameraModel.rotation, {y: cameraModel.rotation.y}, {duration: 1.5, y: cameraModel.rotation.y + Math.PI*2})
        scrollDisabled = true
        setTimeout(() => {
            specialAnimations = false
            scrollDisabled = false
        }, 2000)
    }
})


// Sets
gsap.to(carouselGroup.position, {y: -11.5})
gsap.set('.loadingBar', {transform:'scaleX(0)'})

// Scroll Triggers

gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(ScrollToPlugin)

gsap.to(cameraGroup.rotation , {
    scrollTrigger: {
        trigger: '.sections',
        start: 'top top',
        end: 'bottom bottom',
        snap: 1/7,
        scrub: true,
        // markers: true
    },
    y: - Math.PI*3.5,
    ease: 'none',
})

gsap.to(carouselGroup.position , {
    scrollTrigger: {
        trigger: '.greetingsDiv',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        snap: 1,
    },
    y: -1.5,
    ease: 'none',
})

gsap.fromTo(carouselGroup.position , {y: -1.5}, {
    scrollTrigger: {
        trigger: '.goodbyeDiv',
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: true,
        snap: 1,
        // markers: true
    },
    y: 10,
    ease: 'none',
})

gsap.to(cameraModel.rotation ,{
    scrollTrigger: {
        trigger: '.goodbyeDiv',
        start: 'center bottom',
        end: 'bottom bottom',
        scrub: true,
        snap: 1,
        // markers: true
    },
    y: -Math.PI*0.25,
    z: -Math.PI*0.25,
    x: -Math.PI*0.125,
    ease: 'none',
})

gsap.fromTo(cameraModel.position , {y: -20}, {
    scrollTrigger: {
        trigger: '.goodbyeDiv',
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: true,
        snap: 1,
        // markers: true
    },
    y: -12.5,
    x: -10,
    z: 8.5,
    ease: 'none',
})

gsap.to('#loadingBar1' , {
    scrollTrigger: {
        trigger: '.greetingsDiv',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        snap: 1,
    },
    transform: 'scaleX(1)',
    ease: 'none',
})

gsap.to('#loadingBar2' , {
    scrollTrigger: {
        trigger: '.sections',
        start: 'top top',
        end: '100%',
        snap: 1/8,
        scrub: true,
    },
    transform: 'scaleX(1)',
    ease: 'none',
})

// Nav Site State
const greetingsNav = document.querySelector('#greetingsNav')
greetingsNav.addEventListener('click', () => {
    if (scrollDisabled == false) {
        gsap.to(window, {duration: 2, scrollTo: 0})
        siteState = 'GREETINGS'
    }
})

greetingsNav.addEventListener(('mouseenter'), () => {
    if (scrollDisabled == false) {
        specialAnimations = true
        greetingsNav.style.cursor = 'pointer'
        adjustFactor = 50
        gsap.to('.cursorFollower', {duration: 0.5, width: '100px', height: '100px'})
        gsap.to('.enterIcon', {duration: 0.5, opacity: 1})
    }
    else {
        greetingsNav.style.cursor = 'default'
    }
})
greetingsNav.addEventListener(('mouseleave'), () => {
    if (scrollDisabled == false) {
        specialAnimations = false
        adjustFactor = 25
        gsap.to('.cursorFollower', {duration: 0.5, width: '50px', height: '50px'})
        gsap.to('.enterIcon', {duration: 0.5, opacity: 0})
    }
})

const galleryNav = document.querySelector('#galleryNav')
galleryNav.addEventListener('click', () => {
    if (scrollDisabled == false) {
        gsap.to(window, {duration: 2, scrollTo: window.innerHeight})
        siteState = 'GALLERY'
    }
})

galleryNav.addEventListener(('mouseenter'), () => {
    if (scrollDisabled == false) {
        specialAnimations = true
        galleryNav.style.cursor = 'pointer'
        adjustFactor = 50
        gsap.to('.cursorFollower', {duration: 0.5, width: '100px', height: '100px'})
        gsap.to('.enterIcon', {duration: 0.5, opacity: 1})
    }
    else {
        galleryNav.style.cursor = 'default'
    }
})
galleryNav.addEventListener(('mouseleave'), () => {
    if (scrollDisabled == false) {
        specialAnimations = false
        adjustFactor = 25
        gsap.to('.cursorFollower', {duration: 0.5, width: '50px', height: '50px'})
        gsap.to('.enterIcon', {duration: 0.5, opacity: 0})
    }
})

const goodbyeNav = document.querySelector('#goodbyeNav')
goodbyeNav.addEventListener('click', () => {
    if (scrollDisabled == false) {
        gsap.to(window, {duration: 2, scrollTo: window.innerHeight*9})
        siteState = 'GOODBYE'
    }
})

goodbyeNav.addEventListener(('mouseenter'), () => {
    if (scrollDisabled == false) {
        specialAnimations = true
        goodbyeNav.style.cursor = 'pointer'
        adjustFactor = 50
        gsap.to('.cursorFollower', {duration: 0.5, width: '100px', height: '100px'})
        gsap.to('.enterIcon', {duration: 0.5, opacity: 1})
    }
    else {
        goodbyeNav.style.cursor = 'default'
    }
})
goodbyeNav.addEventListener(('mouseleave'), () => {
    if (scrollDisabled == false) {
        specialAnimations = false
        adjustFactor = 25
        gsap.to('.cursorFollower', {duration: 0.5, width: '50px', height: '50px'})
        gsap.to('.enterIcon', {duration: 0.5, opacity: 0})
    }
})