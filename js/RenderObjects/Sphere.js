import { RenderObject } from "./RenderObject.js";
import { Vector3 } from "../Vector3.js";

// This class represents a 3D circle (wireframe sphere in XY plane)
export class Sphere extends RenderObject {
    constructor(position, radius = 1.0, scale = new Vector3(1, 1, 1), latSegments = 12, lonSegments = 24) {
        super(position, radius, scale);
        this.latSegments = latSegments;
        this.lonSegments = lonSegments;
    }

    getCorners() {
        const corners = [];
        const cx = this.position.x;
        const cy = this.position.y;
        const cz = this.position.z;
        const rx = this.radius * this.scale.x;
        const ry = this.radius * this.scale.y;
        const rz = this.radius * this.scale.z;

        // Top pole
        corners.push(new Vector3(cx, cy, cz + rz));

        // Latitude rings (excluding poles)
        for (let lat = 1; lat < this.latSegments; ++lat) {
            const theta = lat * Math.PI / this.latSegments;
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);
            for (let lon = 0; lon < this.lonSegments; ++lon) {
                const phi = lon * 2 * Math.PI / this.lonSegments;
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);
                const x = cx + rx * sinTheta * cosPhi;
                const y = cy + ry * sinTheta * sinPhi;
                const z = cz + rz * cosTheta;
                corners.push(new Vector3(x, y, z));
            }
        }

        // Bottom pole
        corners.push(new Vector3(cx, cy, cz - rz));

        return corners;
    }

    static getEdgeIndices(latSegments = 12, lonSegments = 24) {
        const indices = [];
        const poleTop = 0;
        const poleBottom = (latSegments - 1) * lonSegments + 1;

        // Top cap: connect top pole to first ring
        for (let lon = 0; lon < lonSegments; ++lon) {
            const ringIdx = 1 + lon;
            indices.push([poleTop, ringIdx]);
        }

        // Latitude rings and longitude lines
        for (let lat = 0; lat < latSegments - 1; ++lat) {
            const ringStart = 1 + lat * lonSegments;
            const nextRingStart = ringStart + lonSegments;
            for (let lon = 0; lon < lonSegments; ++lon) {
                const curr = ringStart + lon;
                const next = ringStart + (lon + 1) % lonSegments;

                // Horizontal (latitude) lines
                indices.push([curr, next]);

                // Vertical (longitude) lines (connect to next ring or bottom pole)
                if (lat < latSegments - 2) {
                    const below = nextRingStart + lon;
                    indices.push([curr, below]);
                } else {
                    indices.push([curr, poleBottom]);
                }
            }
        }

        // Bottom cap: connect last ring horizontally (already connected vertically above)
        const lastRingStart = 1 + (latSegments - 2) * lonSegments;
        for (let lon = 0; lon < lonSegments; ++lon) {
            const curr = lastRingStart + lon;
            const next = lastRingStart + (lon + 1) % lonSegments;
            indices.push([curr, next]);
        }

        return indices;
    }
}
