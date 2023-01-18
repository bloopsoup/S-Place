import Sprite from '../../gui/utils/sprite.js';

export const sheets = {
    'enemy': () => new Sprite('enemy', 160, 120, [6]),
    'player': () => new Sprite('player', 200, 200, [9, 7]),
    'background': () => new Sprite('background', 2400, 720, [1]),
    'background2': () => new Sprite('background2', 800, 1200, [1]),
    'boom': () => new Sprite('boom', 200, 180, [5])
};
