import Test from './states/test.js';
import { Vector2 } from '../boggersJS/common/index.js';
import { App } from '../boggersJS/core/index.js';

function run() {
    const canvas = document.getElementById('canvas');
    canvas.width = 1000, canvas.height = 500;
    const context = canvas.getContext('2d');

    const start = 'test';
    const states = {
        'test': new Test()
    };

    const app = new App(new Vector2(canvas.width, canvas.height), context, start, states);
    app.runTick(0);
}

window.addEventListener('load', run);
