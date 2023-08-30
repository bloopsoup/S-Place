import DialogueNode from './dialogue-node.js';
import DScriptChunk from './dscript-chunk.js';

/** A reader for DScript files. 
 *  @memberof Components.Dialogue */
class DScriptReader {
    /** @type {Array<string>} */
    #lines

    /** Create the DScriptReader.
     *  @param {string} script - The input script. */
    constructor(script) {
        this.#lines = script.split('\n').map(line => line.trim()).filter(line => line.length > 0 && line[0] !== '#');
    }

    /** Whether the reader is at the end of the script.
     *  @returns {boolean} The result. */
    get #atEndOfScript() { return this.#lines.length === 0; }

    /** Create the chunk that only contains a message.
     *  @param {string} status - The status messsage.
     *  @returns {DScriptChunk} The chunk. */
    #createStatus(status) { return new DScriptChunk(status); }

    /** Attempts to read a header from the provided lines. It will keep shifting lines until 
     *  it sees a header or lines becomes empty.
     *  @returns {Array<string> | null} List of strings reprsenting the parts of the header.
     *      Is null if the header has an invalid format. Note that we are guranteed text at this
     *      stage otherwise the caller READ will terminate beforehand. */
    #readHeader() {
        const header = this.#lines.shift();    
        const headerDetails = header.split(' ').filter(i => i.length > 0);
        if (headerDetails.length < 2 || headerDetails.length > 4) return null;
        return headerDetails;
    }
    
    /** Attempts to read a message body from the provided lines.
     *  @returns {string | null} Either the message body or null if there are no more lines. */
    #readMessageBody() {
        if (this.#atEndOfScript) return null;
        return this.#lines.shift();
    }
    
    /** Attempts to read a choice body from the provided lines.
     *  It will keep shifting lines and reading in more choices until it sees 'END'.
     *  @returns {Object<string, string> | null} A mapping from choice messages to their labels.
     *      Is null if (1) there are no choices read or (2) there was a choice with an invalid format. */
    #readChoiceBody() {
        const choices = {};
        while (!this.#atEndOfScript) {
            const currentLine = this.#lines.shift();
            if (currentLine === 'END') break;
    
            const choiceDetails = currentLine.split(' -> ');
            if (choiceDetails.length !== 2) return null;
            const [ choiceMessage, label ] = choiceDetails;
            choices[label] = choiceMessage;
        }
        if (Object.keys(choices).length === 0) return null;
        return choices;
    }
    
    /** Attempts to read a chunk from the provided lines by shifting. Along with a status,
     *  you can get a node with choices.
     *  @returns {DScriptChunk} The read chunk. */
    #readChunk() {
        // Read the header
        const headerDetails = this.#readHeader();
        if (headerDetails === null) return this.#createStatus('ERROR: NO HEADER FOUND');
        if (headerDetails.length === 2) {
            if (headerDetails[0] === 'CONVERGE') return new DScriptChunk("GOOD", headerDetails[1]);
            return this.#createStatus('ERROR: NO CONVERGE KEYWORD FOUND');
        }
        
        // Get info from the header and get the message
        const label = headerDetails.length === 4 ? headerDetails.pop() : '';
        const [ name, emotion, type ] = headerDetails;
        if (type !== 'M' && type !== 'C') return this.#createStatus('ERROR: INVALID TYPE');
        const message = this.#readMessageBody();
        if (message === null) return this.#createStatus('ERROR: NO MESSAGE FOUND');
        
        // Get the choices if dealing with a choice node
        let choices = null;
        if (type === 'C') {
            choices = this.#readChoiceBody();
            if (choices === null) return this.#createStatus('ERROR: NO CHOICES FOUND');
        }
        
        return new DScriptChunk("GOOD", null, new DialogueNode(name, emotion, message, type === 'C', label), choices);
    }

    /** Reads the whole script as a collection of chunks.
     *  @returns {Array<DScriptChunk> | null} The chunks or null if an error occurred. */
    read() {
        const chunks = [];
        while (!this.#atEndOfScript) {
            const chunk = this.#readChunk();
            if (chunk['status'].includes('ERROR')) return null;
            chunks.push(chunk);
        }
        return chunks.length > 0 ? chunks : null;
    }
}

export default DScriptReader;
