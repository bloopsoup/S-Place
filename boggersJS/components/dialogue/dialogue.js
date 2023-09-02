import DialogueNode from './dialogue-node.js';
import TickRunner from '../tick-runner.js';

/** A component managing dialogue progression. Can output letters 
 *  one at a time to get a typing effect.
 *  @memberof Components.Dialogue */
class Dialogue {
    /** @type {DialogueNode} */
    #root
    /** @type {DialogueNode | null} */
    #current
    /** @type {string} */
    #text
    /** @type {TickRunner} */
    #runner

    /** Create the Dialogue component.
     *  @param {DialogueNode} root - The root of the underlying dialogue tree. 
     *  @param {number} ticks - The amount of ticks required before using the next letter */
    constructor(root, ticks = 8) {
        this.#root = root;
        this.#current = root;
        this.#text = '';
        this.#runner = new TickRunner(ticks, () => this.#addNextLetter());
    }

    /** Gets the current header content.
     *  @returns {Array<string> | null} A pair consisting of [name, emotion]
     *      or null if the dialogue has ended. */
    get headerContent() {
        if (this.#current === null) return null;
        return [this.#current.name, this.#current.emotion]
    }

    /** Gets the current message text.
     *  @returns {string | null} The text or null if the dialogue has ended. */
    get messageContent() {
        if (this.#current == null) return null;
        return this.#text;
    }

    /** Gets the current choice text.
     *  @returns {Array<string> | null} An array of choice messages
     *      or null if the dialogue has ended or isn't a choice node. */
    get choiceContent() {
        if (this.#current === null || !this.#current.isChoice) return null;
        return this.#current.next.map(neighbor => neighbor.choiceMessage);
    }

    /** Adds the next letter to the text. Does nothing if its at the 
     *  end of the message. */
    #addNextLetter() {
        if (this.#current === null || this.#current.message.length <= this.#text.length) return;
        this.#text += this.#current.message[this.#text.length];
    }

    /** Checks whether the dialogue has reached the end of its
     *  underlying dialogue tree.
     *  @returns {boolean} The result. */ 
    ended() { return this.#current === null; }

    /** Resets the dialogue tree to the beginning. */
    reset() { 
        this.#current = this.#root;
        this.#text = '';
    }
    
    /** Advances the the text by adding the next letter
     *  after enough updates have passed. */
    updateText() { this.#runner.update(); }

    /** Advances the dialogue to the next node.
     *  @param {number} i - The index of the next node to pick.
            Does nothing if the index is invalid. */
    advance(i = 0) {
        if (this.#current === null) return;
        this.#current = this.#current.to(i);
        this.#text = '';
    }
}

export default Dialogue;
