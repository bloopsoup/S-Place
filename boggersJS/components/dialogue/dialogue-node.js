/** A node representing a dialogue part. It has a name, emotion, and speaker. 
 *  In addition, it contains references to other nodes to represent a progression.
 *  @memberof Components.Dialogue */
class DialogueNode {
    /** Internal object to represent the node's choices/neighbors.
     *  @typedef {Object} NextEntry
     *  @property {string} dest - The message of the entry.
     *  @property {DialogueNode} node - The corresponding node. */

    /** @type {string} */
    #name
    /** @type {string} */
    #emotion
    /** @type {string} */
    #message
    /** @type {boolean} */
    #isChoice
    /** @type {string} */
    #label
    /** @type {Array<NextEntry>} */
    #next

    /** Create the DialogueNode.
     *  @param {string} name - The name of the speaker of this part.
     *  @param {string} emotion - The emotion of the speaker.
     *  @param {string} message - The message of the part.
     *  @param {boolean} isChoice - If the node is a choice node.
     *  @param {string} label - The label of the part. Used to aid in parsing or
     *      to specify additional information like a category. */
    constructor(name, emotion, message, isChoice, label = '') {
        this.#name = name;
        this.#emotion = emotion;
        this.#message = message;
        this.#isChoice = isChoice;
        this.#label = label;
        this.#next = [];
    }

    /** Gets the name of the speaker. 
     *  @returns {string} The name of the speaker. */
    get name() { return this.#name; }

    /** Gets the emotion of the speaker.
     *  @returns {string} The emotions of the speaker. */
    get emotion() { return this.#emotion; }

    /** Gets the speaker's message. 
     *  @returns {string} The message. */
    get message() { return this.#message; }

    /** Whether the node is a choice node.
     *  @returns {boolean} The result. */
    get isChoice() { return this.#isChoice; }

    /** Gets the label of the node. 
     *  @returns {string} The label. */
    get label() { return this.#label; }

    /** Gets the neighbors of the node.
     *  @returns {Array<NextEntry>} The neighbors. */
    get next() { return this.#next; }

    /** Adds a new neighboring node.
     *  @param {DialogueNode} node - The next node.
     *  @param {string} dest - The message corresponding to the next node.
     *       Defaults to '' for adding a destination to a message node. */
    addNeighbor(node, dest = '') { this.#next.push({ dest, node }); }

    /** Returns the next neighboring node.
     *  @param {number} i - The index corresponding to the next node to return. 
     *      Defaults to 0 for message nodes. 
     *  @returns {DialogueNode | null} The next node. Will be null if the index
     *      is invalid. */
    to(i = 0) {
        if (i < 0 || i >= this.#next.length) return null;
        return this.#next[i]['node']; 
    }
}

export default DialogueNode;
