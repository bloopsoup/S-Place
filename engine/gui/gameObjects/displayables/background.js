import GameObject from '../gameObject.js';
import MovableBG from '../../utils/movable/movableBG.js';

export default class Background extends GameObject {
    /** An infinitely scrolling background. Velocity is used to indicate a cardinal
     *  direction of the moving background. */

    constructor(gameWidth, gameHeight, sprite, velocity) {
        super(gameWidth, gameHeight, sprite);
        const [ width, height ] = this.sprite.getUnitDimensions();
        this.movable = new MovableBG(gameWidth, gameHeight, width, height, velocity)
        this.movable.resetPos();
    }

    update(dt) {
        this.movable.incrementPos();
        if (this.movable.outOfBoundsComplete()) this.movable.resetPos();
    }

    draw(context) {
        this.sprite.draw(context, this.movable.getPos());
        this.sprite.draw(context, this.movable.getNextPos())
    }
}
