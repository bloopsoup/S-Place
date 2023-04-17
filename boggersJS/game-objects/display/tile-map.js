import GameObject from '../game-object.js';
import { Grid, Vector2 } from '../../common/index.js';
import { Sprite } from '../../components/index.js';

/** A 2D-grid that handles drawing tiles.
 *  @augments GameObject
 *  @memberof GameObjects.Display */
class TileMap extends GameObject {
    /** @type {Grid} */
    #grid
    /** @type {Sprite} */
    #sprite
    /** @type {Object<string, Vector2>} */
    #frameLookup
    /** @type {HTMLCanvasElement} */
    #cachedCanvas
    /** @type {boolean} */
    #hasRendered

    /** Create the TileMap.
     *  @param {Grid} grid - A grid where each element denotes the art for each tile.
     *  @param {Sprite} sprite - The tile sheet to represent different types of tiles.
     *  @param {Object<string, Vector2>} frameLookup - A map which links names to frame locations. */
    constructor(grid, sprite, frameLookup) {
        super();
        this.#grid = grid;
        this.#sprite = sprite;
        this.#frameLookup = frameLookup;
        this.#cachedCanvas = document.createElement('canvas');
        this.#cachedCanvas.width = grid.dimensions.x, this.#cachedCanvas.height = grid.dimensions.y;
        this.#hasRendered = false;
    }

    /** Prerenders the TileMap to improve performance. Should be called ONCE. */
    #preDraw() {
        const context = this.#cachedCanvas.getContext('2d');
        this.#grid.forEach((pos, element) => {
            if (element in this.#frameLookup) this.#sprite.drawFrame(context, pos, this.#frameLookup[element]); 
        }, true);
        this.#hasRendered = true;
    }

    /** Draw the TileMap.
     *  @param {CanvasRenderingContext2D} context - The context to draw on. */
    draw(context) {
        if (!this.#hasRendered) this.#preDraw();
        context.drawImage(this.#cachedCanvas, 0, 0);
    }
}

export default TileMap;
