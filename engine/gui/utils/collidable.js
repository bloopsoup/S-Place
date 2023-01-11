export default class Collidable {
    /** Handles collisions in a one-sided manner by using information from linked
     *  movable components. */

    constructor(movable, callables) { 
        this.movable = movable;
        this.callables = callables; 
        this.maxTicks = 100; this.currentTicks = 0; 
    }

    getCallable(trigger) { return this.callables[trigger]; }

    collidesWith(other) {
        const thisPos = this.movable.getPos(), thisDim = this.movable.getDimensions();
        const otherPos = other.movable.getPos(), otherDim = other.movable.getDimensions();
        return thisPos[0] < otherPos[0] + otherDim[0] && thisPos[0] + thisDim[0] > otherPos[0] &&
               thisPos[1] < otherPos[1] + otherDim[1] && thisPos[1] + thisDim[1] > otherPos[1]
    }

    runTrigger(other, trigger) {
        if (this.collidesWith(other)) {
            this.getCallable(trigger)(); 
            other.getCallable(trigger)();
        }
    }
    runBufferedTrigger(other, trigger) {
        if (this.collidesWith(other) && this.currentTicks == 0) { 
            this.currentTicks = this.maxTicks; 
            this.getCallable(trigger)(); 
            other.getCallable(trigger)();
        
        } 
        if (this.currentTicks > 0) this.currentTicks--;
    }
}
