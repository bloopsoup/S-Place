import { sheets } from '../config/config.js';
import State from '../../core/state.js';
import Player from '../../gui/gameObjects/entities/player.js';
import Static from '../../gui/gameObjects/displayables/static.js';
import Layer from '../../gui/gameManagement/layer.js';
import Pool from '../../gui/gameManagement/pool.js';
import Camera from '../../gui/utils/camera.js';

export default class Test extends State {
    /** A test state for testing displays and features. */

    constructor() {
        super();
        const width = 1000, height = 500;
        this.player = new Player(width + 1000, height, sheets['player']());
        this.camera = new Camera(width, height, this.player, '');
        this.layers = {"background": new Layer(), "players": new Layer(), "enemies": new Layer()};
        this.pool = new Pool(this.layers, [['players', 'enemies', true], ['enemies', 'players', false]])
        this.pool.addObjectToLayer('background', new Static([0, 0], sheets['background']()));
        this.pool.addObjectToLayer('players', new Static([1000, 0], sheets['enemy']()));
        this.pool.addObjectToLayer('players', this.player);
    }

    startup() {}
    cleanup() {}

    handleInputs(inputs) { this.pool.handleInputs(inputs); }

    update(dt) { this.pool.update(dt); }

    draw(context) {
        context.save();
        const [ x, y ] = this.camera.getOffset();
        context.translate(x, y);
        this.pool.draw(context); 
        context.restore();
    }
}
