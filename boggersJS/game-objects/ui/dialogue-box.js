import GameObject from '../game-object.js';
import { Movable, Collider, Sprite, Dialogue, DScriptReader, DScriptParser, Label, Layout } from '../../components/index.js';
import { InputTracker, Vector2 } from '../../common/index.js';

/** A textbox which displays dialogue.
 *  @augments GameObject
 *  @memberof GameObjects.Display */
class DialogueBox extends GameObject {
    /** @type {Object<string, Vector2>} */
    #emoteFrameLookup = {
        'neutral': new Vector2(0, 0), 
        'happy': new Vector2(1, 0), 
        'joy': new Vector2(2, 0),
        'angry': new Vector2(3, 0),
        'furious': new Vector2(4, 0),
        'sad': new Vector2(5, 0),
        'confused': new Vector2(6, 0),
        'shocked': new Vector2(7, 0)
    };
    
    /** @type {Sprite} */
    #boxSprite
    /** @type {Object<string, Sprite>} */
    #portraitSprites
    /** @type {Label} */
    #nameLabel
    /** @type {Label} */
    #dialogueLabel
    /** @type {Layout} */
    #layout
    /** @type {Dialogue} */
    #dialogue

    /** Create the dialogue box.
     *  @param {Sprite} boxSprite - The sprite of the dialogue box.
     *  @param {Object<string, Sprite>} portraitSprites - Maps speakers' names to their
     *      respective dialogue portraits.
     *  @param {Label} nameLabel - The label used to display the speakers' names.
     *  @param {Label} dialogueLabel - The label used to display dialogue.
     *  @param {Layout} layout - The layout of the dialogue box. A layout must have at least
     *      three slots whose names are: 'name', 'dialogue-text', and 'portrait'.
     *  @param {Vector2} pos - The position of the dialogue box. 
     *  @param {string} script - The dialogue script in DScript format. */
    constructor(boxSprite, portraitSprites, nameLabel, dialogueLabel, layout, pos, script) {
        super();
        this.#boxSprite = boxSprite;
        this.#portraitSprites = portraitSprites;
        this.#nameLabel = nameLabel;
        this.#dialogueLabel = dialogueLabel;
        this.#layout = layout;

        this.movable = new Movable(new Vector2(0, 0), this.#boxSprite.dimensions, pos, new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0));
        this.collider = new Collider(0);
        this.#dialogue = new Dialogue(new DScriptParser(new DScriptReader(script).read()).parse());
        
        this.#setupLayout();
    }

    /** Sets up the layout by inserting the display elements into their slots. */
    #setupLayout() {
        this.#layout.addLabel('name', this.#nameLabel);
        this.#layout.addLabel('dialogue-text', this.#dialogueLabel);
    }

    /** Syncs the current dialogue information with the display elements. */
    #syncDisplays() {
        if (this.#dialogue.headerContent !== null) {
            const [ name, emotion ] = this.#dialogue.headerContent;
            this.#nameLabel.text = name;
            this.#portraitSprites[name].frame = this.#emoteFrameLookup[emotion];
            this.#layout.addSprite('portrait', this.#portraitSprites[name]);
        } else {
            this.#nameLabel.clear();
            this.#layout.removeSprite('portrait');
        }
        if (this.#dialogue.messageContent !== null) this.#dialogueLabel.text = this.#dialogue.messageContent;
    }

    /** Handle inputs and update components.
     *  @see GameObject.update
     *  @param {InputTracker} inputs */
    update(inputs) {
        if (inputs.has('MouseHold') && this.collider.pointOverlaps(this.movable, inputs.get('MouseHold').pos)) {
            inputs.consumeInput('MouseHold');
            this.#dialogue.advance();
            this.#dialogueLabel.clear();
        }
        this.#dialogue.updateText();
        this.#syncDisplays();
    }

    /** Draw the object.
     *  @see GameObject.draw
     *  @param {CanvasRenderingContext2D} context
     *  @param {number} alpha */
    draw(context, alpha){
        this.#boxSprite.draw(context, this.movable.pos);
        this.#layout.draw(context, this.movable.pos);
    }
}

export default DialogueBox;
