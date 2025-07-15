import { Vector3 } from "./Vector3.js";

// CameraControls.js
export class CameraControls {
    constructor(canvas, target = new Vector3(0, 0, 0), distance = 8) {
        this.canvas = canvas;
        this.target = target;
        this.distance = distance;
        this.angles = new Vector3(20, -30, 0); // pitch, yaw, roll (degrees)
        this.isRMB = false;
        this.isMMB = false;
        this.lastMouse = { x: 0, y: 0 };
        this.zoom = 1; // For orthographic zoom
        this._addEventListeners();
    }

    _addEventListeners() {
        this.canvas.addEventListener("mousedown", (e) => {
            if (e.button === 2) {
                this.isRMB = true;
            } else if (e.button === 1) {
                this.isMMB = true;
            }
            this.lastMouse.x = e.clientX;
            this.lastMouse.y = e.clientY;
        });

        this.canvas.addEventListener("mousemove", (e) => {
            const dx = e.clientX - this.lastMouse.x;
            const dy = e.clientY - this.lastMouse.y;
            if (this.isRMB) {
                // Orbit: yaw and pitch
                this.angles.y -= dx * 0.4;
                this.angles.x -= dy * 0.4;
                this.angles.x = Math.max(-89, Math.min(89, this.angles.x));
            } else if (this.isMMB) {
                // Pan: move target in view plane
                const panSpeed = this.distance * 0.002;
                // Calculate right and up vectors
                const yawRad = this.angles.y * Math.PI / 180;
                const up = new Vector3(0, 1, 0);
                const right = new Vector3(Math.cos(yawRad), 0, -Math.sin(yawRad));
                this.target = this.target
                    .add(right.scale(-dx * panSpeed))
                    .add(up.scale(dy * panSpeed));
            }
            this.lastMouse.x = e.clientX;
            this.lastMouse.y = e.clientY;
        });

        this.canvas.addEventListener("mouseup", (e) => {
            if (e.button === 2) this.isRMB = false;
            if (e.button === 1) this.isMMB = false;
        });

        this.canvas.addEventListener("wheel", (e) => {
            // Ortho Zoom (scale view)
            this.zoom *= 1 + e.deltaY * 0.1;
            this.zoom = Math.max(0.1, Math.min(10, this.zoom));
        });

        this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    }

    getCameraTransform() {
        // Returns {position: Vector3, target: Vector3, up: Vector3}
        const pitch = this.angles.x * Math.PI / 180;
        const yaw = this.angles.y * Math.PI / 180;
        const x = this.target.x + this.distance * Math.cos(pitch) * Math.sin(yaw);
        const y = this.target.y + this.distance * Math.sin(pitch);
        const z = this.target.z + this.distance * Math.cos(pitch) * Math.cos(yaw);
        return {
            position: new Vector3(x, y, z),
            target: this.target,
            up: new Vector3(0, 1, 0),
            zoom: this.zoom
        };
    }
}
