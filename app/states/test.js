import { maps, sprites } from '../config/config.js';
import { State, Vector2 } from '../../boggersJS/common/index.js';
import { Player, Gun, Button, TextInput, Pool } from '../../boggersJS/gameObjects/index.js';
import { Camera, TileMap } from '../../boggersJS/stateObjects/index.js';

export default class Test extends State {
    /** A test state for testing displays and features. */

    constructor(canvasDimensions) {
        super(canvasDimensions);

        this.tileMap = new TileMap(maps['test'], sprites['tiles']());

        this.gun = new Gun(sprites['tiles'](), new Vector2(100, 200), 10, sprites['bullet'], maps['test'], 10, 10);
        this.player = new Player(sprites['zito'](), maps['test'], new Vector2(100, 20), new Vector2(5, 5), new Vector2(1.5, 1.5), new Vector2(1, 1), -20, 10);

        this.button = new Button(sprites['button'](), new Vector2(200, 600), () => console.log("BUTTON"));
        this.textInput = new TextInput(sprites['textinput'](), new Vector2(300, 400), 20, '48px serif', s => console.log(s));

        this.camera = new Camera(this.canvasDimensions, this.player.movable);
 
        this.pool = new Pool(["players", "bullets"], []);
        this.pool.addObjectToLayer('players', this.player);
        this.pool.addObjectToLayer('players', this.gun);
        this.pool.addObjectToLayer('players', this.button);
        this.pool.addObjectToLayer('players', this.textInput);
    }

    startup() {}
    cleanup() {}

    handleInputs(inputs) {
        const offset = this.camera.getHybridOffset([500, 1100], [100, 200]);
        inputs.applyOffset(offset);
        this.pool.handleInputs(inputs); 
    }

    update(dt) { 
        this.pool.update(dt);
    }

    draw(context) {
        context.save();
        const offset = this.camera.getHybridOffset([500, 1100], [100, 200]);
        context.translate(offset.x, offset.y);
        this.pool.draw(context); 
        this.tileMap.draw(context);
        context.restore();
    }
}
