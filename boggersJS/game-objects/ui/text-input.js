import GameObject from '../game-object.js';
import { Movable, Collider, Sprite } from '../../components/index.js';
import { InputTracker, Vector2 } from '../../common/index.js';

/** A textbox which displays user input text.
 *  @augments GameObject 
 *  @memberof GameObjects.Display */
class TextInput extends GameObject {
    /** @type {CallableFunction} */
    #func
    /** @type {Array<Vector2>} */
    #frames = [new Vector2(0, 0), new Vector2(1, 0)];
    /** @type {string} */
    #text
    /** @type {boolean} */
    #isActive
    /** @type {HTMLCanvasElement} */
    #testCanvas

    /** Create the text input.
     *  @param {Sprite} sprite - The sprites of the text input. Spritesheet should have one row of
     *      two images: [INACTIVE, ACTIVE].
     *  @param {Vector2} pos - The position of the text input.
     *  @param {string} font - The font of the text input.
     *  @param {CallableFunction} func - The function that is called when the text input is submitted. */
    constructor(sprite, pos, font, func) {
        super();
        this.sprite = sprite;
        this.movable = new Movable(new Vector2(0, 0), this.sprite.dimensions, pos, new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0));
        this.collider = new Collider(0);

        this.#func = func;
        this.#text = '';
        this.#isActive = false;

        this.#testCanvas = document.createElement('canvas');
        this.#testCanvas.width = this.sprite.dimensions.x, this.#testCanvas.height = this.sprite.dimensions.y;
        this.#testCanvas.getContext('2d').font = font;
    }

    /** Draws the text onto the internal canvas. This avoids having to change the state of the primary canvas. */
    #preDraw() {
        // metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        const context = this.#testCanvas.getContext('2d');
        context.fillText(this.#text, 0, 0);
    }

    /** Determines whether adding char will make the text go past its boundaries.
     *  @param {string} char - The character that will be added. 
     *  @returns {boolean} The result. */
    #willOverflow(char) {
        const context = this.#testCanvas.getContext('2d');
        return context.measureText(this.#text + char).width <= this.sprite.dimensions.x;
    }

    /** Calls the function with the input text as an argument and then clears itself. */
    submitText() {
        this.#func(this.#text);
        this.#text = '';
        this.#isActive = false;
    }

    /** Handle inputs and update components.
     *  @see GameObject.update
     *  @param {InputTracker} inputs */
    update(inputs) {
        if (inputs.has('MouseHold')) {
            if (this.collider.pointOverlaps(this.movable, inputs.get('MouseHold').pos)) this.#isActive = true;
            else this.#isActive = false;
        }
        if (this.#isActive) {
            if (inputs.consumeInput('Enter')) this.submitText();
            if (inputs.consumeInput('Backspace')) this.#text = this.#text.slice(0, -1);
            const char = inputs.consumePrintableInput();
            if (char && !this.#willOverflow(char)) this.#text += char; 
        }   
    }

    /** Draw the object.
     *  @see GameObject.draw
     *  @param {CanvasRenderingContext2D} context
     *  @param {number} alpha */
    draw(context, alpha){
        this.#preDraw();
        this.sprite.drawFrame(context, this.movable.pos, !this.#isActive ? this.#frames[0] : this.#frames[1]);
        context.drawImage(this.#testCanvas, this.movable.pos.x, this.movable.pos.y);
    }
}

export default TextInput;
