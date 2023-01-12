import GameObject from '../gameObject.js';
import Movable from '../../utils/movable/movable.js';
import CollisionManager from '../../utils/collisionManager.js';

export default class Enemy extends GameObject {
    /** The entities wishing upon your downfall. */

    constructor(gameWidth, gameHeight, sprite) {
        super(gameWidth, gameHeight, sprite);
        const [ width, height ] = this.sprite.getUnitDimensions();
        this.movable = new Movable(gameWidth, gameHeight, width, height, [gameWidth, gameHeight - height], [-8, 0], [0, 0], [0, 0]);
        this.collisionManager = new CollisionManager(100);
    }

    handleCollisions(other, buffered) {
        if (this.collisionManager.collides(this, other, buffered)) console.log('ENEMY GOES OUCH');
    }

    update(dt) {
        this.dtRunner.deltaTimeUpdate(dt, this.sprite.nextFrameInRow);
        this.movable.incrementPos();
        if (this.movable.pastLeftWallComplete()) this.movable.setPosAxis('x', this.gameWidth);
    }

    draw(context) { this.sprite.draw(context, this.movable.getPos()); }
}
