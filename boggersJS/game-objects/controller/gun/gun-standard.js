import ControlState from '../control-state.js';
import { Gun } from '../../entities/index.js';
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

        if (target.orientation === 'right') this.goToDest('IdleRight');
        else if (inputs.has('MouseHold')) this.goToDest('ShootLeft');
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

        if (target.orientation === 'left') this.goToDest('IdleLeft');
        else if (inputs.has('MouseHold')) this.goToDest('ShootRight');
    }
}

class ShootLeft extends ControlState {
    /** Modify the target upon entering the state.
     *  @param {Gun} target - The player to modify. */
    startup(target) { 
        target.sprite.row = 2;
        target.addBullet(); 
    }

    /** Handle inputs and change control states when necessary. 
     *  @param {Gun} target - The player to modify. 
     *  @param {InputTracker} inputs - The currently tracked inputs. */
    update(target, inputs) {
        if (inputs.has('MouseMove')) target.updateDirection(inputs.get('MouseMove').pos);

        if (target.orientation === 'right') this.goToDest('CoolRight');
        else if (target.sprite.onLastFrameInRow()) this.goToDest('IdleLeft');
    }
}

class ShootRight extends ControlState {
    /** Modify the target upon entering the state.
     *  @param {Gun} target - The player to modify. */
    startup(target) { 
        target.sprite.row = 3;
        target.addBullet();
    }

    /** Handle inputs and change control states when necessary. 
     *  @param {Gun} target - The player to modify. 
     *  @param {InputTracker} inputs - The currently tracked inputs. */
    update(target, inputs) {
        if (inputs.has('MouseMove')) target.updateDirection(inputs.get('MouseMove').pos);

        if (target.orientation === 'left') this.goToDest('CoolLeft');
        else if (target.sprite.onLastFrameInRow()) this.goToDest('IdleRight');
    }
}

class CoolLeft extends ControlState {
    /** Modify the target upon entering the state.
     *  @param {Gun} target - The player to modify. */
    startup(target) { target.sprite.row_continue = 2; }

    /** Handle inputs and change control states when necessary. 
     *  @param {Gun} target - The player to modify. 
     *  @param {InputTracker} inputs - The currently tracked inputs. */
    update(target, inputs) {
        if (inputs.has('MouseMove')) target.updateDirection(inputs.get('MouseMove').pos);

        if (target.orientation === 'right') this.goToDest('CoolRight');
        else if (target.sprite.onLastFrameInRow()) this.goToDest('IdleLeft');
    }
}

class CoolRight extends ControlState {
    /** Modify the target upon entering the state.
     *  @param {Gun} target - The player to modify. */
    startup(target) { target.sprite.row_continue = 3; }

    /** Handle inputs and change control states when necessary. 
     *  @param {Gun} target - The player to modify. 
     *  @param {InputTracker} inputs - The currently tracked inputs. */
    update(target, inputs) {
        if (inputs.has('MouseMove')) target.updateDirection(inputs.get('MouseMove').pos);

        if (target.orientation === 'left') this.goToDest('CoolLeft');
        else if (target.sprite.onLastFrameInRow()) this.goToDest('IdleRight');
    }
}

/** All the states needed for controlling a gun.
 *  @type {Object<string, ControlState>} 
 *  @memberof GameObjects.Controller.Gun */
const gunStandard = {
    'IdleLeft': new IdleLeft(),
    'IdleRight': new IdleRight(),
    'ShootLeft': new ShootLeft(),
    'ShootRight': new ShootRight(),
    'CoolLeft': new CoolLeft(),
    'CoolRight': new CoolRight()
};

export default gunStandard;
