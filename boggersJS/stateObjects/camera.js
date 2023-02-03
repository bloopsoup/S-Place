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

    /** Gets the horizontal offset used to translate the canvas so that the camera is focused on
     *  the left of the screen, the right of the screen, or centered on the anchor. Transitions
     *  from the sides to centering occur when the anchor moves to the center of the screen.
     *  @returns {number} The horizontal offset. */
    boundedHorizontalOffset() {
        const centerOffset = (this.#canvasDimensions.x - this.#anchor.dimensions.x) / 2;
        if (this.#anchor.pos.x < centerOffset) 
            return 0; 
        else if (this.#anchor.pos.x > this.#anchor.maxDimensions.x - this.#canvasDimensions.x + centerOffset)
            return this.#canvasDimensions.x - this.#anchor.maxDimensions.x;
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

    /** Gets the vertical offset used to translate the canvas so that the camera is focused on
     *  the top of the screen, the bottom of the screen, or centered on the anchor. Transitions
     *  from the sides to centering occur when the anchor moves to the center of the screen.
     *  @returns {number} The vertical offset. */
    boundedVerticalOffset() {
        const centerOffset = (this.#canvasDimensions.y - this.#anchor.dimensions.y) / 2;
        if (this.#anchor.pos.y < centerOffset)
            return 0;
        else if (this.#anchor.pos.y > this.#anchor.maxDimensions.y - this.#canvasDimensions.y + centerOffset)
            return this.#canvasDimensions.y - this.#anchor.maxDimensions.y;
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
     *  @returns {Vector2} The hybrid offset. */
    getHybridOffset() {
        return new Vector2(Math.floor(this.boundedHorizontalOffset()), Math.floor(this.boundedVerticalOffset()));
    }
}

export default Camera;
