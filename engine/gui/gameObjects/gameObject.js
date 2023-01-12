import DeltaTimeRunner from '../utils/deltaTimeRunner.js';

export default class GameObject {
    /** All game objects can handle inputs, update their own
     *  state, and draw themselves on the screen. */

    constructor(gameWidth, gameHeight, sprite) {
        this.gameWidth = gameWidth, this.gameHeight = gameHeight;
        this.poolHook = null, this.deleteFlag = false;
    
        this.sprite = sprite;
        this.dtRunner = new DeltaTimeRunner(20, 1000);
        this.movable = null, this.collisionManager = null;
    }

    setPoolHook(hook) { this.poolHook = hook; }
    canDelete() { return this.deleteFlag; }
    setDelete() { this.deleteFlag = true; }

    handleCollisions(other, buffered) {}

    handleInputs(inputs) {}

    update(dt) {}

    draw(context) { throw new Error('Implement!'); }
}
