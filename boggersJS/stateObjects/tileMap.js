import { Grid, Vector2 } from '../common/index.js';
import { Sprite } from '../components/index.js';

/** A 2D-grid that handles drawing tiles. 
 *  @memberof StateObjects */
class TileMap {
    /** @type {Grid} */
    #grid
    /** @type {Sprite} */
    #sprite
    /** @type {Object<number, Vector2>} */
    #frames = {
        1: new Vector2(2, 0),
        2: new Vector2(2, 2),
        3: new Vector2(1, 1),
        4: new Vector2(3, 1),
        5 : new Vector2(2, 3),
        6 : new Vector2(4, 0),
        7 : new Vector2(5, 0),
        8 : new Vector2(4, 2),
        9 : new Vector2(5, 2),
        10: new Vector2(2, 4),
        11: new Vector2(1, 3),
        12: new Vector2(3, 3),
        13: new Vector2(3, 4),
        14: new Vector2(1, 4),
        15: new Vector2(2, 1),
        16: new Vector2(0, 2),
        17: new Vector2(0, 0),
        18: new Vector2(6, 0),
        19: new Vector2(6, 1),
        20: new Vector2(6, 2),
        21: new Vector2(6, 3),
        22: new Vector2(2, 1)
    };
    /** @type {HTMLCanvasElement} */
    #cachedCanvas
    /** @type {boolean} */
    #hasRendered

    /** Create the TileMap.
     *  @param {Grid} grid - A grid where each number denotes the art for each tile.
     *  @param {Sprite} sprite - The tile sheet to represent different types of tiles. */
    constructor(grid, sprite) {
        this.#grid = grid;
        this.#sprite = sprite;
        this.#cachedCanvas = document.createElement('canvas');
        this.#cachedCanvas.width = grid.dimensions.x, this.#cachedCanvas.height = grid.dimensions.y;
        this.#hasRendered = false;
    }

    /** Prerenders the TileMap to improve performance. Should be called ONCE. */
    preDraw() {
        const context = this.#cachedCanvas.getContext('2d');
        this.#grid.forEach((pos, element) => {
            if (element) this.#sprite.drawFrame(context, pos, this.#frames[element]); 
        }, true);
        this.#hasRendered = true;
    }

    /** Draw the TileMap.
     *  @param {CanvasRenderingContext2D} context - The context to draw on. */
    draw(context) {
        if (!this.#hasRendered) this.preDraw();
        context.drawImage(this.#cachedCanvas, 0, 0);
    }
}

export default TileMap;
