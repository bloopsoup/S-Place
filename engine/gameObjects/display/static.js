import GameObject from '../gameObject.js';
import Vector2 from '../../common/vector2.js';
import Movable from '../../components/movable/movable.js';

export default class Static extends GameObject {
    /** A static image. */

    constructor(maxDimensions, sprite, pos) {
        super(maxDimensions, sprite);
        this.movable = new Movable(maxDimensions, this.sprite.dimensions, pos, new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0));
    }

    draw(context) { this.sprite.draw(context, this.movable.pos); }
}
