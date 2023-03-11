import ControlState from './controlState.js';
import { Player } from '../entities/index.js';
import { InputTracker, Vector2 } from '../../common/index.js';

/** When the target is not moving and facing leftwards.
 *  @augments ControlState */
class StandingLeft extends ControlState {
    /** Modify the target upon entering the state.
     *  @param {Player} target - The player to modify. */
    startup(target) { target.sprite.row = 0; }

    /** Handle inputs and change control states when necessary. 
     *  @param {Player} target - The player to modify. 
     *  @param {InputTracker} inputs - The currently tracked inputs. */
    update(target, inputs) {
        if (target.movable.velocity.y > 0) this.goToDest('FallingLeft');
        else if (inputs.has('w')) { target.movable.jump(); this.goToDest('JumpingLeft'); }
        else if (inputs.has('d')) this.goToDest('RunningRight');
        else if (inputs.has('a')) this.goToDest('RunningLeft');
        target.movable.fall();
    }
}

/** When the target is not moving and facing rightwards. 
 *  @augments ControlState */
class StandingRight extends ControlState {
    /** Modify the target upon entering the state.
     *  @param {Player} target - The player to modify. */
    startup(target) { target.sprite.row = 1; }

    /** Handle inputs and change control states when necessary. 
     *  @param {Player} target - The player to modify. 
     *  @param {InputTracker} inputs - The currently tracked inputs. */
    update(target, inputs) {
        if (target.movable.velocity.y > 0) this.goToDest('FallingRight');
        else if (inputs.has('w')) { target.movable.jump(); this.goToDest('JumpingRight'); }
        else if (inputs.has('d')) this.goToDest('RunningRight');
        else if (inputs.has('a')) this.goToDest('RunningLeft');
        target.movable.fall();
    }
}

/** When the target is running and facing leftwards. 
 *  @augments ControlState */
class RunningLeft extends ControlState {
    /** Modify the target upon entering the state.
     *  @param {Player} target - The player to modify. */
    startup(target) { target.sprite.row = 2; }

    /** Handle inputs and change control states when necessary. 
     *  @param {Player} target - The player to modify. 
     *  @param {InputTracker} inputs - The currently tracked inputs. */
    update(target, inputs) {
        if (target.movable.velocity.y > 0) this.goToDest('FallingLeft');
        else if (inputs.has('w')) { target.movable.jump(); this.goToDest('JumpingLeft'); }
        else if (inputs.has('d')) this.goToDest('RunningRight');
        else if (inputs.has('a')) target.movable.incrementVelocity(new Vector2(-1, 0));
        else this.goToDest('StandingLeft');
        target.movable.fall();
    }
}

/** When the target is running and facing rightwards. 
 *  @augments ControlState */
class RunningRight extends ControlState {
    /** Modify the target upon entering the state.
     *  @param {Player} target - The player to modify. */
    startup(target) { target.sprite.row = 3; }

    /** Handle inputs and change control states when necessary. 
     *  @param {Player} target - The player to modify. 
     *  @param {InputTracker} inputs - The currently tracked inputs. */
    update(target, inputs) {
        if (target.movable.velocity.y > 0) this.goToDest('FallingRight');
        else if (inputs.has('w')) { target.movable.jump(); this.goToDest('JumpingRight'); }
        else if (inputs.has('d')) target.movable.incrementVelocity(new Vector2(1, 0));
        else if (inputs.has('a')) this.goToDest('RunningLeft');
        else this.goToDest('StandingRight');
        target.movable.fall();
    }
}

/** When the target is jumping and facing leftwards. 
 *  @augments ControlState */
class JumpingLeft extends ControlState {
    /** Modify the target upon entering the state.
     *  @param {Player} target - The player to modify. */
    startup(target) { target.sprite.row = 4; }

    /** Handle inputs and change control states when necessary. 
     *  @param {Player} target - The player to modify. 
     *  @param {InputTracker} inputs - The currently tracked inputs. */
    update(target, inputs) {
        if (target.movable.velocity.y >= 0) this.goToDest('FallingLeft');
        else if (inputs.has('d')) this.goToDest('JumpingRight');
        else if (inputs.has('a')) target.movable.incrementVelocity(new Vector2(-1, 0));
        target.movable.fall();
    }
}

/** When the target is jumping and facing rightwards. 
 *  @augments ControlState */
class JumpingRight extends ControlState {
    /** Modify the target upon entering the state.
     *  @param {Player} target - The player to modify. */
    startup(target) { target.sprite.row = 5; }

    /** Handle inputs and change control states when necessary. 
     *  @param {Player} target - The player to modify. 
     *  @param {InputTracker} inputs - The currently tracked inputs. */
    update(target, inputs) {
        if (target.movable.velocity.y >= 0) this.goToDest('FallingRight');
        else if (inputs.has('d')) target.movable.incrementVelocity(new Vector2(1, 0));
        else if (inputs.has('a')) this.goToDest('JumpingLeft');
        target.movable.fall();
    }
}

/** When the target is falling and facing leftwards.
 *  @augments ControlState */
class FallingLeft extends ControlState {
    /** Modify the target upon entering the state.
     *  @param {Player} target - The player to modify. */
    startup(target) { target.sprite.row = 0; }

    /** Handle inputs and change control states when necessary. 
     *  @param {Player} target - The player to modify. 
     *  @param {InputTracker} inputs - The currently tracked inputs. */
    update(target, inputs) {
        if (target.movable.velocity.y === 0) this.goToDest('StandingLeft');
        else if (inputs.has('d')) this.goToDest('FallingRight');
        else if (inputs.has('a')) target.movable.incrementVelocity(new Vector2(-1, 0));
        target.movable.fall();
    }
}

/** When the target is falling and facing rightwards.
 *  @augments ControlState */
class FallingRight extends ControlState {
    /** Modify the target upon entering the state.
     *  @param {Player} target - The player to modify. */
    startup(target) { target.sprite.row = 1; }

    /** Handle inputs and change control states when necessary. 
     *  @param {Player} target - The player to modify. 
     *  @param {InputTracker} inputs - The currently tracked inputs. */
    update(target, inputs) {
        if (target.movable.velocity.y === 0) this.goToDest('StandingRight');
        else if (inputs.has('d')) target.movable.incrementVelocity(new Vector2(1, 0));
        else if (inputs.has('a')) this.goToDest('FallingLeft');
        target.movable.fall();
    }
}

/** All the states needed for controlling a player.
 *  @type {Object<string, ControlState>} 
 *  @memberof GameObjects.Controller */
const playerStates = {
    'StandingLeft': new StandingLeft(),
    'StandingRight': new StandingRight(),
    'RunningLeft': new RunningLeft(),
    'RunningRight': new RunningRight(),
    'JumpingLeft': new JumpingLeft(),
    'JumpingRight': new JumpingRight(),
    'FallingLeft': new FallingLeft(),
    'FallingRight': new FallingRight()
};

export default playerStates;
