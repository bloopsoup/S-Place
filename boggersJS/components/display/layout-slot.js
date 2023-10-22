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

    constructor(offset, dimensions) {
        this.#offset = offset;
        this.#dimensions = dimensions;
        this.#label = null;
        this.#sprite = null;
    }

    /** Inserts a Label element into the slot.
     *  @param {Label} label - The label. */
    set label(label) { this.#label = label; }

    /** Inserts a Sprite element into the slot.
     *  @param {Sprite} sprite - The sprite. */
    set sprite(sprite) { this.#sprite = sprite; }

    /** Draw the elements at the slot at a position.
     *  @param {CanvasRenderingContext2D} context - The context to draw on.
     *  @param {Vector2} pos - The position to draw the element. */
    draw(context, pos) {
        if (this.#label != null) this.#label.draw(context, pos.addCopy(this.#offset));
    }
}

export default LayoutSlot;
