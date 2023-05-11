import { Grid, InputTracker, Vector2 } from '../common/index.js';

/** Handles action events that are triggered when something is in a specified location.
 *  @memberof Components */
class ActionMap {
    /** @type {Grid} */
    #grid
    /** @type {Object<string, CallableFunction>} */
    #lookup

    /** Create the CollisionMap.
     *  @param {Grid} grid - The grid specifying the action type of each tile.
     *  @param {Object<string, CallableFunction>} lookup - Mapping between action types and functions. */
    constructor(grid, lookup) { 
        this.#grid = grid;
        this.#lookup = lookup;
    }

    /** Calls the appropiate action handler based on the tile found at the corner.
     *  @param {InputTracker} inputs - The currently tracked inputs.
     *  @param {Vector2} cornerPos - The corner to check. */
    callActionHandler(inputs, cornerPos) {
        const buffer = cornerPos.copy();
        this.#grid.toGridPos(buffer);
        const action = this.#grid.get(buffer);
        this.#lookup[action](inputs);
    }
}

export default ActionMap;
