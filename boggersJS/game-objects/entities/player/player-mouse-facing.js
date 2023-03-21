import Player from './player.js';
import PlayerState from './player-state.js';
import { ControlState } from '../../controller/index.js';
import { InputTracker, Vector2 } from '../../../common/index.js';

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
        if (inputs.has('MouseMove')) target.updateOrientation(inputs.get('MouseMove').pos);

        if (target.movable.velocity.y > 0) this.goToDest('FallingLeft');
        else if (target.orientation === 'right') this.goToDest('StandingRight');
        else if (inputs.has('w')) { target.movable.jump(); this.goToDest('JumpingLeft'); }
        else if (inputs.has('d') || inputs.has('a')) this.goToDest('RunningLeft');
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
        if (inputs.has('MouseMove')) target.updateOrientation(inputs.get('MouseMove').pos);

        if (target.movable.velocity.y > 0) this.goToDest('FallingRight');
        else if (target.orientation === 'left') this.goToDest('StandingLeft');
        else if (inputs.has('w')) { target.movable.jump(); this.goToDest('JumpingRight'); }
        else if (inputs.has('d') || inputs.has('a')) this.goToDest('RunningRight');
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
        if (inputs.has('MouseMove')) target.updateOrientation(inputs.get('MouseMove').pos);

        if (target.movable.velocity.y > 0) this.goToDest('FallingLeft');
        else if (target.orientation === 'right') this.goToDest('RunningRight');
        else if (inputs.has('w')) { target.movable.jump(); this.goToDest('JumpingLeft'); }
        else if (inputs.has('d')) target.movable.incrementVelocity(new Vector2(1, 0));
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
        if (inputs.has('MouseMove')) target.updateOrientation(inputs.get('MouseMove').pos);

        if (target.movable.velocity.y > 0) this.goToDest('FallingRight');
        else if (target.orientation === 'left') this.goToDest('RunningLeft');
        else if (inputs.has('w')) { target.movable.jump(); this.goToDest('JumpingRight'); }
        else if (inputs.has('d')) target.movable.incrementVelocity(new Vector2(1, 0));
        else if (inputs.has('a')) target.movable.incrementVelocity(new Vector2(-1, 0));
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
        if (inputs.has('MouseMove')) target.updateOrientation(inputs.get('MouseMove').pos);

        if (target.movable.velocity.y >= 0) this.goToDest('FallingLeft');
        else if (target.orientation === 'right') this.goToDest('JumpingRight');
        else if (inputs.has('d')) target.movable.incrementVelocity(new Vector2(1, 0));
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
        if (inputs.has('MouseMove')) target.updateOrientation(inputs.get('MouseMove').pos);

        if (target.movable.velocity.y >= 0) this.goToDest('FallingRight');
        else if (target.orientation === 'left') this.goToDest('JumpingLeft');
        else if (inputs.has('d')) target.movable.incrementVelocity(new Vector2(1, 0));
        else if (inputs.has('a')) target.movable.incrementVelocity(new Vector2(-1, 0));
        this.move(target);
    }
}

/** When the target is falling and facing leftwards.
 *  @augments PlayerState */
class FallingLeft extends PlayerState {
    /** Modify the target upon entering the state.
     *  @param {Player} target - The player to modify. */
    startup(target) { target.sprite.row = 6; }

    /** Handle inputs and change control states when necessary. 
     *  @param {Player} target - The player to modify. 
     *  @param {InputTracker} inputs - The currently tracked inputs. */
    update(target, inputs) {
        if (inputs.has('MouseMove')) target.updateOrientation(inputs.get('MouseMove').pos);

        if (target.movable.velocity.y === 0) this.goToDest('StandingLeft');
        else if (target.orientation === 'right') this.goToDest('FallingRight');
        else if (inputs.has('d')) target.movable.incrementVelocity(new Vector2(1, 0));
        else if (inputs.has('a')) target.movable.incrementVelocity(new Vector2(-1, 0));
        this.move(target);
    }
}

/** When the target is falling and facing rightwards.
 *  @augments PlayerState */
class FallingRight extends PlayerState {
    /** Modify the target upon entering the state.
     *  @param {Player} target - The player to modify. */
    startup(target) { target.sprite.row = 7; }

    /** Handle inputs and change control states when necessary. 
     *  @param {Player} target - The player to modify. 
     *  @param {InputTracker} inputs - The currently tracked inputs. */
    update(target, inputs) {
        if (inputs.has('MouseMove')) target.updateOrientation(inputs.get('MouseMove').pos);

        if (target.movable.velocity.y === 0) this.goToDest('StandingRight');
        else if (target.orientation === 'left') this.goToDest('FallingLeft');
        else if (inputs.has('d')) target.movable.incrementVelocity(new Vector2(1, 0));
        else if (inputs.has('a')) target.movable.incrementVelocity(new Vector2(-1, 0));
        this.move(target);
    }
}

/** All the states needed for controlling a player.
 *  @type {Object<string, ControlState>} 
 *  @memberof GameObjects.Entities.Player */
const playerMouseFacing = {
    'StandingLeft': new StandingLeft(),
    'StandingRight': new StandingRight(),
    'RunningLeft': new RunningLeft(),
    'RunningRight': new RunningRight(),
    'JumpingLeft': new JumpingLeft(),
    'JumpingRight': new JumpingRight(),
    'FallingLeft': new FallingLeft(),
    'FallingRight': new FallingRight()
};

export default playerMouseFacing;
