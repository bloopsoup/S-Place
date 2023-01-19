import Vector2 from '../common/vector2.js';

export default class Camera {
    /** Based on the dimensions and the position given by the anchor (which is a Movable object), 
     *  this object provides offsets for the Canvas context. This results in a camera effect which 
     *  focuses on the anchor. */

    #canvasDimensions
    #anchor

    constructor(canvasDimensions, anchor) {
        this.#canvasDimensions = canvasDimensions;
        this.#anchor = anchor;
    }

    horizontalOffset(mode) {
        switch (mode) {
            case 'left': return -this.#anchor.pos.x;
            case 'right': return this.#canvasDimensions.x - this.#anchor.dimensions.x - this.#anchor.pos.x;
            default: return ((this.#canvasDimensions.x - this.#anchor.dimensions.x) / 2) - this.#anchor.pos.x;
        }
    }
    verticalOffset(mode) {
        switch (mode) {
            case 'up': return -this.#anchor.pos.y;
            case 'down': return this.#canvasDimensions.y - this.#anchor.dimensions.y - this.#anchor.pos.y;
            default: return ((this.#canvasDimensions.y - this.#anchor.dimensions.y) / 2) - this.#anchor.pos.y;
        }
    }
    getCardinalOffset(horizontalMode, verticalMode) {
        return new Vector2(this.horizontalOffset(horizontalMode), this.verticalOffset(verticalMode));
    }

    getHybridOffset(horizontalBoundary, verticalBoundary) {
        const centerOffset = (this.#canvasDimensions.x - this.#anchor.dimensions.x) / 2;
        const leftDifference = centerOffset / (horizontalBoundary[0] - this.#anchor.maxDimensions.x) * this.#anchor.pos.x;
        const rightDifference = centerOffset / (horizontalBoundary[1]) * Math.max(0, this.#anchor.pos.x - 2500);

        const leftOffset = Math.min(this.horizontalOffset('left') + leftDifference, this.horizontalOffset(''));
        const offset = Math.min(leftOffset + rightDifference, this.horizontalOffset('right'));
        return new Vector2(offset, this.verticalOffset('down'));
    }
}
