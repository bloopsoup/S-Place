import DialogueNode from './dialogue-node.js';

/** A parser for DScript files. Responsible for creating the dialogue tree from
 *  the chunks provided by the DScriptReader.
 *  @memberof Components.Dialogue */
class DScriptParser {
    /** Internal object to represent active labels during parsing.
     *  @typedef {Object} ActiveLabel
     *  @property {DialogueNode | null} head - The head node of the label.
     *  @property {string} message - The incoming message for the start of the label.
     *  @property {boolean} isConverging - Whether the label is converging into its parent label.
     *  @property {string | null} parentLabel - The parent label. It is null for the root label.
     *  @property {Array<string>} convergingChildren - The label's children that wants to 
     *      converge back into the parent label. */

    /** @type {string} */
    #defaultLabelName = '';
    /** @type {Array<import('./dscript-reader.js').DScriptChunk>} */
    #chunks;
    /** @type {DialogueNode} */
    #root;
    /** @type {Object<string, ActiveLabel>} */
    #activeLabels

    /** Create the DScriptParser.
     *  @param {Array<import('./dscript-reader.js').DScriptChunk>} chunks - The chunks given by the reader. */
    constructor(chunks) {
        this.#chunks = chunks;
        this.#root = new DialogueNode('', '', '', false, this.#defaultLabelName);
        this.#activeLabels = {};
        this.#activeLabels[this.#defaultLabelName] = { head: this.#root, message: '', isConverging: false, parentLabel: null, convergingChildren: [] };
    }

    /** Checks whether the operation status message is blank which indicates
     *  a successful operation.
     *  @param {string} status - The status message.
     *  @returns {boolean} The result. */
    #isSuccess(status) { console.log(status); return status.length === 0; }

    /** Attempts to add a node to the dialogue tree.
     *  @param {DialogueNode} node - The node to add.
     *  @returns {string} The status message of the operation. */
    #addNode(node) {
        if (!(node.label in this.#activeLabels)) return `ERROR: UNDEFINED LABEL ${node.label}`;
        const { head, message, isConverging, parentLabel, convergingChildren } = this.#activeLabels[node.label];

        // The label is planning to converge into its parent
        if (isConverging) return `ERROR: ${node.label} IS ALREADY CONVERGING; CANNOT ADD ANOTHER NODE`;

        // The label was just created following the addition of a choice node
        if (head === null) {
            node.choiceMessage = message;
            this.#activeLabels[parentLabel]['head'].addNeighbor(node);
            this.#activeLabels[node.label]['head'] = node;
            return '';
        }

        // The label's head is a choice node; only can add when being converged
        if (head.isChoice) {
            if (convergingChildren.length === 0) return `ERROR: ${node.label} HAS NO CONVERGING CHILDREN; CANNOT ADD ANOTHER NODE`;
            convergingChildren.forEach(child => {
                this.#activeLabels[child]['head'].addNeighbor(node);
                delete this.#activeLabels[child];
            });
            for (const child in this.#activeLabels) {
                if (this.#activeLabels[child]['parentLabel'] !== node.label) continue;
                this.#activeLabels[child]['parentLabel'] = null;
            }
            this.#activeLabels[node.label]['head'] = node;
            this.#activeLabels[node.label]['convergingChildren'] = [];
            return '';
        }

        // The normal case
        this.#activeLabels[node.label]['head'].addNeighbor(node);
        this.#activeLabels[node.label]['head'] = node;

        return '';
    }

    /** Attempts to add a choice node to the dialogue tree. It uses
     *  addNode, but also has to update label states.
     *  @param {DialogueNode} node - The choice node to add. 
     *  @param {Object<string, string>} choices - The options for the choice node.
     *  @returns {string} The status message of the operation. */
    #addChoiceNode(node, choices) {
        if (!this.#isSuccess(this.#addNode(node))) return `ERROR: COULDN'T ADD INITIAL NODE FROM CHOICE NODE`;
        for (const label in choices) {
            if (label in this.#activeLabels) return `ERROR: ${label} ALREADY DEFINED`;
            const newActiveLabel = { head: null, message: choices[label], isConverging: false, parentLabel: node.label, convergingChildren: [] };
            this.#activeLabels[label] = newActiveLabel;
        }
        return '';
    }

    /** Executes node conversion, updating the parent label (the node being converged on)
     *  as well as children labels (the nodes that are converging).
     *  @param {string} label - The label being converged on.
     *  @returns {string} The status message of the operation. */
    #convergeNodes(label) {
        if (!(label in this.#activeLabels)) return `ERROR: UNDEFINED LABEL ${label}`;
        const { head, isConverging, parentLabel, convergingChildren } = this.#activeLabels[label];

        if (isConverging) return `ERROR: CANNOT CONVERGE ${label} WHEN ${label} IS ALREADY CONVERGING`;
        if (head == null) return `ERROR: CANNOT CONVERGE IF ${label} HAS NO NODES`;
        if (head.isChoice) return `ERROR: CANNOT CONVERGE AS ${label} HEAD IS A CHOICE NODE`;
        if (parentLabel == null) return `ERROR: CANNOT CONVERGE AS THE ROOT`;

        this.#activeLabels[label]['isConverging'] = true;
        this.#activeLabels[parentLabel]['convergingChildren'].push(label);
        return '';
    }

    /** Parses a DScript string into a tree made up of DialogueNodes.
     *  @returns {DialogueNode | null} The root of the dialogue tree or null on error. */
    parse() {
        while (this.#chunks.length > 0) {
            const { convergingLabel, node, choices } = this.#chunks.shift();
            if (convergingLabel !== null) { if (!this.#isSuccess(this.#convergeNodes(convergingLabel))) return null; }
            else if (choices !== null) { if (!this.#isSuccess(this.#addChoiceNode(node, choices))) return null; }
            else { if (!this.#isSuccess(this.#addNode(node))) return null; }
        }
        return this.#root.to();
    }
}

export default DScriptParser;
