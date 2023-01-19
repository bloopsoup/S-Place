import GameObject from '../gameObject.js';
import Vector2 from '../../common/vector2.js';
import MovablePhysics from '../../components/movable/movablePhysics.js';
import Collider from '../../components/collider.js';

export default class Player extends GameObject {
    /** The player character. */

    constructor(maxDimensions, sprite) {
        super(maxDimensions, sprite);
        this.movable = new MovablePhysics(maxDimensions, this.sprite.maxDimensions, new Vector2(0, 200), new Vector2(0, 0), new Vector2(2, 0), new Vector2(0, 0), -20);
        this.collider = new Collider(100);
    }

    handleCollisions(other, buffered) {
        if (this.collider.collides(this.movable, other.movable, buffered)) console.log('PLAYER GOES OUCH');
    }

    handleInputs(inputs) {
        if ('ArrowRight' in inputs) this.movable.incrementVelocity('x', 1);
        else if ('ArrowLeft' in inputs) this.movable.incrementVelocity('x', 2);
        if ('ArrowUp' in inputs) this.movable.jump();
    }

    update(dt) {
        this.dtRunner.deltaTimeUpdate(dt, this.sprite.nextFrameInRow);
        this.movable.update();
    }

    draw(context) { this.sprite.draw(context, this.movable.pos); }
}
