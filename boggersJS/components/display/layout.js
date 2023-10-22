import Label from './label.js';
import Sprite from './sprite.js';
import { Vector2 } from '../../common/index.js';

/** An arrangement of slots that can fit Sprite and Label components.
 *  Provides auto-centering for placing sprites and auto-dimensions for
 *  placing labels. Should ONLY be used for creating more complex UI objects.
 *  @memberof Components.Display */
class Layout {
    /** @type {Object<string, Label>} */
    #labels
    /** @type {Object<string, Sprite>} */
    #sprites
    /** @type {Object<string, Vector2>} */
    #offsets

    /** Create the layout.
     *  @param {Object<string, Label>} labels - A dictionary of labels.
     *  @param {Object<string, Sprite>} sprites - A dictionary of sprites.
     *  @param {Object<string, Vector2>} offsets - A mapping between names and offsets to use when placing 
     *      each element relative to the layout. For names that don't have positions, the default offset 
     *      will be (0, 0). If a label and sprite share the same name, they'll use the same offset. */
    constructor(labels, sprites, offsets = {}) {
        this.#labels = labels;
        this.#sprites = sprites;
        this.#offsets = {};
        Object.keys(offsets).forEach(name => this.#offsets[name] = offsets[name]);
        Object.keys(labels).forEach(name => { if (!(name in this.#offsets)) this.#offsets[name] = new Vector2(0, 0); });
        Object.keys(sprites).forEach(name => { if (!(name in this.#offsets)) this.#offsets[name] = new Vector2(0, 0); });
    }

    /** Gets a label from the layout. This is the primary way to change a label's text.
     *  @param {string} name - The name of the label to retrieve. 
     *  @returns {Label} The label. */
    getLabel(name) { return this.#labels[name]; }

    /** Gets a sprite from the layout. This is the primary way to change frames.
     * @param {string} name - The name of the sprite to retrieve.
     * @returns {Sprite} The sprite. */
    getSprite(name) { return this.#sprites[name]; }

    /** Draw the layout's elements.
     *  @param {CanvasRenderingContext2D} context - The context to draw on.
     *  @param {Vector2} pos - The anchor position that all elements will be drawn. */
    draw(context, pos) {
        Object.keys(this.#labels).forEach(name => this.#labels[name].draw(context, pos.addCopy(this.#offsets[name])));
        Object.keys(this.#sprites).forEach(name => this.#labels[name].draw(context, pos.addCopy(this.#offsets[name]))); 
    }
}

export default Layout;
