import { townCollide } from '../config/maps.js';
import { State } from '../../boggersJS/core/index.js';
import { Vector2 } from '../../boggersJS/common/index.js';
import { Shooter, Gun, Player, Projectile, Pool, playerMouseFacing, gunStandard, Controller, ContinuousBackground, Static, TextInput, Text } from '../../boggersJS/game-objects/index.js';
import { Camera } from '../../boggersJS/state-objects/index.js';

/** A test state for testing displays and features. */
class Test extends State {
    constructor(settings, loader) {
        super(settings, loader);

        this.gun = new Gun(loader.getSprite('weapons', 'smg'), new Vector2(100, 200), 5, this.createProjectile);
        this.player = new Player(loader.getSprite('characters', 'xoki'), townCollide, new Vector2(20, 20), new Vector2(5, 5), new Vector2(0.6, 0.4), new Vector2(0.35, 0.25), -8, 10);
        this.shooter = new Shooter(this.player, this.gun, new Vector2(10, 35));

        this.controller = new Controller('StandingRight', playerMouseFacing, this.player);
        this.gunController = new Controller('IdleRight', gunStandard, this.gun);

        this.camera = new Camera(this.settings.canvasDimensions, this.player.movable);
        this.input = new TextInput(loader.getSprite('ui', 'text-input'), new Vector2(10, 300), '30px Arial', text => console.log(text));
        this.text = new Text(new Vector2(10, 100), '50px Arial', 'BRUH');
 
        this.pool = new Pool(['bg-back', 'bg-mid', 'bg-front', 'buildings', 'players', 'bullets', 'tiles'], []);

        this.pool.addObjectToLayer('players', this.shooter);

        this.pool.addObjectToLayer('bg-front', new ContinuousBackground(loader.getSprite('decoration', 'bg-front-bench'), townCollide, new Vector2(0, 0)));
        this.pool.addObjectToLayer('bg-mid', new ContinuousBackground(loader.getSprite('decoration', 'bg-mid-flag'), townCollide, new Vector2(0, 0)));
        this.pool.addObjectToLayer('bg-back', new ContinuousBackground(loader.getSprite('decoration', 'bg-back-peaks'), townCollide, new Vector2(0, 0)));

        this.pool.addObjectToLayer('buildings', this.input);
        this.pool.addObjectToLayer('buildings', this.text);
        this.pool.addObjectToLayer('buildings', new Static(loader.getSprite('levels', 'town-bld'), new Vector2(0, 0)));
        this.pool.addObjectToLayer('tiles', new Static(loader.getSprite('levels', 'town-grass'), new Vector2(0, 0)));

        this.pool.addController(this.controller);
        this.pool.addController(this.gunController);
    }

    createProjectile = (pos, direction) => {
        direction.mulScalar(10);
        return new Projectile(this.loader.getSprite('weapons', 'bullet'), townCollide, pos, direction, 10);
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
        context.restore();
    }
}

export default Test;
