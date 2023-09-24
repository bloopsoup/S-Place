import { Vector2 } from '../common/index.js';

/** A container of settings meant to be accessible from any state.
 *  @memberof Core */
class Settings {
    /** @type {Vector2} */
    #canvasDimensions

    /** Create a new state object. 
     *  @param {Vector2} canvasDimensions - The canvas dimensions. */
    constructor(canvasDimensions) {
        this.#canvasDimensions = canvasDimensions; 
    }

    /** Gets the canvas dimensions that the state operates in.
     *  @return {Vector2} The canvas dimensions. */
    get canvasDimensions() { return this.#canvasDimensions; }
}

export default Settings;
