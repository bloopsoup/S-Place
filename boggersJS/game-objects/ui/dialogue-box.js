import GameObject from '../game-object.js';
import { Movable, Collider, Sprite, Dialogue, DScriptReader, DScriptParser, Label } from '../../components/index.js';
import { InputTracker, Vector2 } from '../../common/index.js';

/** A textbox which displays dialogue.
 *  @augments GameObject
 *  @memberof GameObjects.Display */
class DialogueBox extends GameObject {
    /** @type {Dialogue} */
    #dialogue
    /** @type {Label} */
    #label

    /** Create the dialogue box.
     *  @param {Sprite} sprite - The sprite of the dialogue box.
     *  @param {Vector2} pos - The position of the dialogue box. 
     *  @param {string} font - The font of the displayed dialogue. 
     *  @param {string} script - The dialogue script in DScript format. */
    constructor(sprite, pos, font, script) {
        super();
        this.sprite = sprite;
        this.movable = new Movable(new Vector2(0, 0), this.sprite.dimensions, pos, new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0));
        this.collider = new Collider(0);
        this.#dialogue = new Dialogue(new DScriptParser(new DScriptReader(script).read()).parse());
        this.#label = new Label('', this.sprite.dimensions, new Vector2(10, 10), font);
    }

    /** Handle inputs and update components.
     *  @see GameObject.update
     *  @param {InputTracker} inputs */
    update(inputs) {
        if (inputs.has('MouseHold') && this.collider.pointOverlaps(this.movable, inputs.get('MouseHold').pos)) {
            this.#dialogue.advance();
            this.#label.clear();
        }

        this.#dialogue.updateText();
        // TODO: instead of using ADD, implement a setter for the label's message
        if (this.#dialogue.messageContent !== null) this.#label.add(this.#dialogue.messageContent[this.#dialogue.messageContent.length - 1]);
    }

    /** Draw the object.
     *  @see GameObject.draw
     *  @param {CanvasRenderingContext2D} context
     *  @param {number} alpha */
    draw(context, alpha){
        this.sprite.draw(context, this.movable.pos);
        this.#label.draw(context, this.movable.pos);
    }
}

export default DialogueBox;
