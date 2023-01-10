import { sheets } from '../config/config.js';
import State from '../../core/state.js';
import Player from '../../gui/gameObjects/entities/player.js';
import Enemy from '../../gui/gameObjects/entities/enemy.js';
import Background from '../../gui/gameObjects/displayables/background.js';
import Layer from '../../gui/pool/layer.js';
import Pool from '../../gui/pool/pool.js';

export default class Test extends State {
    /** A test state for testing displays and features. */

    constructor() {
        super();
        const width = 1000, height = 500;
        this.layers = {
            "background": new Layer([new Background(width, height, sheets['background'](), null, [-7, 0])]),
            "players": new Layer([new Player(width, height, sheets['player'](), null)]),
            "enemies": new Layer([new Enemy(width, height, sheets['enemy'](), null)])
        };
        this.pool = new Pool(this.layers, [['players', 'enemies', 'ouch']])
    }

    startup() {}
    cleanup() {}

    handleInputs(inputs) { this.pool.handleInputs(inputs); }

    update(dt) { this.pool.update(dt); }

    draw(context) { this.pool.draw(context); }
}
