import GameObject from '../gameObject.js';
import { Movable, Collider, Sprite } from '../../components/index.js';
import { InputTracker, Vector2 } from '../../common/index.js';

/** A button that activates a given function when clicked.
 *  @augments GameObject 
 *  @memberof GameObjects.Display */
class Button extends GameObject {
    /** @type {CallableFunction} */
    #func
    /** @type {boolean} */
    #isHovered
    /** @type {boolean} */
    #isClicked

    /** Create the Button.
     *  @param {Sprite} sprite - The sprites for the button. Spritesheet should have one row of
     *      three images: [DEFAULT, HOVERED, CLICK]
     *  @param {Vector2} pos - The position of the button.
     *  @param {CallableFunction} func - The function that is called when the button is pressed. */
    constructor(sprite, pos, func) {
        super(sprite);
        this.movable = new Movable(new Vector2(0, 0), this.sprite.dimensions, pos, new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0));
        this.collider = new Collider(0);
        this.#func = func;
        this.#isHovered = false;
        this.#isClicked = false;
    }

    /** Returns the correct frame for the button display based on
     *  its current state.
     *  @returns {Vector2} The current frame of the button. */
    currentFrame() {
        if (this.#isClicked) return new Vector2(2, 0);
        else if (this.#isHovered) return new Vector2(1, 0);
        else return new Vector2(0, 0);
    }

    /** Handle inputs.
     *  @see GameObject.handleInputs
     *  @param {InputTracker} inputs */
    handleInputs(inputs) {
        if (!inputs.has('MouseMove')) return;
        if (this.collider.pointOverlaps(this.movable, inputs.get('MouseMove').pos)) {
            this.#isHovered = true;
            if (inputs.has('MouseHold')) { this.#isClicked = true; this.#func(); } 
            else { this.#isClicked = false; }
        } else {
            this.#isHovered = false;
            this.#isClicked = false;
        }
    }

    /** Draw the object.
     *  @see GameObject.draw
     *  @param {CanvasRenderingContext2D} context */
    draw(context) {
        console.log(this.#isHovered, this.#isClicked);
        this.sprite.drawFrame(context, this.movable.pos, this.currentFrame());
    }
}

export default Button;
