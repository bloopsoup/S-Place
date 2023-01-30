import Test from './states/test.js';
import { Vector2 } from '../boggersJS/common/index.js';
import { App } from '../boggersJS/core/index.js';

function run() {
    const canvas = document.getElementById('canvas');
    canvas.width = 1000, canvas.height = 500;

    const start = 'test';
    const states = {
        'test': new Test(new Vector2(canvas.width, canvas.height))
    };

    const app = new App(canvas, start, states);
    app.runTick(0);
}

window.addEventListener('load', run);
