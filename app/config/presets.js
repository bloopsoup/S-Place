import { townCollide } from './maps.js';
import { weapons } from '../assets/loader.js';
import { Vector2 } from '../../boggersJS/common/index.js';
import { Projectile } from '../../boggersJS/game-objects/index.js';

/** Creates a standard projectile.
 *  @param {Vector2} pos - The starting position of the bullet.
 *  @param {Vector2} direction - The direction of the bullet. */
export function createProjectile(pos, direction) {
    direction.mulScalar(10);
    return new Projectile(weapons['bullet'](), townCollide, pos, direction, 10);
}
