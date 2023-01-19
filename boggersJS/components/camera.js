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
    boundedHorizontalOffset(horizontalBoundary) {
        const centerOffset = (this.#canvasDimensions.x - this.#anchor.dimensions.x) / 2;
        if (this.#anchor.pos.x < horizontalBoundary[0]) {
            const difference = centerOffset / (horizontalBoundary[0]) * this.#anchor.pos.x;
            return Math.min(this.horizontalOffset('left') + difference, this.horizontalOffset(''));
        } else if (this.#anchor.pos.x > horizontalBoundary[1]) {
            const difference = centerOffset / (this.#anchor.maxDimensions.x - this.#anchor.dimensions.x - horizontalBoundary[1]) * (this.#anchor.pos.x - horizontalBoundary[1]);
            return Math.min(this.horizontalOffset('') + difference, this.horizontalOffset('right'));
        } 
        return this.horizontalOffset('');
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
        return new Vector2(this.boundedHorizontalOffset(horizontalBoundary), this.verticalOffset('down'));
    }
}
