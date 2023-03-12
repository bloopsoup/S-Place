import Player from './player.js';
import { ControlState } from '../../controller/index.js';

/** A player control state.
 *  @augments ControlState
 *  @memberof GameObjects.Entities.Player */
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
