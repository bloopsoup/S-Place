import Displayable from './displayable.js';
import DeltaTimeRunner from '../utils/deltaTimeRunner.js';

export default class Effect extends Displayable {
    /** A one-time pop-up which runs when instantiated. */

    constructor(pos, spritesheetName) {
        super(0, 0, spritesheetName);
        this.pos = pos;
        this.dtRunner = new DeltaTimeRunner(20, 1000);
    }

    update() {
        if (this.spritesheet.onLastFrameInRow()) this.deleteFlag = true;
        else this.dtRunner.deltaTimeUpdate(dt, this.spritesheet.nextFrameInRow); 
    }

    draw(context) { if (!this.deleteFlag) this.spritesheet.draw(context, this.pos); }
}
