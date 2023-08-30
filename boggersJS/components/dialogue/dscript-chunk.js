import DialogueNode from './dialogue-node.js';

/** A lexical chunk.
 *  @memberof Components.Dialogue */
class DScriptChunk {
    /** @type {string} */
    #status
    /** @type {string | null} */
    #convergingLabel
    /** @type {DialogueNode | null} */
    #node
    /** @type {Object<string, string> | null} */
    #choices

    /** Create the chunk.
     *  @param {string} status - The status message of the attempted chunk read.
     *  @param {string | null} convergingLabel - The converging label if available.
     *  @param {DialogueNode | null} node - The resulting node if available.
     *  @param {Object<string, string> | null} choices - The resulting choices for a choice node if available. */
    constructor(status, convergingLabel = null, node = null, choices = null) {
        this.#status = status;
        this.#convergingLabel = convergingLabel;
        this.#node = node;
        this.#choices = choices;
    }

    /** Gets the status.
     *  @returns {string} - The status. */
    get status() { return this.#status; }

    /** Gets the converging label.
     *  @returns {string | null} - The converging label if available. */
    get convergingLabel() { return this.#convergingLabel; }

    /** Gets the node.
     *  @returns {DialogueNode | null} - The node if available. */
    get node() { return this.#node; }

    /** Gets the choices.
     *  @returns {Object<string, string> | null} - The choices if available. */
    get choices() { return this.#choices; }
}

export default DScriptChunk;
