import Test from './states/test.js';
import TestColliders from './states/test-colliders.js';
import { Vector2 } from '../boggersJS/common/index.js';
import { App, Loader, Settings, InputHandler, StateManager } from '../boggersJS/core/index.js';

/** The function that starts the game. */
async function run() {
    /* Edit your game settings and asset paths here. */
    const settings = new Settings(new Vector2(1280, 720));
    const loader = new Loader({
        "app/assets/images/characters/": [
            { filename: 'xoki.png', size: new Vector2(80, 80), format: [20, 20, 5, 5, 1, 1, 1, 1] },
            { filename: 'xoki-icon.png', size: new Vector2(180, 180), format: [8] }
        ],
        "app/assets/images/decoration/": [
            { filename: 'bg-back-peaks.png', size: new Vector2(1280, 720), format: [1] },
            { filename: 'bg-front-bench.png', size: new Vector2(1280, 720), format: [1] },
            { filename: 'bg-mid-flag.png', size: new Vector2(1280, 720), format: [1] }
        ],
        "app/assets/images/levels/": [
            { filename: 'town-grass.png', size: new Vector2(4000, 800), format: [1] },
            { filename: 'town-bld.png', size: new Vector2(4000, 800), format: [1] }
        ],
        "app/assets/images/ui/": [
            { filename: 'text-input.png', size: new Vector2(600, 80), format: [2] },
            { filename: 'dialogue-box.png', size: new Vector2(720, 240), format: [1] }
        ],
        "app/assets/images/weapons/": [
            { filename: 'bullet.png', size: new Vector2(10, 10), format: [1] },
            { filename: 'smg.png', size: new Vector2(100, 36), format: [1, 1, 2, 2, 1, 1], ticks: 10 }
        ],
        "app/assets/fonts/": [
            { filename: 'PixeloidMono.ttf', fontname: "pixel-mono" },
            { filename: 'PixeloidSans.ttf', fontname: "pixel-sans" },
            { filename: 'PixeloidSansBold.ttf', fontname: "pixel-bold" }
        ]
    });

    /** Write your state class names along with a starting state here. */
    const start = 'test-colliders';
    const states = {
        'test': Test,
        'test-colliders': TestColliders
    };

    /** Do not touch the code below. Core game components will be initialized. */
    await loader.init();
    const canvas = document.getElementById('canvas');
    canvas.width = settings.canvasDimensions.x, canvas.height = settings.canvasDimensions.y;
    const stateManager = new StateManager(start, states, settings, loader);
    const inputHandler = new InputHandler(canvas);
    const app = new App(canvas, stateManager, inputHandler);
    app.runTick(0);
}

window.addEventListener('load', run);
