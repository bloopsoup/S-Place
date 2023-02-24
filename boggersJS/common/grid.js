import Vector2 from "./vector2.js";

/** A 2D grid that stores numbers. Used to implement many types of maps
 *  such as collision maps or tile maps.
 *  @memberof Common */
class Grid {
    /** @type {Vector2} */
    #unitDimensions
    /** @type {Vector2} */
    #dimensions
    /** @type {Array<Array<number>>} */
    #grid

    /** Create the Grid.
     *  @param {Vector2} unitDimensions - The dimensions of each square.
     *  @param {Array<Array<number>>} grid - A 2D array. */
    constructor(unitDimensions, grid) {
        this.#unitDimensions = unitDimensions;
        this.#dimensions = new Vector2(grid[0].length * this.#unitDimensions.x, grid.length * this.#unitDimensions.y);
        this.#grid = grid;
    }

    /** Access an element of the grid at a position. If an index is too
     *  big, defaults to accessing the last element of the column or row.
     *  If the index is too small, defaults to accessing the first element
     *  of the column or row.
     *  @param {Vector2} pos - The position of the accessed element.
     *  @returns {number} The number at that position. */
    get(pos) { 
        return this.#grid[Math.max(Math.min(pos.y, this.#grid.length - 1), 0)][Math.max(Math.min(pos.x, this.#grid[0].length - 1), 0)]; 
    }

    /** Apply a function to each element in the grid. The function signature 
     *  should be as follows: FUNC(pos: Vector2, element: number)
     *  @param {CallableFunction} func - The function applied to each element in the grid. 
     *  @param {boolean} useRealPos - Whether to convert the grid position into a real position. */
    forEach(func, useRealPos) {
        const pos = new Vector2(0, 0);
        for (let i in this.#grid) {
            for (let j in this.#grid[i]) {
                pos.setBoth(Number(j), Number(i));
                if (useRealPos) this.toRealPos(pos);
                func(pos, this.#grid[i][j]);
            }
        }
    }

    /** Get the unit dimensions of the grid.
     *  @return {Vector2} The unit dimensions of the grid. */
    get unitDimensions() { return this.#unitDimensions; }

    /** Get the total dimensions of the grid.
      * @return {Vector2} The dimensions of the grid. */
    get dimensions() { return this.#dimensions; }

    /** Convert a real position to the grid position.
     *  @param {Vector2} realPos - The real position. */
    toGridPos(realPos) { realPos.floorDiv(this.#unitDimensions); }

    /** Convert a grid position to the real position.
     *  @param {Vector2} gridPos - The grid position. */
    toRealPos(gridPos) { gridPos.mul(this.#unitDimensions); }
}

export default Grid;
