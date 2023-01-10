import GameObject from '../gameObject.js';

export default class Effect extends GameObject {
    /** A pop-up appearing at POS. Marks itself for deletion when it finishes its animation. */

    constructor(pos, spritesheet, onDelete) {
        super(0, 0, spritesheet, onDelete);
        this.pos = pos;
    }

    update(dt) {
        if (this.spritesheet.onLastFrameInRow()) this.setDelete();
        else this.dtRunner.deltaTimeUpdate(dt, this.spritesheet.nextFrameInRow); 
    }

    draw(context) { if (!this.deleteFlag) this.spritesheet.draw(context, this.pos); }
}
