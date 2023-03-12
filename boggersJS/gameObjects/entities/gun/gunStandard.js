import Gun from './gun.js';
import { ControlState } from '../../controller/index.js';
import { InputTracker } from '../../../common/index.js';

class IdleLeft extends ControlState {
    /** Modify the target upon entering the state.
     *  @param {Gun} target - The player to modify. */
    startup(target) { target.sprite.row = 0; }

    /** Handle inputs and change control states when necessary. 
     *  @param {Gun} target - The player to modify. 
     *  @param {InputTracker} inputs - The currently tracked inputs. */
    update(target, inputs) {
        if (inputs.has('MouseMove')) target.updateDirection(inputs.get('MouseMove').pos);

        if (inputs.has('MouseHold')) this.goToDest('ShootLeft');
        else if (inputs.has('d')) this.goToDest('IdleRight');
    }
}

class IdleRight extends ControlState {
    /** Modify the target upon entering the state.
     *  @param {Gun} target - The player to modify. */
    startup(target) { target.sprite.row = 1; }

    /** Handle inputs and change control states when necessary. 
     *  @param {Gun} target - The player to modify. 
     *  @param {InputTracker} inputs - The currently tracked inputs. */
    update(target, inputs) {
        if (inputs.has('MouseMove')) target.updateDirection(inputs.get('MouseMove').pos);

        if (inputs.has('MouseHold')) this.goToDest('ShootRight');
        else if (inputs.has('a')) this.goToDest('IdleLeft');
    }
}

class ShootLeft extends ControlState {
    /** Modify the target upon entering the state.
     *  @param {Gun} target - The player to modify. */
    startup(target) { target.sprite.row = 2; }

    /** Handle inputs and change control states when necessary. 
     *  @param {Gun} target - The player to modify. 
     *  @param {InputTracker} inputs - The currently tracked inputs. */
    update(target, inputs) {
        if (inputs.has('MouseMove')) target.updateDirection(inputs.get('MouseMove').pos);

        if (!inputs.has('MouseHold')) this.goToDest('IdleLeft');
        else if (inputs.has('d')) this.goToDest('ShootRight');
        target.addBullet();
    }
}

class ShootRight extends ControlState {
    /** Modify the target upon entering the state.
     *  @param {Gun} target - The player to modify. */
    startup(target) { target.sprite.row = 3; }

    /** Handle inputs and change control states when necessary. 
     *  @param {Gun} target - The player to modify. 
     *  @param {InputTracker} inputs - The currently tracked inputs. */
    update(target, inputs) {
        if (inputs.has('MouseMove')) target.updateDirection(inputs.get('MouseMove').pos);

        if (!inputs.has('MouseHold')) this.goToDest('IdleRight');
        else if (inputs.has('a')) this.goToDest('ShootLeft');
        target.addBullet();
    }
}

/** All the states needed for controlling a gun.
 *  @type {Object<string, ControlState>} 
 *  @memberof GameObjects.Entities.Gun */
const gunStandard = {
    'IdleLeft': new IdleLeft(),
    'IdleRight': new IdleRight(),
    'ShootLeft': new ShootLeft(),
    'ShootRight': new ShootRight()
};

export default gunStandard;
