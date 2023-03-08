import { testCollide } from './maps.js';
import { Vector2 } from '../../boggersJS/common/index.js';
import { Sprite } from '../../boggersJS/components/index.js';
import { Projectile } from '../../boggersJS/gameObjects/index.js';

export const sprites = {
    'player': () => new Sprite('player', new Vector2(80, 80), [9, 9, 9, 9, 9, 9]),
    'background': () => new Sprite('background', new Vector2(2400, 720), [1]),
    'tiles': () => new Sprite('tiles', new Vector2(80, 80), [4, 4]),
    'button': () => new Sprite('button', new Vector2(200, 50), [3]),
    'bullet': () => new Sprite('bullet', new Vector2(10, 10), [1]),
    'zito': () => new Sprite('zito', new Vector2(60, 80), [13]),
    'textinput': () => new Sprite('textinput', new Vector2(600, 75), [2]),
    'minimal': () => new Sprite('minimal', new Vector2(80, 80), [5, 5, 5, 5, 5, 5, 5, 5]),
    'gun': () => new Sprite('gun', new Vector2(58, 25), [1])
};

/** Creates a standard projectile.
 *  @param {Vector2} pos - The starting position of the bullet.
 *  @param {Vector2} direction - The direction of the bullet. */
export function createProjectile(pos, direction) {
    direction.mulScalar(10);
    return new Projectile(sprites['bullet'](), testCollide, pos, direction, 10);
}
