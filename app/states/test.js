import { createProjectile } from '../config/presets.js';
import { characters, decoration, weapons } from '../assets/loader.js';
import { testPlayerCollide, testDeco } from '../config/maps.js';
import { minimal } from '../config/tilesets.js';

import { State, Vector2 } from '../../boggersJS/common/index.js';
import { Shooter, Gun, Player, Pool, playerMouseFacing, gunStandard, Controller, ContinuousBackground } from '../../boggersJS/gameObjects/index.js';
import { Camera, TileMap } from '../../boggersJS/stateObjects/index.js';

export default class Test extends State {
    /** A test state for testing displays and features. */

    constructor(canvasDimensions) {
        super(canvasDimensions);

        this.tileMap = new TileMap(testDeco, decoration['tiles-grass'](), minimal);

        this.gun = new Gun(weapons['smg'](), new Vector2(100, 200), 5, 10, createProjectile);
        this.player = new Player(characters['xoki'](), testPlayerCollide, new Vector2(100, 20), new Vector2(5, 5), new Vector2(0.6, 0.4), new Vector2(0.35, 0.25), -8, 10);
        this.shooter = new Shooter(this.player, this.gun, new Vector2(10, 35));

        this.controller = new Controller('StandingRight', playerMouseFacing, this.player);
        this.gunController = new Controller('IdleRight', gunStandard, this.gun);

        this.camera = new Camera(this.canvasDimensions, this.player.movable);
 
        this.pool = new Pool(['bg-back', 'bg-mid', 'bg-front', 'players', 'bullets'], []);

        this.pool.addObjectToLayer('players', this.shooter);

        this.pool.addObjectToLayer('bg-front', new ContinuousBackground(decoration['bg-front-bench'](), testDeco, new Vector2(0, 0)));
        this.pool.addObjectToLayer('bg-mid', new ContinuousBackground(decoration['bg-mid-flag'](), testDeco, new Vector2(0, 0)));
        this.pool.addObjectToLayer('bg-back', new ContinuousBackground(decoration['bg-back-peaks'](), testDeco, new Vector2(0, 0)));

        this.pool.addController(this.controller);
        this.pool.addController(this.gunController);
    }

    startup() {}
    cleanup() {}

    update(inputs) { 
        const offset = this.camera.getBoundedOffset();
        inputs.applyOffset(offset);
        this.pool.update(inputs);
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
