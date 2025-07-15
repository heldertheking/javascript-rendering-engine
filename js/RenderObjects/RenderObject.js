import { Vector3 } from "../Vector3.js";

export class RenderObject {
    constructor(position, radius = 0.0, scale = new Vector3(1, 1, 1)) {
        this.position = position; // Position in 3D space
        this.radius = radius;
        this.scale = scale;
        this.color = [1.0, 1.0, 1.0, 1.0]; // Default color (white)
    }

    // Returns the position as a Float32Array
    getPositionArray() {
        return new Float32Array([this.position.x, this.position.y, this.position.z]);
    }

    // Returns the scale as a Float32Array
    getScaleArray() {
        return new Float32Array([this.scale.x, this.scale.y, this.scale.z]);
    }

    // Returns the color as a Float32Array
    getColorArray() {
        return new Float32Array(this.color);
    }

    // Placeholder: Should be implemented by subclasses
    getCorners() {
        throw new Error("getCorners() not implemented");
    }

    // Placeholder: Should be implemented by subclasses
    static getEdgeIndices() {
        throw new Error("getEdgeIndices() not implemented");
    }
}