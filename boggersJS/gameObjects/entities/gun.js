import GameObject from '../gameObject.js';
import Vector2 from '../../common/vector2.js';
import Movable from '../../components/movable/movable.js';
import Sprite from '../../components/sprite.js';
import Projectile from './projectile.js'
import Input from '../../common/input.js';

/** @author Mr. Nut */
class Gun extends GameObject {
    /** Create gun
     *  @param {Sprite} sprite - The sprite for the gun
     *  @param {Sprite} bulletSprite - Sprite for gun's bullets
     *  @param {Vector2} gunPos - Position of gun 
     *  @param {number} damage - Damage per projectile of the gun
     *  @param {number} bulletSpd - Speed of generated projectiles
     *  @param {number} delay - Time between consecutive projectiles
     */
    
    constructor(sprite, bulletSprite, damage, bulletSpd, delay) {
        super(new Vector2(0, 0), sprite);
        this.bulletSprite = bulletSprite
        this.gunPos = new Vector2(0, 0);
        this.damage = damage;
        this.bulletSpd = bulletSpd;
        this.dtRunner.requiredFrameCount = delay;
        this.isFiring = false;
    }

    createBullet() {
        if (this.isFiring){
            let bulletVel = inputs['MouseHold'].pos.subCopy(this.gunPos);
            let norm = Math.sqrt(bulletVel.x*bulletVel.x + bulletVel.y*bulletVel.y)
            bulletVel = bulletVel.floorDivCopy(new Vector2(norm, norm))
            bulletVel = bulletVel.mulCopy(new Vector2(this.bulletSpd, this.bulletSpd))
            new Projectile(10000, this.bulletSprite, this.gunPos, bulletVel, this.damage)
        }
    }

    /** Handle inputs.
     *  @see GameObject.handleInputs
     *  @param {Object<string, Input>} inputs */
    handleInputs(inputs) {
        // inputs['MouseHold'].pos
        // Math.sqrt(NUMBER)
        if ('MouseHold' in inputs){
            this.isFiring = true;
        }
        this.isFiring = false;
    }

    /** Update components.
     *  @see GameObject.update
     *  @param {number} dt */
    update(dt) {
        this.dtRunner.deltaTimeUpdate(dt, this.createBullet);
    }
}
