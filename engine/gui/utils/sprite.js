export default class Sprite {
    /** Spritesheet providing methods for displaying the proper frames. It has two 
     *  modes you can use to iterate through frames.
     *  1) ROW MODE: if your animations each take up one row. 
     *  2) GRID MODE: if your animations don't follow the above format.*/

    constructor(imageName, unitWidth, unitHeight, format) {
        this.image = document.getElementById(imageName);
        this.unitWidth = unitWidth, this.unitHeight = unitHeight;
        this.frame = [0, 0], this.format = format;

        this.nextFrameInRow = this.nextFrameInRow.bind(this);
        this.nextFrame = this.nextFrame.bind(this);
    }

    getUnitDimensions() { return [this.unitWidth, this.unitHeight]; }

    setFrameAxis(axis, i) { this.frame[(axis === 'x' ? 0 : 1)] = i; }
    setFrame(frame) { this.frame = frame; }

    onLastFrameInRow() { return this.frame[0] >= this.format[this.frame[1]] - 1; }
    nextFrameInRow() {
        if (this.frame[0] >= this.format[this.frame[1]] - 1) this.frame[0] = 0;
        else this.frame[0]++;
    }

    onLastFrame() { return this.frame[0] >= this.format[this.frame[1]] - 1 && this.frame[1] >= this.format.length - 1; }
    nextFrame() {
        if (this.frame[0] >= this.format[this.frame[1]] - 1) { 
            this.frame[0] = 0;
            if (this.frame[1] >= this.format.length - 1) this.frame[1] = 0;
            else this.frame[1]++;
        } else { 
            this.frame[0]++; 
        }
    }

    draw(context, pos) {
        context.drawImage(this.image, this.frame[0] * this.unitWidth, this.frame[1] * this.unitHeight, 
            this.unitWidth, this.unitHeight, pos[0], pos[1], this.unitWidth, this.unitHeight);
    }
}
