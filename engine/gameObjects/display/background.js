import GameObject from '../gameObject.js';
import MovableBG from '../../components/movable/movableBG.js';

export default class Background extends GameObject {
    /** An infinitely scrolling background. Velocity is used to indicate a cardinal
     *  direction of the moving background. */

    constructor(maxDimensions, sprite, velocity) {
        super(maxDimensions, sprite);
        this.movable = new MovableBG(maxDimensions, this.sprite.dimensions, velocity);
    }

    update(dt) {
        this.movable.update();
    }

    draw(context) {
        this.sprite.draw(context, this.movable.pos);
        this.sprite.draw(context, this.movable.nextPos);
    }
}
