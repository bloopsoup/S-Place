import GameObject from '../gameObject.js';
import { Vector2 } from '../../common/index.js';
import { Movable, Sprite } from '../../components/index.js';

/** A static image. 
 *  @augments GameObject 
 *  @memberof GameObjects.Display */
class Static extends GameObject {
    /** @type {Vector2} */
    #pos

    /** Create the static image.
     *  @param {Sprite} sprite - The image itself.
     *  @param {Vector2} pos - The position of the image. */
    constructor(sprite, pos) {
        super(sprite);
        this.#pos = pos;
    }

    /** Draw the object.
     *  @see GameObject.draw
     *  @param {CanvasRenderingContext2D} context */
    draw(context) { this.sprite.draw(context, this.#pos); }
}

export default Static;
