import Vector2 from "./vector2.js";

/** A 2D grid that stores elements. Used to implement many types of maps
 *  such as collision maps or tile maps.
 *  @memberof Common */
class Grid {
    /** @type {Vector2} */
    #unitDimensions
    /** @type {Vector2} */
    #dimensions
    /** @type {Array<Array<any>>} */
    #grid

    /** Create the Grid.
     *  @param {Vector2} unitDimensions - The dimensions of each square.
     *  @param {Array<Array<any>>} grid - A 2D array. */
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
     *  @returns {any} The element at that position. */
    get(pos) { 
        return this.#grid[Math.max(Math.min(pos.y, this.#grid.length - 1), 0)][Math.max(Math.min(pos.x, this.#grid[0].length - 1), 0)]; 
    }

    /** Apply a function to each element in the grid.
     *  @param {function(Vector2, any): void} func - The function applied to each element in the grid. 
     *  @param {boolean} useRealPos - Whether to convert the grid position into a real position.
     *  @example <caption>Using the Grid's forEach function.</caption>
     *  // Create a 2 x 2 Grid.
     *  const grid = new Grid(new Vector2(10, 10), [[2, 2], [2, 2]]);
     *  // Using the Grid's forEach function.
     *  grid.forEach((pos, element) => console.log(`Position: (${pos.x}, ${pos.y}) Element: ${element}`), false); */
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
     *  @returns {Vector2} The unit dimensions of the grid. */
    get unitDimensions() { return this.#unitDimensions.copy(); }

    /** Get the total dimensions of the grid.
      * @returns {Vector2} The dimensions of the grid. */
    get dimensions() { return this.#dimensions.copy(); }

    /** Convert a real position to the grid position.
     *  @param {Vector2} realPos - The real position.
     *  @returns {Vector2} The grid position. */
    toGridPos(realPos) { return realPos.floorDivCopy(this.#unitDimensions); }

    /** Convert a grid position to the real position.
     *  @param {Vector2} gridPos - The grid position.
     *  @returns {Vector2} The real position. */
    toRealPos(gridPos) { return gridPos.mulCopy(this.#unitDimensions); }
}

export default Grid;
