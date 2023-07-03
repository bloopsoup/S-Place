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
    /** @type {string} */
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
        this.#text = text;
        this.#preRender();
    }

    /** Gets the label's text.
     *  @return {string} The text. */
    get text() { return this.#text; }

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

    /** Renders the text onto the internal canvas. This is to avoid rendering text
     *  multiple times if the text never changes. */
    #preRender() {
        this.#textContext.clearRect(0, 0, this.#textCanvas.width, this.#textCanvas.height);
        const fontAscent = Math.abs(this.#textContext.measureText('M').actualBoundingBoxAscent);
        this.#textContext.fillText(this.#text, this.#padding.x, this.#padding.y + fontAscent);
    }

    /** Determines whether adding char will make the text go past its boundaries.
     *  @param {string} char - The character that will be added. 
     *  @returns {boolean} The result. */
    #willOverflow(char) {
        const textLength = this.#textContext.measureText(this.#text + char).width;
        return textLength + this.#padding.x >= this.#textCanvas.width - this.#padding.x;
    }

    /** Adds a character to the label's text.
     *  @param {string} char - The character to add to the label.
     *  @param {boolean} check - Whether to check for overflow before adding the character. */
    add(char, check) {
        if (check && this.#willOverflow(char)) return;
        this.#text += char;
        this.#preRender();
    }

    /** Removes the last character from the label's text. */
    back() {
        this.#text = this.#text.slice(0, -1);
        this.#preRender();
    }

    /** Clears the label's text. */
    clear() { 
        this.#text = '';
        this.#preRender();
    }

    /** Draw the label at a position.
     *  @param {CanvasRenderingContext2D} context - The context to draw on.
     *  @param {Vector2} pos - The position to draw the label. */
    draw(context, pos) { context.drawImage(this.#textCanvas, pos.x, pos.y); }
}

export default Label;
