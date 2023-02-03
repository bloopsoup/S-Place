/*
Research this
https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event
https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_text
*/

import GameObject from '../gameObject.js';
import { Movable, Collider, Sprite } from '../../components/index.js';
import { Input, Vector2 } from '../../common/index.js';

/** A textbox which displays user input text.
 *  @augments GameObject 
 *  @memberof GameObjects.Display */
class TextInput extends GameObject {
    /** @type {CallableFunction} */
    #func
    /** @type {string} */
    #text
    /** @type {boolean} */
    #isActive

    /** Create the text input.
     *  @param {Sprite} sprite - The sprites of the text input. Spritesheet should have one row of
     *      two images: [INACTIVE, ACTIVE].
     *  @param {Vector2} pos - The position of the text input.
     *  @param {CallableFunction} func - The function that is called when the text input is submitted. */
    constructor(sprite, pos, func) {
        super(sprite);
        this.movable = new Movable(new Vector2(0, 0), this.sprite.dimensions, pos, new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0));
        this.collider = new Collider(0);
        this.#func = func;
        this.#text = '';
        this.#isActive = false;
    }

    /** Calls the function with the input text as an argument and then clears itself. */
    submitText() {
        this.#func(this.#text);
        this.#text = '';
    }

    /** Handle inputs.
     *  @see GameObject.handleInputs
     *  @param {Object<string, Input>} inputs */
    handleInputs(inputs) {
        if ('MouseClick' in inputs) {
            if (this.collider.pointOverlaps(this.movable, inputs['MouseClick'].pos)) this.#isActive = true;
            else this.#isActive = false;
        }
        if (this.#isActive) {
            if ('Enter' in inputs) this.submitText();
            if ('Backspace' in inputs) this.#text = this.#text.slice(0, -1);
        }   
    }

    /** Draw the object.
     *  @see GameObject.draw
     *  @param {CanvasRenderingContext2D} context */
    draw(context){
        // draw sprite and text!
    }
}
