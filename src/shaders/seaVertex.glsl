uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 rotationMatrix;
uniform float uFrequency;
uniform float uTime;
uniform float uOscillationFrequency;
uniform float uAmplitude;
uniform float uRotationX;
uniform float uRotationZ;

attribute vec3 position;
attribute float aRandom;
attribute vec2 uv;
attribute float aCurvature;
attribute float aSkew;

varying float vRandom;
varying float vElevation;
varying vec2 vUv;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
    
    vUv = uv;
}