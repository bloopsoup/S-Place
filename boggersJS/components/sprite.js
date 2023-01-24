import Vector2 from '../common/vector2.js';

export default class Sprite {
    /** The Sprite class provides methods for displaying the proper frames from an
     *  underlying spritesheet. 
     * 
     *  The sheet itself is arranged according to GRIDFORMAT, a list where an index i 
     *  represents the ith row and the number at that index tells you the amount of 
     *  frames present in that row.
     * 
     *  It has two modes you can use to iterate through frames.
     *  1) ROW MODE
     *     Iterate over and over along one row of frames and switch rows conditionally. 
     *  2) GRID MODE
     *     Freestyle -- anything goes. */

    #image
    #dimensions
    #gridFormat
    #frame

    constructor(name, dimensions, gridFormat) {
        this.#image = document.getElementById(name);
        this.#dimensions = dimensions;
        this.#gridFormat = gridFormat;
        this.#frame = new Vector2(0, 0);

        this.nextFrameInRow = this.nextFrameInRow.bind(this);
        this.nextFrame = this.nextFrame.bind(this);
    }

    get dimensions() { return this.#dimensions.copy(); }
    get frame() { return this.#frame.copy(); }

    set frame(frame) { this.#frame = frame; }
    set row(row) { this.#frame.y = row; }

    onLastRow() { return this.#frame.y >= this.#gridFormat.length - 1; }
    onLastFrameInRow() { return this.#frame.x >= this.#gridFormat[this.#frame.y] - 1; }
    onLastFrame() { return this.onLastFrameInRow() && this.onLastRow(); }

    nextFrameInRow() {
        if (this.onLastFrameInRow()) this.#frame.x = 0;
        else this.#frame.x++;
    }
    nextFrame() {
        if (this.onLastFrameInRow()) {
            this.#frame.x = 0;
            if (this.onLastRow()) this.#frame.y = 0;
            else this.#frame.y++;
        } else { this.#frame.x++; }
    }

    drawFrame(context, pos, frame) {
        context.drawImage(this.#image, frame.x * this.#dimensions.x, frame.y * this.#dimensions.y, 
            this.#dimensions.x, this.#dimensions.y, pos.x, pos.y, this.#dimensions.x, this.#dimensions.y);
    }
    draw(context, pos) {
        context.drawImage(this.#image, this.#frame.x * this.#dimensions.x, this.#frame.y * this.#dimensions.y, 
            this.#dimensions.x, this.#dimensions.y, pos.x, pos.y, this.#dimensions.x, this.#dimensions.y);
    }
}
