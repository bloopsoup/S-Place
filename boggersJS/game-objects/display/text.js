import GameObject from '../game-object.js';
import { Vector2 } from '../../common/index.js';
import { Label } from '../../components/index.js';

/** Displayed text. 
 *  @augments GameObject
 *  @memberof GameObjects.Display */
class Text extends GameObject {
    /** @type {Vector2} */
    #pos

    /** Create the text.
     *  @param {Vector2} pos - The position of the text.
     *  @param {string} font - The font of the display text.
     *  @param {string} text - The text itself. */
    constructor(pos, font, text) {
        super();
        this.label = new Label(text, new Vector2(0, 0), new Vector2(0, 0), font);
        this.#pos = pos; 
    }

    /** Draw the object.
     *  @see GameObject.draw
     *  @param {CanvasRenderingContext2D} context
     *  @param {number} alpha */
    draw(context, alpha) { this.label.draw(context, this.#pos); }
}

export default Text;
