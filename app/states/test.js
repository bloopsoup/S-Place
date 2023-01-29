import { maps, sprites } from '../config/config.js';
import { State, Vector2 } from '../../boggersJS/common/index.js';
import { Player, Gun, Pool } from '../../boggersJS/gameObjects/index.js';
import { Camera, CollisionMap, TileMap } from '../../boggersJS/stateObjects/index.js';

export default class Test extends State {
    /** A test state for testing displays and features. */

    constructor() {
        super();

        this.collisionMap = new CollisionMap(new Vector2(80, 80), maps['test']);
        this.tileMap = new TileMap(new Vector2(80, 80), maps['test'], sprites['tiles']());

        this.gun = new Gun(this.collisionMap.mapDimensions, sprites['tiles'](), new Vector2(100, 200), 10, sprites['bullet'], 10, 10);

        this.player = new Player(this.collisionMap.mapDimensions, sprites['tiles'](), new Vector2(100, 20), new Vector2(5, 5), new Vector2(1.5, 1.5), new Vector2(1, 1), -20, 10);
        this.camera = new Camera(new Vector2(1000, 500), this.player.movable);
 
        this.pool = new Pool(["players", "bullets"], []);
        this.pool.addObjectToLayer('players', this.player);
        this.pool.addObjectToLayer('players', this.gun);
    }

    startup() {}
    cleanup() {}

    handleInputs(inputs) { this.pool.handleInputs(inputs); }

    update(dt) { 
        this.pool.update(dt);
        this.collisionMap.handleCollisions([this.player.movable]);
    }

    draw(context) {
        context.save();
        const offset = this.camera.getHybridOffset([500, 1100], [100, 400]);
        context.translate(offset.x, offset.y);
        this.pool.draw(context); 
        this.tileMap.draw(context);
        context.restore();
    }
}
