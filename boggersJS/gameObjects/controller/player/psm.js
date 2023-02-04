class PlayerStateManager {
    #player
    #currentStateName
    #states
    #currentState

    constructor(start, states, player) {
        this.#player = player;
        this.#currentStateName = start, this.#states = states;
        this.#currentState = this.#states[this.#currentStateName];
        this.#currentState.startup(this.#player);
    }

    changeStates() {
        this.#currentStateName = this.#currentState.next;
        this.#currentState.reset();
        this.#currentState = this.#states[this.#currentStateName];
        this.#currentState.startup(this.#player);
    }

    update() { if (this.#currentState.isDone) this.changeStates(); }

    passInputs(inputs) { this.#currentState.handleInputs(this.#player, inputs); }
}

class PlayerState {
    #next
    #isDone

    constructor() { this.#isDone = false; }

    get next() { return this.#next; }

    get isDone() { return this.#isDone; }

    startup(player) {}

    reset() { this.#isDone = false; }

    handleInputs(player, inputs) { }

    goToDest(dest) {
        this.#next = dest;
        this.#isDone = true; 
    }
}

class StandingLeft extends PlayerState {
    startup(player) {
        // player.sprite.row = 0;
        console.log('STANDING LEFT');
    }
    handleInputs(player, inputs) {
        if (inputs.has('w')) this.goToDest('JumpingLeft');
        else if (inputs.has('d')) this.goToDest('RunningRight');
        else if (inputs.has('a')) this.goToDest('RunningLeft');
    }
}

class StandingRight extends PlayerState {
    startup(player) {
        // player.sprite.row = 1;
        console.log('STANDING RIGHT');
    }
    handleInputs(player, inputs) {
        if (inputs.has('w')) this.goToDest('JumpingRight');
        else if (inputs.has('d')) this.goToDest('RunningRight');
        else if (inputs.has('a')) this.goToDest('RunningLeft');
    }
}

class RunningLeft extends PlayerState {
    startup(player) { 
        // player.sprite.row = 2;
        console.log('RUNNING LEFT');
    }
    handleInputs(player, inputs) {
        if (inputs.has('w')) this.goToDest('JumpingLeft');
        else if (inputs.has('d')) this.goToDest('RunningRight');
        else if (!inputs.has('a')) this.goToDest('StandingLeft');
    }
}

class RunningRight extends PlayerState {
    startup(player) { 
        // player.sprite.row = 3;
        console.log('RUNNING RIGHT');
    }
    handleInputs(player, inputs) {
        if (inputs.has('w')) this.goToDest('JumpingRight');
        else if (inputs.has('a')) this.goToDest('RunningLeft');
        else if (!inputs.has('d')) this.goToDest('StandingRight');
    }
}

class JumpingLeft extends PlayerState {
    startup(player) { 
        // player.sprite.row = 4;
        console.log('JUMPING LEFT');
    }
    handleInputs(player, inputs) {
        if (inputs.has('d')) this.goToDest('JumpingRight');
        else if (player.movable.canJump) this.goToDest('StandingLeft');
    }
}

class JumpingRight extends PlayerState {
    startup(player) { 
        // player.sprite.row = 5;
        console.log('JUMPING RIGHT');
    }
    handleInputs(player, inputs) {
        if (inputs.has('a')) this.goToDest('JumpingLeft');
        else if (player.movable.canJump) this.goToDest('StandingRight');
    }
}

const states = {
    'StandingLeft': new StandingLeft(),
    'StandingRight': new StandingRight(),
    'RunningLeft': new RunningLeft(),
    'RunningRight': new RunningRight(),
    'JumpingLeft': new JumpingLeft(),
    'JumpingRight': new JumpingRight()
}

export { PlayerStateManager, states };
