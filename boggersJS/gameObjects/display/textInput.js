import GameObject from '../gameObject.js';
import { Movable, Collider, Sprite } from '../../components/index.js';
import { InputTracker, Vector2 } from '../../common/index.js';

/** A textbox which displays user input text.
 *  @augments GameObject 
 *  @memberof GameObjects.Display */
class TextInput extends GameObject {
    /** @type {number} */
    #maxLength
    /** @type {string} */
    #font
    /** @type {CallableFunction} */
    #func
    /** @type {string} */
    #text
    /** @type {Array<Vector2>} */
    #frames = [new Vector2(0, 0), new Vector2(1, 0)];
    /** @type {boolean} */
    #isActive

    /** Create the text input.
     *  @param {Sprite} sprite - The sprites of the text input. Spritesheet should have one row of
     *      two images: [INACTIVE, ACTIVE].
     *  @param {Vector2} pos - The position of the text input.
     *  @param {number} maxLength - The max length of the text input.
     *  @param {string} font - The font of the text input.
     *  @param {CallableFunction} func - The function that is called when the text input is submitted. */
    constructor(sprite, pos, maxLength, font, func) {
        super(sprite);
        this.movable = new Movable(new Vector2(0, 0), this.sprite.dimensions, pos, new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0));
        this.collider = new Collider(0);

        this.#maxLength = maxLength;
        this.#font = font;
        this.#func = func;
        this.#text = '';
        this.#isActive = false;
    }

    /** Calls the function with the input text as an argument and then clears itself. */
    submitText() {
        this.#func(this.#text);
        this.#text = '';
        this.#isActive = false;
    }

    /** Handle inputs.
     *  @see GameObject.handleInputs
     *  @param {InputTracker} inputs */
    handleInputs(inputs) {
        if (inputs.has('MouseHold')) {
            if (this.collider.pointOverlaps(this.movable, inputs.get('MouseHold').pos)) this.#isActive = true;
            else this.#isActive = false;
        }
        if (this.#isActive) {
            if (inputs.consumeInput('Enter')) this.submitText();
            if (inputs.consumeInput('Backspace')) this.#text = this.#text.slice(0, -1);
            if (this.#text.length < this.#maxLength) {
                const char = inputs.consumePrintableInput();
                if (char) this.#text += char;
            }
        }   
    }

    /** Draw the object.
     *  @see GameObject.draw
     *  @param {CanvasRenderingContext2D} context */
    draw(context){
        context.save();
        this.sprite.drawFrame(context, this.movable.pos, !this.#isActive ? this.#frames[0] : this.#frames[1]);
        context.font = this.#font;
        context.fillText(this.#text, this.movable.pos.x, this.movable.pos.y + this.movable.dimensions.y);
        context.restore();
    }
}

export default TextInput;
