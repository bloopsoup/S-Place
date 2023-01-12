import { sheets } from '../config/config.js';
import State from '../../core/state.js';
import Player from '../../gui/gameObjects/entities/player.js';
import Static from '../../gui/gameObjects/displayables/static.js';
import Layer from '../../gui/gameManagement/layer.js';
import Pool from '../../gui/gameManagement/pool.js';

export default class Test extends State {
    /** A test state for testing displays and features. */

    constructor() {
        super();
        const width = 1000, height = 500;
        this.layers = {"background": new Layer(), "players": new Layer(), "enemies": new Layer()};
        this.pool = new Pool(this.layers, [['players', 'enemies', true], ['enemies', 'players', false]])
        this.pool.addObjectToLayer('background', new Static([0, 0], sheets['background']()));
        this.pool.addObjectToLayer('players', new Player(width, height, sheets['player']()));
    }

    startup() {}
    cleanup() {}

    handleInputs(inputs) { this.pool.handleInputs(inputs); }

    update(dt) { this.pool.update(dt); }

    draw(context) { this.pool.draw(context); }
}
