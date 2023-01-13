export default class Camera {
    /** A window that follows an anchor. This window is defined by a width,
     *  a height, and a position given by the attached anchor. */

    constructor(width, height, anchor, mode) {
        this.width = width, this.height = height;
        this.anchor = anchor;
        this.mode = mode;
    }

    horizontalOffset(mode) {
        const anchorX = this.anchor.movable.getPos()[0];
        const anchorWidth = this.anchor.movable.getDimensions()[0];
        switch (mode) {
            case 'left': return -anchorX;
            case 'right': return this.width - anchorWidth - anchorX;
            default: return ((this.width - anchorWidth) / 2) - anchorX;
        }
    }

    verticalOffset(mode) {
        const anchorY = this.anchor.movable.getPos()[1];
        const anchorHeight = this.anchor.movable.getDimensions()[1];
        switch (mode) {
            case 'up': return -anchorY;
            case 'down': return this.height - anchorHeight - anchorY;
            default: return ((this.height - anchorHeight) / 2) - anchorY;
        }
    }

    getOffset() {
        switch (this.mode) {
            case 'LU': return [this.horizontalOffset('left'), this.verticalOffset('up')];
            case 'LD': return [this.horizontalOffset('left'), this.verticalOffset('down')];
            case 'LC': return [this.horizontalOffset('left'), this.verticalOffset('')];
            case 'RU': return [this.horizontalOffset('right'), this.verticalOffset('up')];
            case 'RD': return [this.horizontalOffset('right'), this.verticalOffset('down')];
            case 'RC': return [this.horizontalOffset('right'), this.verticalOffset('')];
            case 'CU': return [this.horizontalOffset('center'), this.verticalOffset('up')];
            case 'CD': return [this.horizontalOffset('center'), this.verticalOffset('down')];
            default: return [this.horizontalOffset(''), this.verticalOffset('')];
        }
    }
}
