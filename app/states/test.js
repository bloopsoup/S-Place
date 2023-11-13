import { townCollide } from '../config/maps.js';
import { State, Settings, Loader } from '../../boggersJS/core/index.js';
import { Vector2, InputTracker } from '../../boggersJS/common/index.js';
import { Shooter, Gun, Player, Projectile, Pool, playerMouseFacing, gunStandard, Controller, ContinuousBackground, Static, TextInput, Text, DialogueBox } from '../../boggersJS/game-objects/index.js';
import { Camera } from '../../boggersJS/state-objects/index.js';
import { Label, Layout, LayoutSlot } from '../../boggersJS/components/index.js';

/** A state for testing displays and features. */
class Test extends State {
    /** Create a new state object. 
     *  @param {Settings} settings - The settings shared by all states.
     *  @param {Loader} loader - The asset loader used by all states to load images, sounds, etc. */
    constructor(settings, loader) {
        super(settings, loader);

        this.testScript = `
        Bob neutral M
        Sometimes...
        
        Bob sad M
        I just want to stay in bed.
        
        Bob angry M
        So stop trying to wake me up!
        
        Bob sad M
        Yeesh...
        `;

        this.gun = new Gun(loader.getSprite('weapons', 'smg'), new Vector2(100, 200), 5, this.createProjectile);
        this.player = new Player(loader.getSprite('characters', 'xoki'), townCollide, new Vector2(20, 20), new Vector2(5, 5), new Vector2(0.6, 0.4), new Vector2(0.35, 0.25), -8, 10);
        this.shooter = new Shooter(this.player, this.gun, new Vector2(10, 35));

        this.controller = new Controller('StandingRight', playerMouseFacing, this.player);
        this.gunController = new Controller('IdleRight', gunStandard, this.gun);

        this.camera = new Camera(this.settings.canvasDimensions, this.player.movable);
        this.input = new TextInput(loader.getSprite('ui', 'text-input'), new Vector2(10, 300), '30px Pixel-Bold', text => console.log(text));
        this.text = new Text(new Vector2(10, 100), '50px Pixel-Bold', 'BRUH');

        const layout = new Layout({
            'name' : new LayoutSlot(new Vector2(0, 0), new Vector2(190, 55)),
            'dialogue-text': new LayoutSlot(new Vector2(190, 0), new Vector2(530, 240)),
            'portrait': new LayoutSlot(new Vector2(0, 55), new Vector2(190, 190))
        });
        this.dbox = new DialogueBox(
            loader.getSprite('ui', 'dialogue-box'), 
            { "Bob": loader.getSprite('characters', 'xoki-icon') },
            new Label('', new Vector2(189, 55), new Vector2(10, 10), '40px Pixel-Bold'),
            new Label('', new Vector2(520, 220), new Vector2(10, 10), '30px Pixel-Bold'),
            layout,
            new Vector2(1720, 250),
            this.testScript
        );
 
        this.pool = new Pool(['bg-back', 'bg-mid', 'bg-front', 'buildings', 'players', 'bullets', 'tiles'], []);

        this.pool.addObjectToLayer('players', this.shooter);

        this.pool.addObjectToLayer('bg-front', new ContinuousBackground(loader.getSprite('decoration', 'bg-front-bench'), townCollide, new Vector2(0, 0)));
        this.pool.addObjectToLayer('bg-mid', new ContinuousBackground(loader.getSprite('decoration', 'bg-mid-flag'), townCollide, new Vector2(0, 0)));
        this.pool.addObjectToLayer('bg-back', new ContinuousBackground(loader.getSprite('decoration', 'bg-back-peaks'), townCollide, new Vector2(0, 0)));

        this.pool.addObjectToLayer('buildings', this.input);
        this.pool.addObjectToLayer('buildings', this.text);
        this.pool.addObjectToLayer('buildings', this.dbox);
        this.pool.addObjectToLayer('buildings', new Static(loader.getSprite('levels', 'town-bld'), new Vector2(0, 0)));
        this.pool.addObjectToLayer('tiles', new Static(loader.getSprite('levels', 'town-grass'), new Vector2(0, 0)));

        this.pool.addController(this.controller);
        this.pool.addController(this.gunController);
    }

    /** Create a projectile.
     *  @param {Vector2} pos - The position of the projectile.
     *  @param {Vector2} direction - The direction of the projectile.
     *  @returns {Projectile} The projectile. */
    createProjectile = (pos, direction) => {
        direction.mulScalar(10);
        return new Projectile(this.loader.getSprite('weapons', 'bullet'), townCollide, pos, direction, 10);
    }

    // IGNORE
    startup() {}
    cleanup() {}

    /** Processes the inputs given by the InputHandler and updates components. 
     *  @param {InputTracker} inputs - The currently tracked inputs. */
    update(inputs) { 
        const offset = this.camera.getBoundedOffset();
        inputs.applyOffset(offset);
        this.pool.update(inputs);
    }

    /** Draws state elements and game objects onto the canvas.
     *  @param {CanvasRenderingContext2D} context - The context to draw on.
     *  @param {number} alpha - Used for interpolation when rendering between two states. */
    draw(context, alpha) {
        context.save();
        const offset = this.camera.getInterpolatedBoundedOffset(alpha);
        context.translate(offset.x, offset.y);
        this.pool.draw(context, alpha); 
        context.restore();
    }
}

export default Test;
