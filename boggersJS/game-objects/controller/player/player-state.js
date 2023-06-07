import ControlState from '../control-state.js';
import { Player } from '../../entities/index.js';

/** A player control state.
 *  @augments ControlState
 *  @memberof GameObjects.Controller.Player */
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

export default PlayerState;
