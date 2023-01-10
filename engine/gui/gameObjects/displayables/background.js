import GameObject from '../gameObject.js';
import MovableBG from '../../utils/movable/movableBG.js';

export default class Background extends GameObject {
    /** An infinitely scrolling background. Velocity is used to indicate a cardinal
     *  direction of the moving background. */

    constructor(gameWidth, gameHeight, spritesheet, onDelete, velocity) {
        super(gameWidth, gameHeight, spritesheet, onDelete);
        const [ width, height ] = this.spritesheet.getUnitDimensions();
        this.movable = new MovableBG(gameWidth, gameHeight, width, height, velocity)
        this.movable.resetPos();
    }

    update(dt) {
        this.movable.incrementPos();
        if (this.movable.outOfBoundsComplete()) this.movable.resetPos();
    }

    draw(context) {
        this.spritesheet.draw(context, this.movable.getPos());
        this.spritesheet.draw(context, this.movable.getNextPos())
    }
}
