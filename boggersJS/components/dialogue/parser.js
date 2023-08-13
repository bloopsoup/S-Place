import DialogueNode from './dialogue-node.js';

/** A parser for DScript files. 
 *  @memberof Components.Dialogue */
class Parser {
    /** Internal object to represent active labels during parsing.
     *  @typedef {Object} ActiveLabel
     *  @property {DialogueNode | null} head - The head of the label.
     *  @property {string} message - The incoming message for the start of the label.
     *  @property {boolean} isConverging - Whether the label is converging into its parent label.
     *  @property {boolean} isConverged - Whether the label has been converged on by its children.
     *  @property {string} parentLabel - The parent label.
     *  @property {Array<string>} convergingChildren - The label's children that wants to 
     *      converge back into the parent label. */

    /** @type {string} */
    static #defaultLabelName = 'main';

    /** Checks whether the provided line is a comment.
     *  @param {string} line - The provided line. 
     *  @returns {boolean} The result. */
    static #isComment(line) { return line.length === 0 || line[0] === '#'; }

    /** Attempts to read a header from the provided lines. It will keep shifting lines until 
     *  it sees a header or lines becomes empty.
     *  @param {Array<string>} lines - The lines to read the header from. Will mutate via shift.
     *  @returns {Array<string> | null} List of strings reprsenting the parts of the header.
     *      Is null if (1) there is no header or (2) the header has an invalid format. */
    static #extractHeader(lines) {
        let header = '';
        while (lines.length > 0 && Parser.#isComment(header)) header = lines.shift();
        if (Parser.#isComment(header)) return null;

        const headerDetails = header.split(' ');
        if (headerDetails.length < 2 || headerDetails.length > 4) return null;
        return headerDetails;
    }

    /** Attempts to read a message body from the provided lines.
     *  @param {Array<string>} lines - The lines to read the message from. Will mutate via shift.
     *  @returns {string | null} Either the message body or null if there are no more lines. */
    static #extractMessageBody(lines) {
        if (lines.length === 0) return null;
        return lines.shift();
    }

    /** Attempts to read a choice body from the provided lines.
     *  It will keep shifting lines and reading in more choices until it sees a comment or newline.
     *  @param {Array<string>} lines - The lines to read the choices from. Will mutate via shift.
     *  @returns {Object<string, string> | null} A mapping from choice messages to their labels.
     *      Is null if (1) there are no choices read or (2) there was a choice with an invalid format. */
    static #extractChoiceBody(lines) {
        if (lines.length === 0) return null;

        const choices = {};
        let currentLine = '';
        while (lines.length > 0) {
            currentLine = lines.shift();
            if (Parser.#isComment(currentLine)) break;

            const choiceDetails = currentLine.split(' -> ');
            if (choiceDetails.length !== 2) return null;
            const [ choiceMessage, label ] = choiceDetails;
            choices[label] = choiceMessage;
        }

        if (choices.length === 0) return null;
        return choices;
    }

    /** Attempts to read a DialogueNode from the provided lines by shifting.
     *  @param {Array<string>} lines - The lines to read the node from. Will mutate via shift.
     *  @returns {Array} A pair containing the node and the status message. */
    static #extractNode(lines) {
        const headerDetails = Parser.#extractHeader(lines);
        if (headerDetails === null) return [null, 'ERROR'];
        if (headerDetails.length === 2) return [null, headerDetails[1]];

        const label = headerDetails.length === 4 ? headerDetails.pop() : this.#defaultLabelName;
        const [ name, emotion, type ] = headerDetails;
        const message = Parser.#extractMessageBody(lines);
        if (message === null) return [null, 'ERROR'];
        return [new DialogueNode(name, emotion, message, type === 'C', label), 'GOOD'];
    }

    /**
     *  @param {DialogueNode} node 
     *  @param {Object<string, ActiveLabel>} activeLabels
     *  @returns {boolean} Whether the operation was successful. */
    static #addNode(node, activeLabels) {
        if (!(node.label in activeLabels)) return false;
        const { head, message, isConverging, parentLabel, convergingChildren } = activeLabels[node.label];

        if (isConverging) return false;
        if (head === null) {
            node.choiceMessage = message;
            activeLabels[parentLabel]['head'].addNeighbor(node);
            activeLabels[node.label]['head'] = node;
            return true;
        }
        if (head.isChoice) {
            if (convergingChildren.length === 0) return false;
            convergingChildren.forEach(child => {
                activeLabels[child]['head'].addNeighbor(node);
                delete activeLabels[child];
            });
            activeLabels[node.label]['head'] = node;
            activeLabels[node.label]['isConverged'] = true;
            activeLabels[node.label]['convergingChildren'] = [];
            return true;
        }

        activeLabels[node.label]['head'].addNeighbor(node);
        activeLabels[node.label]['head'] = node;
        return true;
    }

    /**
     *  @param {DialogueNode} node 
     *  @param {Object<string, string>} choices
     *  @param {Object<string, ActiveLabel>} activeLabels
     *  @returns {boolean} Whether the operation was successful. */
    static #addChoiceNode(node, choices, activeLabels) {
        if (!this.#addNode(node, activeLabels)) return false;
        activeLabels[node.label]['isConverged'] = false;
        for (const label in choices) {
            if (label in activeLabels) return false;
            activeLabels[label] = { head: null, message: choices[label], isConverging: false, isConverged: false, convergingChildren: [] };
        }
       return true;
    }

    /**
     *  @param {string} label 
     *  @param {Object<string, ActiveLabel>} activeLabels
     *  @returns {boolean} Whether the operation was successful. */
    static #convergeNodes(label, activeLabels) {
        if (!(label in activeLabels)) return false;
        const { head, isConverging, parentLabel, convergingChildren } = activeLabels[label];

        if (head === null || head.isChoice || isConverging || parentLabel === '' || convergingChildren.length > 0) return false;
        if (activeLabels[parentLabel]['isConverged']) return false;

        activeLabels[label]['isConverging'] = true;
        activeLabels[parentLabel]['convergingChildren'].push(label);
        return true;
    }

    /** Parses a DScript string into a tree made up of DialogueNodes.
     *  @param {string} script - The input string.
     *  @returns {DialogueNode | null} The root of the dialogue tree. */
    static parse(script) {
        const lines = script.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        const root = new DialogueNode('', '', '', false, this.#defaultLabelName);
        const activeLabels = {};
        activeLabels[this.#defaultLabelName] = { head: root, message: '', isConverging: false, isConverged: false, convergingChildren: [] };

        while (lines.length > 0) {
            const [node, status] = this.#extractNode(lines);
            if (status === 'ERROR') return null;
            if (status !== 'GOOD') { if (!this.#convergeNodes(status, activeLabels)) return null; continue; }
            if (!node.isChoice) { if (!this.#addNode(node, activeLabels)) return null; continue; }
            
            const choices = Parser.#extractChoiceBody(lines);
            if (choices === null) return null;
            if (!this.#addChoiceNode(node, choices, activeLabels)) return null;
        }
        return root.to();
    }
}

export default Parser;
