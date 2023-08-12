import DialogueNode from './dialogue-node.js';

/** A parser for DScript files. 
 *  @memberof Components.Dialogue */
class Parser {
    /** @type {string} */
    static #defaultBranchName = 'main';

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

    /** Attempts to read a message body from the provided lines.
     *  @param {Array<string>} lines - The lines to read the message from. Will mutate via shift.
     *  @returns {string | null} Either the message body or null if there are no more lines. */
    static #extractMessageBody(lines) {
        if (lines.length === 0) return null;
        return lines.shift();
    }

    /** Attempts to read a choice body from the provided lines.
     *      It will keep shifting lines and reading in more choices until it sees a comment or newline.
     *  @param {Array<string>} lines - The lines to read the choices from. Will mutate via shift.
     *  @returns {Object<string, string> | null} A mapping from choice messages to their labels.
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
     *  @returns {DialogueNode | null} The DialogueNode or null if it errors while parsing. */
    static #extractNode(lines) {
        const headerDetails = DScriptParser.#extractHeader(lines);
        if (headerDetails === null) return null;
        if (headerDetails.length === 2) return null; // IMPLEMENT CONVERGE

        const label = headerDetails.length === 4 ? headerDetails.pop() : this.#defaultBranchName;
        const [ name, emotion, type ] = headerDetails;
        const message = DScriptParser.#extractMessageBody(lines);
        if (message === null) return null;
        return new DialogueNode(name, emotion, message, type === 'C', label);
    }

    static #addMessageNode(node, branchHeads) {
        /*
        0) MESSAGE NODE
        - Extract the next node
        - Check if the result is actually a node or a string
        - If string
            - If string includes CONVERGE, see (2)
            - If string includes ERROR, return NULL -- something went wrong with parsing
              Normally, the happy path would see the while loop terminate by itself
        - If node, update the head's neighbor and then shift
        - If you get a node that has a label and its head is not present in branchHeads, return null
          There is no parent
        - You cannot add message nodes to choice nodes -- check if head is choice node and NULL if yes
          UNLESS IT'S BEING CONVERGED ON BY AT LEAST ONE BRANCH

        0a) LABELED
        - This is for the labeled node case when extracting
        - Check whether the branchHeads[label] has the same label as your node
        - If it is the same label, it's adding to a LL
        - If it is not, then it's adding to a LL with the included message
        */
    }

    static #addChoiceNode(node, branchHeads) {
        /*
        1) CHOICE NODE
        - Establish new branch heads where branchHeads[label] = parent (so the current choice node)
        - Establish new entry mapping messages[label] = message
        - Establish new converge mapping converges[parent] = []
        - Previously used labels cannot be reused IF IT IS ALREADY ACTIVE, so because of this, 
          we will check by checking the msg lookup and return NULL if found
        */
    }

    static #convergeNodes(node, branchHeads) {
        /*
        2) ON CONVERGE
        - Converging a label means that when the parent adds a new node, all the label will
          point to that parent---flattening the tree
        - To do this, add to converges[parent].push(label)
        - Cannot converge twice -- return null if attempts to
        - Cannot converge if you don't have a parent
        */
    }

    /** Parses a DScript string into a tree made up of DialogueNodes.
     *  @param {string} script - The input string.
     *  @returns {DialogueNode | null} The root of the dialogue tree. */
    static parse(script) {
        const lines = script.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        const root = new DialogueNode('', '', '', false, this.#defaultBranchName);
        const branchHeads = {};
        branchHeads[this.#defaultBranchName] = root;

        while (lines.length > 0) {
            const node = DScriptParser.#extractNode(lines);
            if (node === null) return null;
            branchHeads[node.label].addNeighbor(node);
            branchHeads[node.label] = node;
        }
        return root.to();
    }
}

export default Parser;
