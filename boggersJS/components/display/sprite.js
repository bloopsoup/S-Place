import { Vector2 } from '../../common/index.js';
import TickRunner from '../tick-runner.js';

/** The Sprite class provides methods for displaying the proper frames from an
 *  underlying spritesheet. It has two modes you can use to iterate through frames.
 *  1) ROW MODE: Iterate over and over along one row of frames and switch rows conditionally. 
 *  2) GRID MODE: Freestyle -- anything goes. 
 *  @memberof Components.Display */
class Sprite {
    /** @type {HTMLImageElement} */
    #image
    /** @type {Vector2} */
    #dimensions
    /** @type {Array<number>} */
    #gridFormat
    /** @type {Vector2} */
    #frame
    /** @type {TickRunner} */
    #runner

    /** Create the Sprite.
     *  @param {HTMLImageElement} image - The HTML image element.
     *  @param {Vector2} dimensions - The dimensions of each frame in the spritesheet.
     *  @param {Array<number>} gridFormat - A list where index i is the ith row and the number is the frames present in that row.
     *  @param {number} ticks - The number of ticks per frame.
     *  @example <caption>Creating a Sprite.</caption>
     *  // Create a Sprite by loading an image element called 'test' where each frame is 80x80px.
     *  // [1, 4, 2] means: 1st row has 1 frame, 2nd row has 4 frames, 3rd row has 2 frames.
     *  const sprite = new Sprite('test', new Vector2(80, 80), [1, 4, 2]); */
    constructor(image, dimensions, gridFormat, ticks = 8) {
        this.#image = image;
        this.#dimensions = dimensions;
        this.#gridFormat = gridFormat;
        this.#frame = new Vector2(0, 0);
        this.#runner = new TickRunner(ticks, () => this.nextFrameInRow());
    }

    /** Get a copy of the sprite's dimensions.
     *  @returns {Vector2} The sprite's dimensions. */
    get dimensions() { return this.#dimensions.copy(); }

    /** Get a copy of the current frame.
     *  @returns {Vector2} The current frame. */
    get frame() { return this.#frame.copy(); }

    /** Sets the current frame.
     *  @param {Vector2} frame - The new frame. */
    set frame(frame) { this.#frame = frame; }

    /** Sets the current row.
     *  @param {number} row - The new row. */    
    set row(row) { this.#frame.x = 0; this.#frame.y = row; }

    /** Sets the current row, WITHOUT resetting frameX. 
     *  @param {number} row - The new row. */
    set row_continue(row) { this.#frame.y = row; }

    /** Check if the current frame is on the last row.
     *  @returns {boolean} The result. */
    onLastRow() { return this.#frame.y >= this.#gridFormat.length - 1; }

    /** Check if the current frame is the last one in its current row.
     *  @returns {boolean} The result. */
    onLastFrameInRow() { return this.#frame.x >= this.#gridFormat[this.#frame.y] - 1; }

    /** Check if the current frame is the last frame of the spritesheet.
     *  @returns {boolean} The result. */
    onLastFrame() { return this.onLastFrameInRow() && this.onLastRow(); }

    /** Move on to the next frame in the current row. If it reaches the end, loop over. */
    nextFrameInRow() {
        if (this.onLastFrameInRow()) this.#frame.x = 0;
        else this.#frame.x++;
    }

    /** Move on to the next frame in the spritesheet. If it reaches the end, loop over. */
    nextFrame() {
        if (this.onLastFrameInRow()) {
            this.#frame.x = 0;
            if (this.onLastRow()) this.#frame.y = 0;
            else this.#frame.y++;
        } else { this.#frame.x++; }
    }

    /** Advances the frame if enough time has passed. */
    updateFrame() { this.#runner.update(); }

    /** Draw a sprite from the desired frame at a position.
     *  @param {CanvasRenderingContext2D} context - The context to draw on.
     *  @param {Vector2} pos - The position to draw the sprite. 
     *  @param {Vector2} frame - The desired frame to draw. */
    drawFrame(context, pos, frame) {
        context.drawImage(this.#image, frame.x * this.#dimensions.x, frame.y * this.#dimensions.y, 
            this.#dimensions.x, this.#dimensions.y, Math.floor(pos.x), Math.floor(pos.y), this.#dimensions.x, this.#dimensions.y);
    }

    /** Draw a sprite from the current frame at a position rotated around a point.
     *  @param {CanvasRenderingContext2D} context - The context to draw on.
     *  @param {Vector2} pos - The position to draw the sprite.
     *  @param {Vector2} rotatePos - The position of the point in which the sprite
     *     is rotated around. Note that the position is RELATIVE to the position
     *     to draw the sprite.
     *  @param {number} angle - The angle of rotation in radians. */
    drawRotated(context, pos, rotatePos, angle) {
        context.save();
        context.translate(pos.x + rotatePos.x, pos.y + rotatePos.y);
        context.rotate(angle);
        context.drawImage(this.#image, this.#frame.x * this.#dimensions.x, this.#frame.y * this.#dimensions.y, 
            this.#dimensions.x, this.#dimensions.y, -rotatePos.x, -rotatePos.y, this.#dimensions.x, this.#dimensions.y);
        context.restore();
    }

    /** Draw a sprite from the current frame at a position.
     *  @param {CanvasRenderingContext2D} context - The context to draw on.
     *  @param {Vector2} pos - The position to draw the sprite. */
    draw(context, pos) {
        context.drawImage(this.#image, this.#frame.x * this.#dimensions.x, this.#frame.y * this.#dimensions.y, 
            this.#dimensions.x, this.#dimensions.y, Math.floor(pos.x), Math.floor(pos.y), this.#dimensions.x, this.#dimensions.y);
    }
}

export default Sprite;
