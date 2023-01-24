import Vector2 from "../common/vector2.js";

export default class TileMap {
    /** A 2D-grid that handles drawing tiles. */

    #unitDimensions
    #grid
    #sprite

    constructor(unitDimensions, grid, sprite) {
        this.#unitDimensions = unitDimensions;
        this.#grid = grid;
        this.#sprite = sprite;
    }

    toGridPos(realPos) { return realPos.floorDivCopy(this.#unitDimensions); }
    toRealPos(gridPos) { return gridPos.mulCopy(this.#unitDimensions); }
    toFrame(symbol) {
        switch (symbol) {
            case "^^^": return new Vector2(2, 0);
            case "___": return null;
            case "|  ": return new Vector2(1, 1);
            case "  |": return new Vector2(3, 1);
            case "===": return null;
            case "|^^": return new Vector2(1, 0);
            case "^^|": return new Vector2(3, 0);
            case "|__": return null;
            case "__|": return null;
            case "| |": return null;
            case "|==": return null;
            case "==|": return null;
            case "|^|": return null;
            case "|_|": return null;
            case "XXX": return new Vector2(2, 1);
            case "_-^": return new Vector2(0, 1);
            case "^-_": return new Vector2(0, 0);
            default: return null;
        }
    }

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
