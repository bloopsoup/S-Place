import GameObject from '../gameObject.js';

export default class Static extends GameObject {
    /** A static image. */

    constructor(pos, sprite) {
        super(0, 0, sprite);
        this.pos = pos;
    }

    draw(context) { if (!this.deleteFlag) this.sprite.draw(context, this.pos); }
}
