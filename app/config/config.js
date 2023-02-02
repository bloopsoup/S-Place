import { Grid, Vector2 } from '../../boggersJS/common/index.js';
import { Sprite } from '../../boggersJS/components/index.js';

export const maps = {
    'test': new Grid(new Vector2(80, 80), [
        [0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0],
        [0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0],
        [0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0],
        [0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 16, 1 , 1 , 17, 0 , 0 , 0 , 0 , 0 , 0 , 0],
        [0 , 0 , 0 , 0 , 0 , 0 , 6 , 1 , 1 , 0 , 0 , 0 , 0 , 17, 0 , 0 , 0 , 0 , 0 , 0],
        [0 , 0 , 0 , 0 , 0 , 0 , 3 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 1 , 1 , 7 , 0 , 0 , 0]
    ])
}

export const sprites = {
    'player': () => new Sprite('player', new Vector2(200, 200), [9, 7]),
    'background': () => new Sprite('background', new Vector2(2400, 720), [1]),
    'tiles': () => new Sprite('tiles', new Vector2(80, 80), [4, 4]),
    'bullet': () => new Sprite('bullet', new Vector2(10, 10), [1])
};
