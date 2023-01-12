import GameObject from '../gameObject.js';

export default class Effect extends GameObject {
    /** A pop-up appearing at POS. Marks itself for deletion when it finishes its animation. */

    constructor(pos, sprite) {
        super(0, 0, sprite);
        this.pos = pos;
    }

    update(dt) {
        if (this.spritesheet.onLastFrameInRow()) this.setDelete();
        else this.dtRunner.deltaTimeUpdate(dt, this.sprite.nextFrameInRow); 
    }

    draw(context) { if (!this.deleteFlag) this.sprite.draw(context, this.pos); }
}
