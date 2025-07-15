// This class represents a 3D pyramid with a square base
import {RenderObject} from "./RenderObject.js";
import {Vector3} from "../Vector3.js";

export class Pyramid extends RenderObject {
    getCorners() {
        const hx = this.scale.x / 2;
        const hy = this.scale.y / 2;
        const hz = this.scale.z / 2;
        const cx = this.position.x;
        const cy = this.position.y;
        const cz = this.position.z;
        // 4 base corners (square base, on +hz)
        const base = [
            new Vector3(cx - hx, cy - hy, cz + hz),
            new Vector3(cx + hx, cy - hy, cz + hz),
            new Vector3(cx + hx, cy + hy, cz + hz),
            new Vector3(cx - hx, cy + hy, cz + hz)
        ];
        // Apex (centered below base)
        const apex = new Vector3(cx, cy, cz - hz);
        return [...base, apex];
    }

    static getEdgeIndices() {
        // 0-1-2-3-0 base, 4 is apex
        return [
            [0,1],[1,2],[2,3],[3,0], // base edges
            [0,4],[1,4],[2,4],[3,4]  // sides to apex
        ];
    }
}