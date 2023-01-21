import Vector2 from '../../boggersJS/common/vector2.js';
import Sprite from '../../boggersJS/components/sprite.js';

export const sprites = {
    'enemy': () => new Sprite('enemy', new Vector2(160, 120), [6]),
    'player': () => new Sprite('player', new Vector2(200, 200), [9, 7]),
    'background': () => new Sprite('background', new Vector2(2400, 720), [1]),
    'background2': () => new Sprite('background2', new Vector2(800, 1200), [1]),
    'boom': () => new Sprite('boom', new Vector2(200, 180), [5]),
    'test': () => new Sprite('test', new Vector2(80, 80), [1])
};
