import { maps, sprites } from '../config/config.js';
import { State, Vector2 } from '../../boggersJS/common/index.js';
import { Player, Gun, Button, TextInput, Pool, playerStates, Controller } from '../../boggersJS/gameObjects/index.js';
import { Camera, TileMap } from '../../boggersJS/stateObjects/index.js';

export default class Test extends State {
    /** A test state for testing displays and features. */

    constructor(canvasDimensions) {
        super(canvasDimensions);

        this.tileMap = new TileMap(maps['test'], sprites['tiles']());

        this.gun = new Gun(sprites['tiles'](), new Vector2(100, 200), 10, sprites['bullet'], maps['test'], 10, 10);
        this.player = new Player(sprites['player'](), maps['test'], new Vector2(100, 20), new Vector2(5, 5), new Vector2(1.5, 1.5), new Vector2(1, 1), -20, 10);
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

    update(dt) { 
        this.pool.update(dt);
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
