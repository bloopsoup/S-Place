import GameObject from '../gameObject.js';
import Movable from '../../utils/movable/movable.js';
import Collidable from '../../utils/collidable.js';

export default class Particle extends GameObject {
    /** A moving effect which starts at POS and moves in a direction according to velocity. 
     *  Marks itself for deletion when out of bounds. */

    constructor(gameWidth, gameHeight, spritesheet, pos, velocity) {
        super(gameWidth, gameHeight, spritesheet);
        const [ width, height ] = this.spritesheet.getUnitDimensions();
        this.movable = new Movable(gameWidth, gameHeight, width, height, pos, velocity, [0, 0], [0, 0]);
        this.collidable = new Collidable(this.movable, {})
    }

    update(dt) {
        this.dtRunner.deltaTimeUpdate(dt, this.spritesheet.nextFrameInRow); 
        if (this.movable.outOfBoundsComplete()) this.setDelete();
    }

    draw(context) { if (!this.deleteFlag) this.spritesheet.draw(context, this.pos); }
}
