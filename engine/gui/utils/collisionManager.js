export default class CollisionManager {
    /** Handles buffered and instant collisions between two gameObjects. */

    constructor(intangibilityTicks) {
        this.currentTicks = 0; 
        this.intangibilityTicks = intangibilityTicks;
    }

    overlaps(a, b) {
        const thisPos = a.movable.getPos(), thisDim = a.movable.getDimensions();
        const otherPos = b.movable.getPos(), otherDim = b.movable.getDimensions();
        return thisPos[0] < otherPos[0] + otherDim[0] && thisPos[0] + thisDim[0] > otherPos[0] &&
               thisPos[1] < otherPos[1] + otherDim[1] && thisPos[1] + thisDim[1] > otherPos[1]
    }

    collides(a, b, buffered) {
        if (this.currentTicks > 0) this.currentTicks--;
        if (!this.overlaps(a, b)) return false;
        if (!buffered) return true;
        if (this.currentTicks == 0) { this.currentTicks = this.intangibilityTicks; return true; } 
        return false;
    }
}
