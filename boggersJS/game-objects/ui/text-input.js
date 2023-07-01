import GameObject from '../game-object.js';
import { Movable, Collider, Sprite, Label } from '../../components/index.js';
import { InputTracker, Vector2 } from '../../common/index.js';

/** A textbox which displays user input text.
 *  @augments GameObject 
 *  @memberof GameObjects.Display */
class TextInput extends GameObject {
    /** @type {Label} */
    #label
    /** @type {CallableFunction} */
    #func
    /** @type {Array<Vector2>} */
    #frames = [new Vector2(0, 0), new Vector2(1, 0)];
    /** @type {boolean} */
    #isActive

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
        this.#label = new Label(this.sprite.dimensions, new Vector2(10, 10), font);

        this.#func = func;
        this.#isActive = false;   
    }

    /** Calls the function with the input text as an argument and then clears itself. */
    submitText() {
        this.#func(this.#label.text);
        this.#label.clear();
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
            if (inputs.consumeInput('Backspace')) this.#label.back();
            const char = inputs.consumePrintableInput();
            if (char) this.#label.add(char, true); 
        }   
    }

    /** Draw the object.
     *  @see GameObject.draw
     *  @param {CanvasRenderingContext2D} context
     *  @param {number} alpha */
    draw(context, alpha){
        this.sprite.drawFrame(context, this.movable.pos, !this.#isActive ? this.#frames[0] : this.#frames[1]);
        this.#label.draw(context, this.movable.pos);
    }
}

export default TextInput;
