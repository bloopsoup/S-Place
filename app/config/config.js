import { Vector2 } from '../../boggersJS/common/index.js';
import { Sprite } from '../../boggersJS/components/index.js';

export const maps = {
    'test': [
        ["   ", "   ", "   ", "===", "===", "===", "===", "===", "===", "===", "===", "===", "===", "===", "===", "===", "   ", "   ", "   ", "   "],
        ["   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   "],
        ["   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   "],
        ["   ", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "_-^", "^^^", "^^^", "^-_", "   ", "   ", "   ", "   ", "   ", "   ", "   ", "   "],
        ["   ", "   ", "   ", "   ", "   ", "|^^", "^^^", "^^^", "XXX", "XXX", "XXX", "XXX", "^-_", "   ", "   ", "   ", "   ", "   ", "   ", "   "],
        ["   ", "   ", "   ", "   ", "   ", "|  ", "XXX", "XXX", "XXX", "XXX", "XXX", "XXX", "XXX", "^^^", "^^^", "^^|", "   ", "   ", "   ", "   "]
    ]
}

export const sprites = {
    'player': () => new Sprite('player', new Vector2(200, 200), [9, 7]),
    'background': () => new Sprite('background', new Vector2(2400, 720), [1]),
    'tiles': () => new Sprite('tiles', new Vector2(80, 80), [4, 4]),
    'bullet': () => new Sprite('bullet', new Vector2(10, 10), [1])
};
