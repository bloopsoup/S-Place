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
        this.#text = [[text]];
        this.#preRender();
    }

    /** Gets the label's first line of text.
     *  @return {string} The text. */
    get text() { return this.#text[0].join(' '); }

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
        this.#textCanvas.width = metric.width, this.#textCanvas.height = metric.actualBoundingBoxAscent + metric.actualBoundingBoxDescent;
    }

    /** Determines whether adding char will make the text go past its horizontal boundaries.
     *  @param {string} char - The character that will be added. 
     *  @returns {boolean} The result. */
    #willOverflowHorizontal(char) {
        const metric = this.#textContext.measureText(this.#text[this.#text.length-1].join(' ') + char);
        const textLength = metric.width + this.#padding.x;
        return textLength >= this.#textCanvas.width - this.#padding.x;
    }
    
    /** Determines whether adding a new line will make the text go past its vertical boundaries.
     *  @returns {boolean} The result. */
    #willOverflowVertical() {
        const metric = this.#textContext.measureText('M');
        const textHeight = (this.#text.length + 1) * (metric.actualBoundingBoxAscent + metric.actualBoundingBoxDescent + this.#padding.y);
        return textHeight >= this.#textCanvas.height - this.#padding.y;
    }

    /** Removes the last word (and last line if needed) so that the new last word of the text
     *  is non-empty. */
    #trim() {
        const lastLine = this.#text[this.#text.length-1]
        const lastWord = lastLine[lastLine.length-1]
        if (lastWord.length === 0) lastLine.pop();
        if (lastLine.length === 0) this.#text.pop();
    }

    /** Renders the text onto the internal canvas. This is to avoid rendering text
     *  multiple times if the text never changes. */
    #preRender() {
        this.#textContext.clearRect(0, 0, this.#textCanvas.width, this.#textCanvas.height);
        const metric = this.#textContext.measureText('M');
        const textHeight = metric.actualBoundingBoxAscent + metric.actualBoundingBoxDescent;
        const fontAscent = Math.abs(this.#textContext.measureText('M').actualBoundingBoxAscent);
        for (let i = 0; i < this.#text.length; i++) {
            this.#textContext.fillText(this.#text[i].join(' '), this.#padding.x, this.#padding.y + fontAscent + (i * textHeight));
        }
    }

    /** Adds a character to the label's text.
     *  @param {string} char - The character to add to the label. */
    add(char) {
        const lastLine = this.#text[this.#text.length-1];
        if (char === ' ') lastLine.push('');
        else if (!this.#willOverflowHorizontal(char)) lastLine[lastLine.length-1] += char;
        else if (!this.#willOverflowVertical()) this.#text.push([lastLine.pop() + char]);
        this.#preRender();
    }

    /** Removes the last character from the label's text. */
    back() {
        if (this.#isEmpty()) return;
        this.#trim();
        const lastLine = this.#text[this.#text.length-1];
        lastLine[lastLine.length-1] = lastLine[lastLine.length-1].slice(0, -1);
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
