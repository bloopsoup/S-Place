import GameObject from '../gameObject.js';
import Vector2 from '../../common/vector2.js';
import Movable from '../../components/movable/movable.js';
import Collider from '../../components/collider.js';

export default class Particle extends GameObject {
    /** A moving effect which starts at POS and moves in a direction according to velocity. 
     *  Marks itself for deletion when out of bounds. */

    constructor(maxDimensions, sprite, pos, velocity) {
        super(maxDimensions, sprite);
        this.movable = new Movable(maxDimensions, this.sprite.dimensions, pos, velocity, new Vector2(0, 0), new Vector2(0, 0));
        this.collider = new Collider(50);
    }

    update(dt) {
        this.dtRunner.deltaTimeUpdate(dt, this.sprite.nextFrameInRow);
        this.movable.incrementPos();
        if (this.movable.outOfBoundsComplete()) this.markForDeletion();
    }

    draw(context) { this.sprite.draw(context, this.movable.pos); }
}
