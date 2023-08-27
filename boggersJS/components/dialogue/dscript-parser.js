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
     *  @property {boolean} isConverged - Whether the label has been converged on by its children.
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
        this.#activeLabels[this.#defaultLabelName] = { head: this.#root, message: '', isConverging: false, isConverged: false, parentLabel: null, convergingChildren: [] };
    }

    /** Attempts to add a node to the dialogue tree.
     *  @param {DialogueNode} node - The node to add.
     *  @returns {boolean} Whether the operation was successful. */
    #addNode(node) {
        if (!(node.label in this.#activeLabels)) return false;
        const { head, message, isConverging, parentLabel, convergingChildren } = this.#activeLabels[node.label];

        // The label is planning to converge into its parent
        if (isConverging) return false;

        // The label was just created following the addition of a choice node
        if (head === null) {
            node.choiceMessage = message;
            this.#activeLabels[parentLabel]['head'].addNeighbor(node);
            this.#activeLabels[node.label]['head'] = node;
            return true;
        }

        // The label's head is a choice node; only can add when being converged
        if (head.isChoice) {
            if (convergingChildren.length === 0) return false;
            convergingChildren.forEach(child => {
                this.#activeLabels[child]['head'].addNeighbor(node);
                delete this.#activeLabels[child];
            });
            this.#activeLabels[node.label]['head'] = node;
            this.#activeLabels[node.label]['isConverged'] = true;
            this.#activeLabels[node.label]['convergingChildren'] = [];
            return true;
        }

        // The normal case
        this.#activeLabels[node.label]['head'].addNeighbor(node);
        this.#activeLabels[node.label]['head'] = node;

        return true;
    }

    /** Attempts to add a choice node to the dialogue tree. It uses
     *  addNode, but also has to update label states.
     *  @param {DialogueNode} node - The choice node to add. 
     *  @param {Object<string, string>} choices - The options for the choice node.
     *  @returns {boolean} Whether the operation was successful. */
    #addChoiceNode(node, choices) {
        if (!this.#addNode(node)) return false;
        this.#activeLabels[node.label]['isConverged'] = false;
        for (const label in choices) {
            if (label in this.#activeLabels) return false;
            const newActiveLabel = { head: null, message: choices[label], isConverging: false, isConverged: false, parentLabel: node.label, convergingChildren: [] };
            this.#activeLabels[label] = newActiveLabel;
        }
        return true;
    }

    /** Executes node conversion, updating the parent label (the node being converged on)
     *  as well as children labels (the nodes that are converging).
     *  @param {string} label - The label being converged on.
     *  @returns {boolean} Whether the operation was successful. */
    #convergeNodes(label) {
        if (!(label in this.#activeLabels)) return false;
        const { head, isConverging, parentLabel, convergingChildren } = this.#activeLabels[label];

        // This is the criteria for invalid convergence
        // - Can't converge on a newly made label since there's no node that will converge
        // - Can't converge if the head node is a choice as it will have children. In this
        //   case, it must be converged on first and then have a message node added to it.
        // - Can't converge if the node is already converging.
        // - Can't converge if there is no parent label to converge on.
        // - TODO: HANDLE PARENT LABEL BEING CONVERGED AND THEN STARTING A NEW CHOICE NODE
        // - Can't converge if other children are converging on you. If you want to converge,
        //   add a message node.
        if (head === null || head.isChoice || isConverging || parentLabel === null || this.#activeLabels[parentLabel]['isConverged'] || convergingChildren.length > 0) return false;
        this.#activeLabels[label]['isConverging'] = true;
        this.#activeLabels[parentLabel]['convergingChildren'].push(label);
        return true;
    }

    /** Parses a DScript string into a tree made up of DialogueNodes.
     *  @returns {DialogueNode | null} The root of the dialogue tree or null on error. */
    parse() {
        while (this.#chunks.length > 0) {
            const { convergingLabel, node, choices } = this.#chunks.shift();
            if (convergingLabel !== null) { if (!this.#convergeNodes(convergingLabel)) return null; }
            else if (choices !== null) { if (!this.#addChoiceNode(node, choices)) return null; }
            else { if (!this.#addNode(node)) return null; }
        }
        return this.#root.to();
    }
}

export default DScriptParser;
