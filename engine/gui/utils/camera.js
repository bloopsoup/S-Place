export default class Camera {
    /** Based on width, height, and position given by an attached anchor, this object
     *  provides offsets for the canvas context. This results in a camera effect which
     *  focuses on the anchor. */

    constructor(width, height, anchor, mode, thresholds = null) {
        this.width = width, this.height = height;
        this.anchor = anchor;
        this.mode = mode;
        this.thresholds = thresholds;
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

    hybridOffset() {
       const [ anchorX, anchorY ] = this.anchor.movable.getPos();
       const [ anchorWidth, anchorHeight ] = this.anchor.movable.getDimensions();

       const adjustX = ((this.width - anchorWidth) / 2) / (this.thresholds[0]) * anchorX;
       const adjustX2 = ((this.width - anchorWidth) / 2) / (this.thresholds[1]) * Math.max(0, anchorX - 2500);
       const ate = Math.min(this.horizontalOffset('left') + adjustX, this.horizontalOffset(''));
       const ate2 = Math.min(ate + adjustX2, this.horizontalOffset('right'));
       return [ate2, this.height - anchorHeight - anchorY];
    }

    getOffset() {
        switch (this.mode) {
            case 'LU': return [this.horizontalOffset('left'), this.verticalOffset('up')];
            case 'LD': return [this.horizontalOffset('left'), this.verticalOffset('down')];
            case 'LC': return [this.horizontalOffset('left'), this.verticalOffset('')];
            case 'RU': return [this.horizontalOffset('right'), this.verticalOffset('up')];
            case 'RD': return [this.horizontalOffset('right'), this.verticalOffset('down')];
            case 'RC': return [this.horizontalOffset('right'), this.verticalOffset('')];
            case 'CU': return [this.horizontalOffset(''), this.verticalOffset('up')];
            case 'CD': return [this.horizontalOffset(''), this.verticalOffset('down')];
            case 'CC': return [this.horizontalOffset(''), this.verticalOffset('')];
            default: return this.hybridOffset();
        }
    }
}
