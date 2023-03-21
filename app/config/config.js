import { testBulletCollide } from './maps.js';
import { Vector2 } from '../../boggersJS/common/index.js';
import { Sprite } from '../../boggersJS/components/index.js';
import { Projectile } from '../../boggersJS/gameObjects/index.js';

export const sprites = {
    'player': () => new Sprite('player', new Vector2(80, 80), [20, 20, 5, 5, 1, 1, 1, 1]),
    'tiles': () => new Sprite('tiles', new Vector2(80, 80), [4, 4]),
    'button': () => new Sprite('button', new Vector2(200, 50), [3]),
    'bullet': () => new Sprite('bullet', new Vector2(10, 10), [1]),
    'zito': () => new Sprite('zito', new Vector2(60, 80), [13]),
    'textinput': () => new Sprite('textinput', new Vector2(600, 75), [2]),
    'minimal': () => new Sprite('minimal', new Vector2(80, 80), [5, 5, 5, 5, 5, 5, 5, 5]),
    'gun': () => new Sprite('gun', new Vector2(100, 36), [1, 1, 10, 10, 1, 1]),
    'background1': () => new Sprite('background1', new Vector2(1280, 720), [1]),
    'background2': () => new Sprite('background2', new Vector2(1280, 720), [1]),
    'background3': () => new Sprite('background3', new Vector2(1280, 720), [1])
};

/** Creates a standard projectile.
 *  @param {Vector2} pos - The starting position of the bullet.
 *  @param {Vector2} direction - The direction of the bullet. */
export function createProjectile(pos, direction) {
    direction.mulScalar(10);
    return new Projectile(sprites['bullet'](), testBulletCollide, pos, direction, 10);
}
