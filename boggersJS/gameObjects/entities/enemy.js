import GameObject from '../gameObject.js';
import Vector2 from '../../common/vector2.js';
import Movable from '../../components/movable/movable.js';
import Collider from '../../components/collider.js';

export default class Enemy extends GameObject {
    /** The entities wishing upon your downfall. */

    constructor(maxDimensions, sprite) {
        super(maxDimensions, sprite);
        this.movable = new Movable(maxDimensions, this.sprite.dimensions, new Vector2(1000, 200), new Vector2(-8, 0), new Vector2(0, 0), new Vector2(0, 0));
        this.collider = new Collider(100);
    }

    handleCollisions(other, buffered) {
        if (this.collider.collides(this.movable, other.movable, buffered)) console.log('ENEMY GOES OUCH');
    }

    update(dt) {
        this.dtRunner.deltaTimeUpdate(dt, this.sprite.nextFrameInRow);
        this.movable.incrementPos();
        if (this.movable.pastLeftWallComplete()) this.movable.velocity = new Vector2(8, 0);
        if (this.movable.pastRightWallComplete()) this.movable.velocity = new Vector2(-8, 0);
    }

    draw(context) { this.sprite.draw(context, this.movable.pos); }
}
