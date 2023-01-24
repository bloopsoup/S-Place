import { sprites } from '../config/config.js';
import State from '../../boggersJS/common/state.js';
import Vector2 from '../../boggersJS/common/vector2.js';
import Camera from '../../boggersJS/components/camera.js';
import Player from '../../boggersJS/gameObjects/entities/player.js';
import Static from '../../boggersJS/gameObjects/display/static.js';
import Pool from '../../boggersJS/gameObjects/controller/pool.js';
import TileMap from '../../boggersJS/stateObjects/tileMap.js';

export default class Test extends State {
    /** A test state for testing displays and features. */

    constructor() {
        super();
        const mapDimensions = new Vector2(1600, 480);
        this.grid = [
            ["   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   "],
            ["   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   "],
            ["   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   "],
            ["   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "_-^", "^^^", "^^^", "^-_", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   "],
            ["   ", "   ", "   ", "   ", "   ", "   ", "   ", "_-^", "   ", "   ", "   ", "   ", "^-_", "   ", "   ", "   ", "   ", "   ", "   ", "   "],
            ["   ", "   ", "   ", "   ", "   ", "   ", "_-^", "   ", "   ", "   ", "   ", "   ", "   ", "^-_", "   ", "   ", "   ", "   ", "   ", "   "]
        ]
        this.tileMap = new TileMap(new Vector2(80, 80), this.grid, [sprites['test']()]);
        this.player = new Player(mapDimensions.copy(), sprites['test']());
        this.camera = new Camera(new Vector2(1000, 500), this.player.movable);
 
        this.pool = new Pool(["background", "players", "enemies"], 
                             [['players', 'enemies', true], ['enemies', 'players', false]]);
        this.pool.addObjectToLayer('background', new Static(mapDimensions.copy(), sprites['background'](), new Vector2(0, 0)));
        this.pool.addObjectToLayer('players', new Static(mapDimensions.copy(), sprites['enemy'](), new Vector2(1000, 0)));
        this.pool.addObjectToLayer('players', this.player);
    }

    startup() {}
    cleanup() {}

    handleInputs(inputs) { this.pool.handleInputs(inputs); }

    update(dt) { 
        this.pool.update(dt);
        this.tileMap.handleCollisions(this.player.movable);
    }

    draw(context) {
        context.save();
        const offset = this.camera.getHybridOffset([500, 1100], [0, 0]);
        context.translate(offset.x, offset.y);
        this.pool.draw(context); 
        this.tileMap.draw(context);
        context.restore();
    }
}
