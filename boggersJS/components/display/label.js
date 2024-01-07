import { Vector2 } from '../../common/index.js';

/** The Label handles displaying text. It uses a separate Canvas internally to render text.
 *  @memberof Components.Display */
class Label {
    /** @type {HTMLCanvasElement} */
    #textCanvas
    /** @type {CanvasRenderingContext2D} */
    #textContext
    /** @type {Vector2} */
    #padding
    /** @type {Array<Array<string>>} */
    #lines

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
        this.#lines = [['']];
        this.text = text;
    }

    /** Get the label's dimensions.
     *  @returns {Vector2} The label's dimensions. */
    get dimensions() { return new Vector2(this.#textCanvas.width, this.#textCanvas.height); }

    /** Gets the label's text as one string.
     *  @returns {string} The text. */
    get text() { return this.#lines.map(line => line.join('')).join(''); }

    /** Sets the label's text. This also formats the text being displayed.
     *  @param {string} text - The new text. */
    set text(text) {
        const oldText = this.text;
        if (oldText === text) return;
        if (oldText === text.slice(0, -1)) { this.add(text[text.length-1]); return; }
        this.#lines = [['']];
        for (let i = 0; i < text.length; i++) this.add(text[i]); 
    }

    /** Gets the height of a label's line of text. M is typically a good approximation.
     *  @returns {number} The height. */
    get #lineHeight() {
        const metric = this.#textContext.measureText('M');
        return metric.actualBoundingBoxAscent + metric.actualBoundingBoxDescent;
    }

    /** Gets the label's ith line of text as a complete string.
     *  @param {number} i - The ith line of text to get.
     *  @returns {string} The string. */
    #getLineText(i) { return this.#lines[i].join(''); }

    /** Determines whether the label is empty.
     *  @returns {boolean} The result. */
    #isEmpty() { return this.#lines.length === 1 && this.#lines[0].length === 1 && this.#lines[0][0].length === 0; }

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
        const metric = this.#textContext.measureText(this.#getLineText(this.#lines.length-1) + char);
        const textLength = metric.width + this.#padding.x;
        return textLength >= this.#textCanvas.width - this.#padding.x;
    }
    
    /** Determines whether adding a new line will make the text go past its vertical boundaries.
     *  @returns {boolean} The result. */
    #willOverflowVertical() {
        const textHeight = (this.#lines.length + 1) * (this.#lineHeight + this.#padding.y);
        return textHeight >= this.#textCanvas.height - this.#padding.y;
    }

    /** Determines whether a new word is started by looking at the current character
     *  and the last character of the latest word being made.
     *  @param {string} char - The character being considered. 
     *  @returns {boolean} The result. */
    #isStartingNewWord(char) {
        const lastLine = this.#lines[this.#lines.length-1];
        const lastWord = lastLine[lastLine.length-1];
        const lastLetter = lastWord.length > 0 ? lastWord[lastWord.length-1] : '';
        return (new RegExp('\\S')).test(char) && (new RegExp('\\s')).test(lastLetter);
    }

    /** Moves the last word on the last line into the previous line if it's the only word
     *  present and the previous line has adequate space. */
    #trimWord() {
        if (this.#lines.length === 1 || this.#lines[this.#lines.length-1].length > 1) return;
        if (this.#willOverflowHorizontal(this.#getLineText(this.#lines.length-2))) return;
        const word = this.#lines.pop()[0];
        this.#lines[this.#lines.length-1].push(word);
    }

    /** Removes the last word (and last line if needed) so that the new last word of the text
     *  is non-empty. Does nothing if the label is empty. */
    #trim() {
        if (this.#isEmpty()) return;
        const lastLine = this.#lines[this.#lines.length-1];
        const lastWord = lastLine[lastLine.length-1];
        if (lastWord.length === 0) lastLine.pop();
        if (lastLine.length === 0) this.#lines.pop();
    }

    /** Renders the text onto the internal canvas. This is to avoid rendering text
     *  multiple times if the text never changes. */
    #preRender() {
        this.#textContext.clearRect(0, 0, this.#textCanvas.width, this.#textCanvas.height);
        const fontAscent = Math.abs(this.#textContext.measureText('M').actualBoundingBoxAscent);
        for (let i = 0; i < this.#lines.length; i++) {
            this.#textContext.fillText(this.#getLineText(i), this.#padding.x, fontAscent + ((i + 1) * this.#padding.y) + (i * this.#lineHeight));
        }
    }

    /** Adds a character to the label's text.
     *  @param {string} char - The character to add to the label. */
    add(char) {
        const lastLine = this.#lines[this.#lines.length-1]; 
        if (!this.#willOverflowHorizontal(char)) {
            if (this.#isStartingNewWord(char)) lastLine.push('');
            lastLine[lastLine.length-1] += char;
        } else if (!this.#willOverflowVertical()) {
            if (this.#isStartingNewWord(char)) lastLine.push('');
            if (lastLine.length > 1 && (new RegExp('\\S')).test(char)) this.#lines.push([lastLine.pop() + char]);
            else if (lastLine[lastLine.length-1].length > 0) this.#lines.push([char]);
        }
        this.#preRender();
    }

    /** Removes the last character from the label's text. */
    back() {
        const lastLine = this.#lines[this.#lines.length-1];
        lastLine[lastLine.length-1] = lastLine[lastLine.length-1].slice(0, -1);
        this.#trimWord();
        this.#trim();
        this.#preRender();
    }

    /** Clears the label's text. */
    clear() { 
        this.#lines = [['']];
        this.#preRender();
    }

    /** Draw the label at a position.
     *  @param {CanvasRenderingContext2D} context - The context to draw on.
     *  @param {Vector2} pos - The position to draw the label. */
    draw(context, pos) { context.drawImage(this.#textCanvas, pos.x, pos.y); }
}

export default Label;
