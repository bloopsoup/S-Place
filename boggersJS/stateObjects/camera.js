import { Vector2 } from '../common/index.js';
import { Movable } from '../components/index.js';

/** Based on the dimensions and the position given by the anchor, this object provides offsets 
 *  for the Canvas context. This results in a camera effect which focuses on the anchor. 
 * 
 *  There are fixed offsets (keep the object in a certain position no matter where it is) and 
 *  hybrid offsets (move the object to certain positions when it passes a certain threshold). 
 *  @memberof StateObjects */
class Camera {
    /** @type {Vector2} */
    #canvasDimensions
    /** @type {Movable} */
    #anchor

    /** Create the Camera.
     *  @param {Vector2} canvasDimensions - The size of the viewport.
     *  @param {Movable} anchor - The tracked Movable. */
    constructor(canvasDimensions, anchor) {
        this.#canvasDimensions = canvasDimensions;
        this.#anchor = anchor;
    }

    /** Gets the horizontal offset used to translate the canvas so that the anchor
     *  is aligned to the left, right or center.
     *  @param {string} mode - The alignment to use which is in {'left', 'right', ''}.
     *  @returns {number} The horizontal offset. */
    horizontalOffset(mode) {
        switch (mode) {
            case 'left': return -this.#anchor.pos.x;
            case 'right': return this.#canvasDimensions.x - this.#anchor.dimensions.x - this.#anchor.pos.x;
            default: return ((this.#canvasDimensions.x - this.#anchor.dimensions.x) / 2) - this.#anchor.pos.x;
        }
    }

    /** Gets the horizontal offset used to translate the canvas so that the anchor is aligned
     *  to the left, right, AND center DEPENDING on where the anchor is. Here's how the offset
     *  operates in relation to the horizontalBoundary and the map boundaries.
     * 
     *  | ALIGN LEFT ----------> | ----- ALIGN CENTER ----- | -----------------> ALIGN RIGHT |
     *  | (0, y)       horizontalBoundary[0]       horizontalBoundary[1]           (maxX, y) |
     * 
     *  @param {Array<number>} boundary - The horizontal thresholds.
     *  @returns {number} The horizontal offset. */
    boundedHorizontalOffset(boundary) {
        const centerOffset = (this.#canvasDimensions.x - this.#anchor.dimensions.x) / 2;
        if (this.#anchor.pos.x < boundary[0]) {
            const difference = centerOffset / boundary[0] * this.#anchor.pos.x;
            return Math.min(this.horizontalOffset('left') + difference, this.horizontalOffset(''));
        } else if (this.#anchor.pos.x > boundary[1]) {
            const difference = centerOffset / (this.#anchor.maxDimensions.x - this.#anchor.dimensions.x - boundary[1]) * (this.#anchor.pos.x - boundary[1]);
            return Math.min(this.horizontalOffset('') + difference, this.horizontalOffset('right'));
        } 
        return this.horizontalOffset('');
    }

    /** Gets the vertical offset used to translate the canvas so that the anchor
     *  is aligned to the up, down, or center.
     *  @param {string} mode - The alignment to use which is in {'up', 'down', ''}.
     *  @returns {number} The horizontal offset. */
    verticalOffset(mode) {
        switch (mode) {
            case 'up': return -this.#anchor.pos.y;
            case 'down': return this.#canvasDimensions.y - this.#anchor.dimensions.y - this.#anchor.pos.y;
            default: return ((this.#canvasDimensions.y - this.#anchor.dimensions.y) / 2) - this.#anchor.pos.y;
        }
    }

    /** Gets the vertical offset used to translate the canvas so that the anchor is aligned
     *  to the top, bottom, AND center DEPENDING on where the anchor is. Here's how the offset
     *  operates in relation to the verticalBoundary and the map boundaries.
     *  @param {Array<number>} boundary - The vertical thresholds.
     *  @returns {number} The vertical offset. */
    boundedVerticalOffset(boundary) {
        const centerOffset = (this.#canvasDimensions.y - this.#anchor.dimensions.y) / 2;
        if (this.#anchor.pos.y < boundary[0]) {
            const difference = centerOffset / boundary[0] * this.#anchor.pos.y;
            return Math.min(this.verticalOffset('up') + difference, this.verticalOffset(''));
        } else if (this.#anchor.pos.y > boundary[1]) {
            const difference = centerOffset / (this.#anchor.maxDimensions.y - this.#anchor.dimensions.y - boundary[1]) * (this.#anchor.pos.y - boundary[1]);
            return Math.min(this.verticalOffset('') + difference, this.verticalOffset('down'));
        }
        return this.verticalOffset('');
    }

    /** Gets the cardinal offset.
     *  @param {string} horizontalMode - The horizontal alignment to use which is in {'left', 'right', ''}. 
     *  @param {string} verticalMode - The vertical alignment to use which is in {'up', 'down', ''}.
     *  @returns {Vector2} The cardinal offset. */
    getCardinalOffset(horizontalMode, verticalMode) {
        return new Vector2(Math.floor(this.horizontalOffset(horizontalMode)), Math.floor(this.verticalOffset(verticalMode)));
    }

    /** Gets the hybrid offset.
     *  @param {Array<number>} horizontalBoundary - The horizontal boundaries which are [LEFT, RIGHT].
     *  @param {Array<number>} verticalBoundary - The vertical boundaries which are [TOP, BOTTOM].
     *  @returns {Vector2} The hybrid offset. */
    getHybridOffset(horizontalBoundary, verticalBoundary) {
        return new Vector2(Math.floor(this.boundedHorizontalOffset(horizontalBoundary)), Math.floor(this.boundedVerticalOffset(verticalBoundary)));
    }
}

export default Camera;
