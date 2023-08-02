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
    /** @type {string} */
    #label
    /** @type {Object<string, DialogueNode>} */
    #next

    /** Create the DialogueNode.
     *  @param {string} name - The name of the speaker of this part.
     *  @param {string} emotion - The emotion of the speaker.
     *  @param {boolean} isChoice - If the node is a choicen node.
     *  @param {string} message - The message of the part.
     *  @param {string} label - The label of the part. Used to aid in parsing or
     *      to specify additional information like a category.
     *  @param {Object<string, DialogueNode>} next - A mapping between a choice
     *      message and a destination node. For message nodes, there will be only
     *      one entry consisting of a blank string mapping to the next node. 
     *      For tree construction, usually next is initialized empty. */
    constructor(name, emotion, message, isChoice, label = '', next = {}) {
        this.#name = name;
        this.#emotion = emotion;
        this.#message = message;
        this.#isChoice = isChoice;
        this.#label = label;
        this.#next = next;
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

    /** Sets the destinations of this node.
     *  @param {Object<string, DialogueNode>} next - The new destination mapping. */
    set next(next) { this.#next = next; }

    /** Returns the next neighboring node.
     *  @param {string} dest - The message corresponding to the next node to return. 
     *      Defaults to "" for message nodes. 
     *  @returns {DialogueNode} - The next node. */
    to(dest = '') { return this.#next[dest]; }
}

/** A parser for DScript files. 
 *  @memberof Components */
class DScriptParser {
    /** Attempts to read a header from the provided lines. It will keep shifting lines until 
     *      it sees a header or lines becomes empty.
     *  @param {Array<string>} lines - The lines to read the header from. Will mutate via shift.
     *  @returns {Array<string> | null} List of strings reprsenting the parts of the header.
     *      Is null if (1) there is no header or (2) the header has an invalid format. */
    static #extractHeader(lines) {
        let header = '';
        while (lines.length > 0 && (header.length === 0 || header[0] === '#')) header = lines.shift();
        if (header.length === 0 || header[0] === '#') return null;

        const headerDetails = header.split(' ');
        if (headerDetails.length < 2 || headerDetails.length > 4) return null;
        return headerDetails;
    }

    /** Attempts to read a message body from the provided lines. Used for a 'M' DialogueNode.
     *  @param {Array<string>} lines - The lines to read the message from. Will mutate via shift.
     *  @returns {string | null} - Either the message body or null if there are no more lines. */
    static #extractMessageBody(lines) {
        if (lines.length === 0) return null;
        return lines.shift();
    }

    /** Attempts to read a choice body from the provided lines. Used for a 'C' DialogueNode. 
     *      It will keep shifting lines and reading in more choices until it sees a comment or newline.
     *  @param {Array<string>} lines - The lines to read the choices from. Will mutate via shift.
     *  @returns {Object<string, string> | null} - A mapping from choice messages to their labels.
     *      Is null if (1) there are no choices read or (2) there was a choice with an invalid format. */
    static #extractChoiceBody(lines) {
        if (lines.length === 0) return null;

        const choices = {};
        let currentLine = '';
        while (lines.length > 0) {
            currentLine = lines.shift();
            if (currentLine.length === 0 || currentLine[0] === '#') break;

            const choiceDetails = currentLine.split(' -> ');
            if (choiceDetails.length !== 2) return null;
            const [ choiceMessage, label ] = choiceDetails;
            choices[choiceMessage] = label;
        }

        if (choices.length === 0) return null;
        return choices;
    }

    /** Attempts to read a DialogueNode from the provided lines by shifting.
     *  @param {Array<string>} lines - The lines to read the node from. Will mutate via shift.
     *  @returns {DialogueNode | null} - The DialogueNode or null if it errors while parsing. */
    static #extractNode(lines) {
        const headerDetails = DScriptParser.#extractHeader(lines);
        if (headerDetails === null) return null;
        if (headerDetails.length === 2) return null; // IMPLEMENT CONVERGE

        const label = headerDetails.length === 4 ? headerDetails.pop() : '';
        const [ name, emotion, type ] = headerDetails;
        const message = DScriptParser.#extractMessageBody(lines);
        if (message === null) return null;
        return new DialogueNode(name, emotion, message, type === 'C', label);
    }

    /** Parses a DScript string into a tree made up of DialogueNodes.
     *  @param {string} script - The input string.
     *  @returns {DialogueNode | null} - The root of the dialogue tree.*/
    static parseDScript(script) {
        return new DialogueNode('', '', '', false);
    }
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
