export class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    static fromArray(arr) {
        return new Vector3(arr[0], arr[1], arr[2]);
    }
    toArray() {
        return [this.x, this.y, this.z];
    }
    clone() {
        return new Vector3(this.x, this.y, this.z);
    }
    add(v) {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }
    subtract(v) {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }
    scale(s) {
        return new Vector3(this.x * s, this.y * s, this.z * s);
    }
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    cross(v) {
        return new Vector3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    normalize() {
        const len = this.length();
        return len > 0 ? this.scale(1 / len) : new Vector3(0, 0, 0);
    }
}