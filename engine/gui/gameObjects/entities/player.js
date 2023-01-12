import GameObject from '../gameObject.js';
import MovablePhysics from '../../utils/movable/movablePhysics.js';
import CollisionManager from '../../utils/collisionManager.js';

export default class Player extends GameObject {
    /** The player character. */

    constructor(gameWidth, gameHeight, spritesheet) {
        super(gameWidth, gameHeight, spritesheet);
        const [ width, height ] = this.spritesheet.getUnitDimensions();
        this.movable = new MovablePhysics(gameWidth, gameHeight, width, height, [0, gameHeight - height], [0, 0], [2, 2], [1, 1], -20);
        this.collisionManager = new CollisionManager(100);
    }

    handleCollisions(other, buffered) {
        if (this.collisionManager.collides(this, other, buffered)) console.log('PLAYER GOES OUCH');
    }

    handleInputs(inputs) {
        if ('ArrowRight' in inputs) this.movable.incrementVelocity('x', 1);
        else if ('ArrowLeft' in inputs) this.movable.incrementVelocity('x', 2);
        if ('ArrowUp' in inputs) this.movable.jump();
    }

    update(dt) {
        this.dtRunner.deltaTimeUpdate(dt, this.spritesheet.nextFrameInRow);
        this.movable.updatePhysics();
    }

    draw(context) { this.spritesheet.draw(context, this.movable.getPos()); }
}
