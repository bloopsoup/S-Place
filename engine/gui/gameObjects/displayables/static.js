import GameObject from '../gameObject.js';

export default class Static extends GameObject {
    /** A static image. */

    constructor(pos, spritesheet) {
        super(0, 0, spritesheet, null);
        this.pos = pos;
    }

    draw(context) { if (!this.deleteFlag) this.spritesheet.draw(context, this.pos); }
}
