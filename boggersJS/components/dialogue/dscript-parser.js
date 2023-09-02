import DialogueNode from './dialogue-node.js';
import DScriptChunk from './dscript-chunk.js';

/** Internal object to represent active labels during parsing.
 *  @memberof Components.Dialogue */
class ActiveLabel {
    /** @type {DialogueNode | null} */
    #head
    /** @type {string} */
    #message
    /** @type {boolean} */
    #isConverging
    /** @type {string | null} */
    #parentLabel
    /** @type {Array<string>} */
    #convergingChildren

    /** Create the active label.
     *  @param {DialogueNode | null} head - The head node of the label.
     *  @param {string} message - The incoming message for the start of the label.
     *  @param {string | null} parentLabel - The parent label. It is null for the root label. */
    constructor(head, message, parentLabel) {
        this.#head = head;
        this.#message = message;
        this.#isConverging = false;
        this.#parentLabel = parentLabel;
        this.#convergingChildren = [];
    }

    /** Gets the head node.
     *  @returns {DialogueNode | null} The head node. */
    get head() { return this.#head; }

    /** Gets the incoming message. 
     *  @returns {string} The incoming message. */
    get message() { return this.#message; }

    /** Gets whether the label is converging.
     *  @returns {boolean} - The result. */
    get isConverging() { return this.#isConverging; }

    /** Gets the name of the parent label.
     *  @returns {string | null} - The name of the parent label. */
    get parentLabel() { return this.#parentLabel; }

    /** Gets the list of converging children.
     *  @returns {Array<string>} The list of converging children. */
    get convergingChildren() { return this.#convergingChildren; }

    /** Sets the head node.
     *  @param {DialogueNode} head - The new head. */
    set head(head) { this.#head = head; }

    /** Sets the converging status. 
     *  @param {boolean} isConverging - The new status. */
    set isConverging(isConverging) { this.#isConverging = isConverging; }

    /** Clears the name of the parent for this label. */
    clearParent() { this.#parentLabel = null; }

    /** Clears the converging children for this label. */
    clearChildren() { this.#convergingChildren = []; }
}

/** A parser for DScript files. Responsible for creating the dialogue tree from
 *  the chunks provided by the DScriptReader.
 *  @memberof Components.Dialogue */
class DScriptParser {
    /** @type {string} */
    #defaultLabelName = '';
    /** @type {Array<DScriptChunk>} */
    #chunks;
    /** @type {DialogueNode} */
    #root;
    /** @type {Object<string, ActiveLabel>} */
    #activeLabels

    /** Create the DScriptParser.
     *  @param {Array<DScriptChunk>} chunks - The chunks given by the reader. */
    constructor(chunks) {
        this.#chunks = chunks;
        this.#root = new DialogueNode('', '', '', false, this.#defaultLabelName);
        this.#activeLabels = {};
        this.#activeLabels[this.#defaultLabelName] = new ActiveLabel(this.#root, '', null);
    }

    /** Checks whether the operation status message is blank which indicates
     *  a successful operation.
     *  @param {string} status - The status message.
     *  @returns {boolean} The result. */
    #isSuccess(status) { return status.length === 0; }

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
            this.#activeLabels[parentLabel].head.addNeighbor(node);
            this.#activeLabels[node.label].head = node;
            return '';
        }

        // The label's head is a choice node; only can add when being converged
        if (head.isChoice) {
            if (convergingChildren.length === 0) return `ERROR: ${node.label} HAS NO CONVERGING CHILDREN; CANNOT ADD ANOTHER NODE`;
            convergingChildren.forEach(child => {
                this.#activeLabels[child].head.addNeighbor(node);
                delete this.#activeLabels[child];
            });
            for (const child in this.#activeLabels) {
                if (this.#activeLabels[child].parentLabel !== node.label) continue;
                this.#activeLabels[child].clearParent();
            }
            this.#activeLabels[node.label].head = node;
            this.#activeLabels[node.label].clearChildren();
            return '';
        }

        // The normal case
        this.#activeLabels[node.label].head.addNeighbor(node);
        this.#activeLabels[node.label].head = node;

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
            const newActiveLabel = new ActiveLabel(null, choices[label], node.label);
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
        const { head, isConverging, parentLabel } = this.#activeLabels[label];

        if (isConverging) return `ERROR: CANNOT CONVERGE ${label} WHEN ${label} IS ALREADY CONVERGING`;
        if (head == null) return `ERROR: CANNOT CONVERGE IF ${label} HAS NO NODES`;
        if (head.isChoice) return `ERROR: CANNOT CONVERGE AS ${label} HEAD IS A CHOICE NODE`;
        if (parentLabel == null) return `ERROR: CANNOT CONVERGE AS THE ROOT`;

        this.#activeLabels[label].isConverging = true;
        this.#activeLabels[parentLabel].convergingChildren.push(label);
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
