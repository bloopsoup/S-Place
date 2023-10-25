import Label from './label.js';
import LayoutSlot from './layout-slot.js';
import Sprite from './sprite.js';
import { Vector2 } from '../../common/index.js';

/** An arrangement of slots that can fit Sprite and Label components.
 *  Should ONLY be used for creating more complex UI objects.
 *  @memberof Components.Display */
class Layout {
    /** @type {Object<string, LayoutSlot>} */
    #slots

    /** Create the layout.
     *  @param {Object<string, LayoutSlot>} slots - A mapping between names and layout slots. */
    constructor(slots) { this.#slots = slots; }

    /** Adds a label to a layout slot.
     *  @param {string} name - The name of the slot to add to. 
     *  @param {Label} label - The label to add. */
    addLabel(name, label) { this.#slots[name].label = label; }

    /** Adds a sprite to a layout slot.
     *  @param {string} name - The name of the slot to add to.
     *  @param {Sprite} sprite - The sprite to add. */
    addSprite(name, sprite) { this.#slots[name].sprite = sprite; }

    /** Draw the layout's elements.
     *  @param {CanvasRenderingContext2D} context - The context to draw on.
     *  @param {Vector2} pos - The anchor position that all elements will be drawn. */
    draw(context, pos) {
        Object.keys(this.#slots).forEach(name => this.#slots[name].draw(context, pos));
    }
}

export default Layout;
