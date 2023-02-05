import { Grid, Vector2 } from '../common/index.js';
import { Sprite } from '../components/index.js';

/** A 2D-grid that handles drawing tiles. 
 *  @memberof StateObjects */
class TileMap {
    /** @type {Grid} */
    #grid
    /** @type {Sprite} */
    #sprite

    /** Create the TileMap.
     *  @param {Grid} grid - A grid where each number denotes the art for each tile.
     *  @param {Sprite} sprite - The tile sheet to represent different types of tiles. */
    constructor(grid, sprite) {
        this.#grid = grid;
        this.#sprite = sprite;
    }

    /** Converts a tile type into a spritesheet frame.
     *  @param {number} symbol - The tile type.
     *  @returns {Vector2} The spritesheet frame corresponding to the tile type. */
    toFrame(symbol) {
        switch (symbol) {
            case 1 : return new Vector2(2, 0);
            case 2 : return new Vector2(2, 2);
            case 3 : return new Vector2(1, 1);
            case 4 : return new Vector2(3, 1);
            case 5 : return new Vector2(2, 3);
            case 6 : return new Vector2(4, 0);
            case 7 : return new Vector2(5, 0);
            case 8 : return new Vector2(4, 2);
            case 9 : return new Vector2(5, 2);
            case 10: return new Vector2(2, 4);
            case 11: return new Vector2(1, 3);
            case 12: return new Vector2(3, 3);
            case 13: return new Vector2(3, 4);
            case 14: return new Vector2(1, 4);
            case 15: return new Vector2(2, 1);
            case 16: return new Vector2(0, 2);
            case 17: return new Vector2(0, 0);
            case 18: return new Vector2(6, 0);
            case 19: return new Vector2(6, 1);
            case 20: return new Vector2(6, 2);
            case 21: return new Vector2(6, 3);
            case 22: return new Vector2(2, 1);
            default: return new Vector2(0, 0);
        }
    }

    /** Draw the TileMap.
     *  @param {CanvasRenderingContext2D} context - The context to draw on. */
    draw(context) {
        this.#grid.forEach((pos, element) => {
            if (element) this.#sprite.drawFrame(context, pos, this.toFrame(element)); 
        }, true);
    }
}

export default TileMap;
