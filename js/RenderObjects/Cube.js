import { RenderObject } from "./RenderObject.js";
import { Vector3 } from "../Vector3.js";

export class Cube extends RenderObject {
    getCorners() {
        const hx = this.scale.x / 2;
        const hy = this.scale.y / 2;
        const hz = this.scale.z / 2;
        const cx = this.position.x;
        const cy = this.position.y;
        const cz = this.position.z;
        return [
            new Vector3(cx - hx, cy - hy, cz - hz),
            new Vector3(cx + hx, cy - hy, cz - hz),
            new Vector3(cx + hx, cy + hy, cz - hz),
            new Vector3(cx - hx, cy + hy, cz - hz),
            new Vector3(cx - hx, cy - hy, cz + hz),
            new Vector3(cx + hx, cy - hy, cz + hz),
            new Vector3(cx + hx, cy + hy, cz + hz),
            new Vector3(cx - hx, cy + hy, cz + hz)
        ];
    }

    static getEdgeIndices() {
        return [
            [0,1],[1,2],[2,3],[3,0], // bottom face
            [4,5],[5,6],[6,7],[7,4], // top face
            [0,4],[1,5],[2,6],[3,7]  // vertical edges
        ];
    }
}

