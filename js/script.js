import { Cube } from "./RenderObjects/Cube.js";
import { Pyramid } from "./RenderObjects/Pyramid.js";
import { Sphere } from "./RenderObjects/Sphere.js";
import { Vector3 } from "./Vector3.js";
import { createProgram } from "./shader.js";
import { CameraControls } from "./CameraControls.js";

// Get canvas and WebGL context
const canvas = document.getElementById("glcanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const gl = canvas.getContext("webgl");
if (!gl) {
    alert("WebGL not supported");
    throw new Error("WebGL not supported");
}

// Simple vertex and fragment shaders for drawing points
const vertexShaderSource = `
attribute vec3 aPosition;
uniform mat4 uProjection;
void main() {
    gl_Position = uProjection * vec4(aPosition, 1.0);
    gl_PointSize = 10.0;
}`;

const fragmentShaderSource = `
precision mediump float;
void main() {
    gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0); // orange
}`;

// Create shader program
const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

// Create one of each shape, positioned next to each other
const spacing = 3;
const shapes = [
    new Cube(new Vector3(0, 0, 0), 0, new Vector3(2, 2, 2))
//     new Pyramid(new Vector3(0, 0, 0), 0, new Vector3(2, 2, 2)),
//     new Sphere(new Vector3(spacing, 0, 0), 1, new Vector3(1, 1, 1), 24)
];

// Set draw mode (lines)
const drawMode = gl.LINES;

// Helper to get edge indices for any shape
function getShapeEdgeIndices(shape) {
    if (shape instanceof Sphere) {
        return Sphere.getEdgeIndices(shape.segments);
    }
    return shape.constructor.getEdgeIndices();
}

// --- Removed camera controls code ---

function degToRad(deg) { return deg * Math.PI / 180; }

function getRotationMatrix(angleX, angleY, angleZ) {
    const cx = Math.cos(angleX), sx = Math.sin(angleX);
    const cy = Math.cos(angleY), sy = Math.sin(angleY);
    const cz = Math.cos(angleZ), sz = Math.sin(angleZ);
    // Z rotation
    const rotZ = [
        cz, -sz, 0,
        sz, cz, 0,
        0, 0, 1
    ];
    // X rotation
    const rotX = [
        1, 0, 0,
        0, cx, -sx,
        0, sx, cx
    ];
    // Y rotation
    const rotY = [
        cy, 0, sy,
        0, 1, 0,
        -sy, 0, cy
    ];
    // Multiply rotY * rotX * rotZ (3x3)
    let m = rotZ;
    m = multiplyMat3(rotX, m);
    m = multiplyMat3(rotY, m);
    return m;
}

function multiplyMat3(a, b) {
    // Multiplies two 3x3 matrices
    const m = [];
    for (let r = 0; r < 3; ++r) {
        for (let c = 0; c < 3; ++c) {
            m[3*r+c] = 0;
            for (let k = 0; k < 3; ++k) {
                m[3*r+c] += a[3*r+k] * b[3*k+c];
            }
        }
    }
    return m;
}

function applyMat3(v, m) {
    return [
        v[0]*m[0] + v[1]*m[1] + v[2]*m[2],
        v[0]*m[3] + v[1]*m[4] + v[2]*m[5],
        v[0]*m[6] + v[1]*m[7] + v[2]*m[8]
    ];
}

// Create buffer (must be in scope for drawScene)
const positionBuffer = gl.createBuffer();

// Orthographic projection helper
function ortho(left, right, bottom, top, near, far) {
    const rl = right - left;
    const tb = top - bottom;
    const fn = far - near;
    return new Float32Array([
        2 / rl, 0, 0, 0,
        0, 2 / tb, 0, 0,
        0, 0, -2 / fn, 0,
        -(right + left) / rl, -(top + bottom) / tb, -(far + near) / fn, 1
    ]);
}

function lookAt(eye, target, up) {
    // Returns a 4x4 view matrix (column-major)
    const z = eye.subtract(target).normalize(); // forward
    const x = up.cross(z).normalize(); // right
    const y = z.cross(x).normalize(); // up
    return new Float32Array([
        x.x, y.x, z.x, 0,
        x.y, y.y, z.y, 0,
        x.z, y.z, z.z, 0,
        -x.dot(eye), -y.dot(eye), -z.dot(eye), 1
    ]);
}

const cameraControls = new CameraControls(canvas, new Vector3(0, 0, 0));

function drawScene() {
    // Get camera transform (position, target, up, zoom)
    const cam = cameraControls.getCameraTransform();
    const view = lookAt(cam.position, cam.target, cam.up);
    let allVerts = [];
    for (const shape of shapes) {
        const corners = shape.getCorners();
        const edgeIndices = getShapeEdgeIndices(shape);
        for (const [i, j] of edgeIndices) {
            let v0 = corners[i];
            let v1 = corners[j];
            // Transform to camera space
            v0 = applyMat4(v0, view);
            v1 = applyMat4(v1, view);
            allVerts.push(...v0, ...v1);
        }
    }
    const bufferData = new Float32Array(allVerts);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
    // Set up vertex attribute pointer for aPosition
    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
    // Set projection matrix uniform every frame
    const aspect = canvas.width / canvas.height;
    const baseOrthoSize = 2;
    const orthoSize = baseOrthoSize * cam.zoom;
    const proj = ortho(-orthoSize * aspect, orthoSize * aspect, -orthoSize, orthoSize, -10, 10);
    const uProjection = gl.getUniformLocation(program, "uProjection");
    gl.uniformMatrix4fv(uProjection, false, proj);
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(drawMode, 0, bufferData.length / 3);
}

function applyMat4(v, m) {
    // v: Vector3, m: Float32Array(16)
    const x = v.x, y = v.y, z = v.z;
    return [
        m[0]*x + m[4]*y + m[8]*z + m[12],
        m[1]*x + m[5]*y + m[9]*z + m[13],
        m[2]*x + m[6]*y + m[10]*z + m[14]
    ];
}

function animate() {
    drawScene();
    requestAnimationFrame(animate);
}

// Start animation loop
animate();
