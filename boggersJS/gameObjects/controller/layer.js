import GameObject from "../gameObject.js";
import { InputTracker } from '../../common/index.js';

/** Handles a list of gameObjects. Meant to be used with Pool which manages multiple
 *  layers of game objects. This extra level of indirection in managing objects allows
 *  an object-to-object collision system to be clearly defined, as well as a definite
 *  ordering in how elements are layered on screen. 
 *  @memberof GameObjects.Controller */
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

    /** Pass down the currently tracked inputs to the layer's game objects.
     *  @param {InputTracker} inputs - The currently tracked inputs. */
    handleInputs(inputs) { this.#gameObjects.forEach(i => i.handleInputs(inputs)); }

    /** Update the components of the layer's game objects.
     *  @param {number} dt - The time between the last two frames. */
    update(dt) { this.clean(); this.#gameObjects.forEach(i => i.update(dt)); }

    /** Draw the layer's GameObjects.
     *  @param {CanvasRenderingContext2D} context - The context to draw on. */
    draw(context) { this.#gameObjects.forEach(i => i.draw(context)); }
}

export default Layer;
