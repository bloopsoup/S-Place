import GameObject from "../game-object.js";
import { InputTracker } from '../../common/index.js';

/** Handles a list of gameObjects. Meant to be used with Pool which manages multiple
 *  layers of game objects. This extra level of indirection in managing objects allows
 *  an object-to-object collision system to be clearly defined, as well as a definite
 *  ordering in how elements are layered on screen. 
 *  @memberof GameObjects.Management */
class Layer {
    /** @type {Array<GameObject>} */
    #gameObjects

    /** Create the Layer. */
    constructor() { this.#gameObjects = []; }

    /** Add an object to the layer.
     *  @param {GameObject} gameObject - The game object to add. */
    addObject(gameObject) { this.#gameObjects.push(gameObject); }

    /** Add many objects to the layer.
     *  @param {Array<GameObject>} gameObjects - The game objects to add. */
    addObjects(gameObjects) { this.#gameObjects.push(...gameObjects); }

    /** Remove objects from the layer that are marked from deletion. */
    clean() { this.#gameObjects = this.#gameObjects.filter(i => !i.canDelete); }

    /** Handle collisions between the game objects of this layer and the 
     *  game objects of another layer.
     *  @param {Layer} other - The other layer. */
    handleCollisions(other) {
        for (let i in this.#gameObjects) {
            const a = this.#gameObjects[i];
            for (let j in other.#gameObjects) {
                const b = other.#gameObjects[j];
                a.handleCollisions(b);
            }
        }
    }

    /** Pass down the currently tracked inputs and update the components of 
     *  the layer's game objects. 
     *  @param {InputTracker} inputs - The currently tracked inputs. */
    update(inputs) { this.clean(); this.#gameObjects.forEach(i => i.update(inputs)); }

    /** Draw the layer's GameObjects.
     *  @param {CanvasRenderingContext2D} context - The context to draw on.
     *  @param {number} alpha - Used for interpolation when rendering between two states. */
    draw(context, alpha) { this.#gameObjects.forEach(i => i.draw(context, alpha)); }
}

export default Layer;
