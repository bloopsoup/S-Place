import { Vector2 } from '../common/index.js';

/** The Label handles displaying text. It uses a separate Canvas internally to render text.
 *  @memberof Components */
class Label {
    /** @type {HTMLCanvasElement} */
    #textCanvas
    /** @type {CanvasRenderingContext2D} */
    #textContext
    /** @type {Vector2} */
    #padding
    /** @type {Array<Array<string>>} */
    #text

    /** Create the label.
     *  @param {string} text - The initial text of the label.
     *  @param {Vector2} dimensions - The bounding dimensions of the label. To default to standard
     *      dimensions, provide a zero vector; the dimensions will fit the provided text.
     *  @param {Vector2} padding - The amount of space between the text and the border defined
     *      by the provided dimensions.
     *  @param {string} font - The font of the label. */
    constructor(text, dimensions, padding, font) {
        this.#textCanvas = document.createElement('canvas');

        if (dimensions.isZero()) this.#setDefaultDimensions(text, font);
        else this.#textCanvas.width = dimensions.x, this.#textCanvas.height = dimensions.y;

        this.#textContext = this.#textCanvas.getContext('2d');
        this.#textContext.font = font;

        this.#padding = padding;
        this.#text = [['']];
        this.text = text;
    }

    /** Gets the label's first line of text.
     *  @return {string} The text. */
    get text() { return this.#getLine(0); }

    /** Sets the label's text. This also formats the text being displayed.
     *  @param {string} text - The new text. */
    set text(text) {
        this.#text = [['']];
        for (let i = 0; i < text.length; i++) this.add(text[i]); 
    }

    /** Gets the height of a label's line of text. M is typically a good approximation.
     *  @return {number} The height. */
    get #lineHeight() {
        const metric = this.#textContext.measureText('M');
        return metric.actualBoundingBoxAscent + metric.actualBoundingBoxDescent;
    }

    /** Gets the label's ith line of text as a complete string.
     *  @param {number} i - The ith line of text to get.
     *  @return {string} The string. */
    #getLine(i) { return this.#text[i].join(''); }

    /** Determines whether the label is empty.
     *  @returns {boolean} The result. */
    #isEmpty() { return this.#text.length === 1 && this.#text[0].length === 1 && this.#text[0][0].length === 0; }

    /** Sets the canvas dimensions to the default dimensions which encompasses the provided text
     *  with the given font.
     *  @param {string} text - The initial text.
     *  @param {string} font - The font that is used. */
    #setDefaultDimensions(text, font) {
        const context = this.#textCanvas.getContext('2d');
        context.font = font;
        const metric = context.measureText(text);
        this.#textCanvas.width = Math.ceil(metric.width), this.#textCanvas.height = Math.ceil(metric.actualBoundingBoxAscent + metric.actualBoundingBoxDescent);
    }

    /** Determines whether adding char will make the text go past its horizontal boundaries.
     *  @param {string} char - The character that will be added. 
     *  @returns {boolean} The result. */
    #willOverflowHorizontal(char) {
        const metric = this.#textContext.measureText(this.#getLine(this.#text.length-1) + char);
        const textLength = metric.width + this.#padding.x;
        return textLength >= this.#textCanvas.width - this.#padding.x;
    }
    
    /** Determines whether adding a new line will make the text go past its vertical boundaries.
     *  @returns {boolean} The result. */
    #willOverflowVertical() {
        const textHeight = (this.#text.length + 1) * (this.#lineHeight + this.#padding.y);
        return textHeight >= this.#textCanvas.height - this.#padding.y;
    }

    /** Determines whether a new word is started by looking at the current character
     *  and the last character of the latest word being made.
     *  @param {string} char - The character being considered. 
     *  @returns {boolean} The result. */
    #isStartingNewWord(char) {
        const lastLine = this.#text[this.#text.length-1];
        const lastWord = lastLine[lastLine.length-1];
        const lastLetter = lastWord.length > 0 ? lastWord[lastWord.length-1] : '';
        return (new RegExp('\\S')).test(char) && (new RegExp('\\s')).test(lastLetter);
    }

    /** Moves the last word on the last line into the previous line if it's the only word
     *  present and the previous line has adequate space. */
    #trimWord() {
        if (this.#text.length === 1 || this.#text[this.#text.length-1].length > 1) return;
        if (this.#willOverflowHorizontal(this.#getLine(this.#text.length-2))) return;
        const word = this.#text.pop()[0];
        this.#text[this.#text.length-1].push(word);
    }

    /** Removes the last word (and last line if needed) so that the new last word of the text
     *  is non-empty. Does nothing if the label is empty. */
    #trim() {
        if (this.#isEmpty()) return;
        const lastLine = this.#text[this.#text.length-1];
        const lastWord = lastLine[lastLine.length-1];
        if (lastWord.length === 0) lastLine.pop();
        if (lastLine.length === 0) this.#text.pop();
    }

    /** Renders the text onto the internal canvas. This is to avoid rendering text
     *  multiple times if the text never changes. */
    #preRender() {
        this.#textContext.clearRect(0, 0, this.#textCanvas.width, this.#textCanvas.height);
        const fontAscent = Math.abs(this.#textContext.measureText('M').actualBoundingBoxAscent);
        for (let i = 0; i < this.#text.length; i++) {
            this.#textContext.fillText(this.#getLine(i), this.#padding.x, fontAscent + ((i + 1) * this.#padding.y) + (i * this.#lineHeight));
        }
    }

    /** Adds a character to the label's text.
     *  @param {string} char - The character to add to the label. */
    add(char) {
        const lastLine = this.#text[this.#text.length-1]; 
        if (!this.#willOverflowHorizontal(char)) {
            if (this.#isStartingNewWord(char)) lastLine.push('');
            lastLine[lastLine.length-1] += char;
        } else if (!this.#willOverflowVertical()) {
            if (this.#isStartingNewWord(char)) lastLine.push('');
            if (lastLine.length > 1 && (new RegExp('\\S')).test(char)) this.#text.push([lastLine.pop() + char]);
            else if (lastLine[lastLine.length-1].length > 0) this.#text.push([char]);
        }
        this.#preRender();
    }

    /** Removes the last character from the label's text. */
    back() {
        const lastLine = this.#text[this.#text.length-1];
        lastLine[lastLine.length-1] = lastLine[lastLine.length-1].slice(0, -1);
        this.#trimWord();
        this.#trim();
        this.#preRender();
    }

    /** Clears the label's text. */
    clear() { 
        this.#text = [['']];
        this.#preRender();
    }

    /** Draw the label at a position.
     *  @param {CanvasRenderingContext2D} context - The context to draw on.
     *  @param {Vector2} pos - The position to draw the label. */
    draw(context, pos) { context.drawImage(this.#textCanvas, pos.x, pos.y); }
}

export default Label;
