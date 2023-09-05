import { Vector2 } from '../../boggersJS/common/index.js';
import { Loader } from '../../boggersJS/core/index.js';

const paths = {
    "app/assets/images/characters/": [
        { filename: 'xoki.png', size: new Vector2(80, 80), format: [20, 20, 5, 5, 1, 1, 1, 1] }
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
        { filename: 'text-input.png', size: new Vector2(600, 80), format: [2] }
    ],
    "app/assets/images/weapons/": [
        { filename: 'bullet.png', size: new Vector2(10, 10), format: [1] },
        { filename: 'smg.png', size: new Vector2(100, 36), format: [1, 1, 2, 2, 1, 1], ticks: 10 }
    ]
};

const loader = new Loader(paths);
export default loader;
