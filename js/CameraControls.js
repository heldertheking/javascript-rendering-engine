// CameraControls.js
export class CameraControls {
    constructor(canvas, x = 0, y = 0) {
        this.canvas = canvas;
        this.angleX = x;
        this.angleY = y;
        this.isRMB = false;
        this.lastMouse = { x: 0, y: 0 };

        this._addEventListeners();
    }

    _addEventListeners() {
        this.canvas.addEventListener("mousedown", (e) => {
            if (e.button === 2) {
                this.isRMB = true;
                this.lastMouse.x = e.clientX;
                this.lastMouse.y = e.clientY;
            } else if (e.button === 0) {
                console.log("Left click at", e.clientX, e.clientY);
            }
        });

        this.canvas.addEventListener("mousemove", (e) => {
            if (this.isRMB) {
                const dx = e.clientX - this.lastMouse.x;
                const dy = e.clientY - this.lastMouse.y;

                this.angleY -= dx * 0.5;
                this.angleX += dy * 0.5;
                // this.angleX = Math.max(-90, Math.min(90, this.angleX));

                this.lastMouse.x = e.clientX;
                this.lastMouse.y = e.clientY;
            }
        });

        this.canvas.addEventListener("mouseup", (e) => {
            if (e.button === 2) {
                this.isRMB = false;
            }
        });

        this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    }

    getAngles() {
        return { x: this.angleX, y: this.angleY };
    }
}
