/** A node representing a dialogue part. It has a name, emotion, and speaker. 
 *  In addition, it contains references to other nodes to represent a progression.
 *  @memberof Components */
class DialogueNode {
    /** @type {string} */
    #name
    /** @type {string} */
    #emotion
    /** @type {string} */
    #message
    /** @type {boolean} */
    #isChoice
    /** @type {Object<string, DialogueNode>} */
    #next

    /** Create the DialogueNode.
     *  @param {string} name - The name of the speaker of this part.
     *  @param {string} emotion - The emotion of the speaker.
     *  @param {boolean} isChoice - If the node is a choicen node.
     *  @param {string} message - The message of the part.
     *  @param {Object<string, DialogueNode>} next - A mapping between a choice
     *      message and a destination node. For message nodes, there will be only
     *      one entry consisting of a blank string mapping to the next node. 
     *      For tree construction, usually next is initialized empty. */
    constructor(name, emotion, message, isChoice, next = {}) {
        this.#name = name;
        this.#emotion = emotion;
        this.#message = message;
        this.#isChoice = isChoice;
        this.#next = next;
    }

    /** Gets the name of the speaker. 
     *  @returns {string} The name of the speaker. */
    get name() { return this.#name; }

    /** Gets the emotion of the speaker.
     *  @returns {string} The emotions of the speaker. */
    get emotion() { return this.#emotion; }

    /** Gets the speakers message. 
     *  @returns {string} The message. */
    get message() { return this.#message; }

    /** Whether the node is a choice node.
     *  @returns {boolean} The result. */
    get isChoice() { return this.#isChoice; }

    /** Sets the destinations of this node.
     *  @param {Object<string, DialogueNode>} next - The new destination mapping. */
    set next(next) { this.#next = next; }

    /** Returns the next neighboring node.
     *  @param {string} dest - The message corresponding to the next node to return. 
     *      Defaults to "" for message nodes. 
     *  @returns {DialogueNode} - The next node. */
    to(dest = '') { return this.#next[dest]; }
}

/** A component managing dialogue progression, branches, and portraits.
 *  Can output letters at a time. Typically, dialogue scripts are generated 
 *  from a simplified format.
 *  @memberof Components */
class Dialogue {
    constructor() {
    }
}

export default Dialogue;
