import { sprites, createProjectile } from '../config/config.js';
import { testCollide, testDeco } from '../config/maps.js';
import { minimal } from '../config/tilesets.js';

import { State, Vector2 } from '../../boggersJS/common/index.js';
import { Shooter, Gun, Player, Pool, playerStates, gunStates, Controller } from '../../boggersJS/gameObjects/index.js';
import { Camera, TileMap } from '../../boggersJS/stateObjects/index.js';

export default class Test extends State {
    /** A test state for testing displays and features. */

    constructor(canvasDimensions) {
        super(canvasDimensions);

        this.tileMap = new TileMap(testDeco, sprites['minimal'](), minimal);

        this.gun = new Gun(sprites['gun'](), new Vector2(100, 200), new Vector2(0, 5), 30, createProjectile);
        this.player = new Player(sprites['player'](), testCollide, new Vector2(100, 20), new Vector2(5, 5), new Vector2(0.45, 0.45), new Vector2(0.25, 0.25), -8, 10);
        this.shooter = new Shooter(this.player, this.gun);

        this.controller = new Controller('StandingRight', playerStates, this.player);
        this.gunController = new Controller('IdleRight', gunStates, this.gun);

        this.camera = new Camera(this.canvasDimensions, this.player.movable);
 
        this.pool = new Pool(["players", "bullets"], []);
        this.pool.addObjectToLayer('players', this.shooter);
        this.pool.addController(this.controller);
        this.pool.addController(this.gunController);
    }

    startup() {}
    cleanup() {}

    handleInputs(inputs) {
        const offset = this.camera.getBoundedOffset();
        inputs.applyOffset(offset);
        this.pool.handleInputs(inputs); 
    }

    update() { 
        this.pool.update();
    }

    draw(context, alpha) {
        context.save();
        const offset = this.camera.getInterpolatedBoundedOffset(alpha);
        context.translate(offset.x, offset.y);
        this.pool.draw(context, alpha); 
        this.tileMap.draw(context);
        context.restore();
    }
}
