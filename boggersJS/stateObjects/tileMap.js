import { Vector2 } from '../common/index.js';
import { Sprite } from '../components/index.js';

/** A 2D-grid that handles drawing tiles. 
 *  @memberof StateObjects */
class TileMap {
    /** @type {Vector2} */
    #unitDimensions
    /** @type {Array<Array<number>>} */
    #grid
    /** @type {Sprite} */
    #sprite

    /** Create the TileMap.
     *  @param {Vector2} unitDimensions - The dimensions of each tile. 
     *  @param {Array<Array<number>>} grid - A 2D array where each number denotes the art for each tile.
     *  @param {Sprite} sprite - The tile sheet to represent different types of tiles. */
    constructor(unitDimensions, grid, sprite) {
        this.#unitDimensions = unitDimensions;
        this.#grid = grid;
        this.#sprite = sprite;
    }

    /** Convert a real position to the grid position.
     *  @param {Vector2} realPos - The real position. 
     *  @return {Vector2} The grid position. */
    toGridPos(realPos) { return realPos.floorDivCopy(this.#unitDimensions); }

    /** Convert a grid position to the real position.
     * @param {Vector2} gridPos - The grid position.
     * @returns {Vector2} The real position. */
    toRealPos(gridPos) { return gridPos.mulCopy(this.#unitDimensions); }

    /** Converts a tile type into a spritesheet frame.
     *  @param {number} symbol - The tile type.
     *  @returns {Vector2} The spritesheet frame corresponding to the tile type. */
    toFrame(symbol) {
        switch (symbol) {
            case "^^^": return new Vector2(2, 0);
            case "___": return new Vector2(2, 2);
            case "|  ": return new Vector2(1, 1);
            case "  |": return new Vector2(3, 1);
            case "===": return new Vector2(2, 3);
            case "|^^": return new Vector2(1, 0);
            case "^^|": return new Vector2(3, 0);
            case "|__": return new Vector2(1, 2);
            case "__|": return new Vector2(3, 2);
            case "| |": return new Vector2(2, 4);
            case "|==": return new Vector2(1, 3);
            case "==|": return new Vector2(3, 3);
            case "|^|": return new Vector2(3, 4);
            case "|_|": return new Vector2(1, 4);
            case "XXX": return new Vector2(2, 1);
            case "_-^": return new Vector2(0, 2);
            case "^-_": return new Vector2(0, 0);
            default: return new Vector2(0, 0);
        }
    }

    /** Draw the TileMap.
     *  @param {CanvasRenderingContext2D} context - The context to draw on. */
    draw(context) {
        for (let i in this.#grid) {
            for (let j in this.#grid[i]) {
                if (this.#grid[i][j] === "   ")
                    continue;
                this.#sprite.drawFrame(context, this.toRealPos(new Vector2(j, i)), this.toFrame(this.#grid[i][j]));
            }
        }
    }
}

export default TileMap;
