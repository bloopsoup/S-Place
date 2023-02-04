import ControlState from './controlState.js';
import { Vector2 } from '../../common/index.js';

class StandingLeft extends ControlState {
    startup(target) { target.sprite.row = 1; }

    handleInputs(target, inputs) {
        if (inputs.has('w')) this.goToDest('JumpingLeft');
        else if (inputs.has('d')) this.goToDest('RunningRight');
        else if (inputs.has('a')) this.goToDest('RunningLeft');
    }
}

class StandingRight extends ControlState {
    startup(target) { target.sprite.row = 0; }

    handleInputs(target, inputs) {
        if (inputs.has('w')) this.goToDest('JumpingRight');
        else if (inputs.has('d')) this.goToDest('RunningRight');
        else if (inputs.has('a')) this.goToDest('RunningLeft');
    }
}

class RunningLeft extends ControlState {
    startup(target) { target.sprite.row = 7; }

    handleInputs(target, inputs) {
        if (inputs.has('w')) this.goToDest('JumpingLeft');
        else if (inputs.has('d')) this.goToDest('RunningRight');
        else if (inputs.has('a')) target.movable.incrementVelocity(new Vector2(-1, 0));
        else this.goToDest('StandingLeft');
    }
}

class RunningRight extends ControlState {
    startup(target) { target.sprite.row = 6; }

    handleInputs(target, inputs) {
        if (inputs.has('w')) this.goToDest('JumpingRight');
        else if (inputs.has('d')) target.movable.incrementVelocity(new Vector2(1, 0));
        else if (inputs.has('a')) this.goToDest('RunningLeft');
        else this.goToDest('StandingRight');
    }
}

class JumpingLeft extends ControlState {
    startup(target) {
        if (target.movable.canJump) target.movable.jump();
        target.sprite.row = 3;
    }

    handleInputs(target, inputs) {
        if (target.movable.canJump) this.goToDest('StandingLeft');
        else if (inputs.has('d')) this.goToDest('JumpingRight');
        else if (inputs.has('a')) target.movable.incrementVelocity(new Vector2(-1, 0));
    }
}

class JumpingRight extends ControlState {
    startup(target) {
        if (target.movable.canJump) { target.movable.jump(); }
        target.sprite.row = 2;
    }

    handleInputs(target, inputs) {
        if (target.movable.canJump) this.goToDest('StandingRight');
        else if (inputs.has('d')) target.movable.incrementVelocity(new Vector2(1, 0));
        else if (inputs.has('a')) this.goToDest('JumpingLeft');
    }
}

const playerStates = {
    'StandingLeft': new StandingLeft(),
    'StandingRight': new StandingRight(),
    'RunningLeft': new RunningLeft(),
    'RunningRight': new RunningRight(),
    'JumpingLeft': new JumpingLeft(),
    'JumpingRight': new JumpingRight()
};

export default playerStates;
