import Label from './label.js';
import Sprite from './sprite.js';
import { Vector2 } from "../../common/index.js";

/** A slot for a layout. Provides auto-centering for placing sprites
 *  and labels.
 *  @memberof Components.Display */
class LayoutSlot {
    /** @type {Vector2} */
    #offset
    /** @type {Vector2} */
    #dimensions
    /** @type {Label | null} */
    #label
    /** @type {Sprite | null} */
    #sprite

    /** Create the layout slot.
     *  @param {Vector2} offset - The offset of the slot relative to a drawing position.
     *  @param {Vector2} dimensions - The dimensions of the slot. */
    constructor(offset, dimensions) {
        this.#offset = offset;
        this.#dimensions = dimensions;
        this.#label = null;
        this.#sprite = null;
    }

    /** Inserts a Label element into the slot.
     *  Does nothing if the label is too large.
     *  @param {Label | null} label - The label. */
    set label(label) { 
        if (label !== null && label.dimensions.anyGreaterThan(this.#dimensions)) return;
        this.#label = label; 
    }

    /** Inserts a Sprite element into the slot.
     *  Does nothing if the sprite is too large.
     *  @param {Sprite | null} sprite - The sprite. */
    set sprite(sprite) {
        if (sprite !== null && sprite.dimensions.anyGreaterThan(this.#dimensions)) return;
        this.#sprite = sprite; 
    }

    /** Finds the offset used to center an element in a slot. 
     *  @param {Vector2} elementDimensions - The dimensions of the element. 
     *      Usually smaller than the slot's dimensions.
     *  @returns {Vector2} The center offset. */
    #findCenterOffset(elementDimensions) {
        return this.#dimensions.subCopy(elementDimensions).floorDivScalar(2);
    }

    /** Draw the elements at the slot at a position.
     *  @param {CanvasRenderingContext2D} context - The context to draw on.
     *  @param {Vector2} pos - The position to draw the element. */
    draw(context, pos) {
        if (this.#sprite != null) this.#sprite.draw(context, pos.addCopy(this.#offset).add(this.#findCenterOffset(this.#sprite.dimensions)));
        if (this.#label != null) this.#label.draw(context, pos.addCopy(this.#offset).add(this.#findCenterOffset(this.#label.dimensions)));
    }
}

export default LayoutSlot;
