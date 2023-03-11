import ControlState from './controlState.js';
import { Player } from '../entities/index.js';
import { InputTracker, Vector2 } from '../../common/index.js';

/** A player control state.
 *  @augments ControlState */
class PlayerState extends ControlState {
    /** Moves the Player based on its velocity and snaps when needed.
     *  @param {Player} target - The player to modify. */
    move(target) {
        target.movable.fall();
        target.movable.incrementPos();
        target.movable.snap();
        target.snapToTiles();
        target.movable.decrementVelocity(0);
    }
}

/** When the target is not moving and facing leftwards.
 *  @augments PlayerState */
class StandingLeft extends PlayerState {
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
        this.move(target);
    }
}

/** When the target is not moving and facing rightwards. 
 *  @augments PlayerState */
class StandingRight extends PlayerState {
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
        this.move(target);
    }
}

/** When the target is running and facing leftwards. 
 *  @augments PlayerState */
class RunningLeft extends PlayerState {
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
        this.move(target);
    }
}

/** When the target is running and facing rightwards. 
 *  @augments PlayerState */
class RunningRight extends PlayerState {
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
        this.move(target);
    }
}

/** When the target is jumping and facing leftwards. 
 *  @augments PlayerState */
class JumpingLeft extends PlayerState {
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
        this.move(target);
    }
}

/** When the target is jumping and facing rightwards. 
 *  @augments PlayerState */
class JumpingRight extends PlayerState {
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
        this.move(target);
    }
}

/** When the target is falling and facing leftwards.
 *  @augments PlayerState */
class FallingLeft extends PlayerState {
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
        this.move(target);
    }
}

/** When the target is falling and facing rightwards.
 *  @augments PlayerState */
class FallingRight extends PlayerState {
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
        this.move(target);
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
