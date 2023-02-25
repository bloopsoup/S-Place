import { maps, sprites } from '../config/config.js';
import { State, Vector2 } from '../../boggersJS/common/index.js';
import { Player, Gun, Pool, playerStates, Controller } from '../../boggersJS/gameObjects/index.js';
import { Camera, TileMap } from '../../boggersJS/stateObjects/index.js';

export default class Test extends State {
    /** A test state for testing displays and features. */

    constructor(canvasDimensions) {
        super(canvasDimensions);

        this.tileMap = new TileMap(maps['test'], sprites['blue']());

        this.gun = new Gun(sprites['tiles'](), new Vector2(100, 200), 5, sprites['bullet'], maps['test'], 10, 5);
        this.player = new Player(sprites['player'](), maps['test'], new Vector2(100, 20), new Vector2(5, 5), new Vector2(1.2, 1.2), new Vector2(0.6, 0.6), -15, 10);
        this.controller = new Controller('StandingRight', playerStates, this.player);

        this.camera = new Camera(this.canvasDimensions, this.player.movable);
 
        this.pool = new Pool(["players", "bullets"], []);
        this.pool.addObjectToLayer('players', this.player);
        this.pool.addObjectToLayer('players', this.gun);
        this.pool.addController(this.controller);
    }

    startup() {}
    cleanup() {}

    handleInputs(inputs) {
        const offset = this.camera.getHybridOffset();
        inputs.applyOffset(offset);
        this.pool.handleInputs(inputs); 
    }

    update() { 
        this.pool.update();
    }

    draw(context) {
        context.save();
        const offset = this.camera.getHybridOffset();
        context.translate(offset.x, offset.y);
        this.pool.draw(context); 
        this.tileMap.draw(context);
        context.restore();
    }
}
