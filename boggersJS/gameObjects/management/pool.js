import Layer from "./layer.js";
import GameObject from "../gameObject.js";
import { Controller } from '../controller/index.js';
import { InputTracker } from '../../common/index.js';

/** Responsible for handling layers of GameObjects. This means it has to pass inputs, 
 *  update the state, and draw the sprites of all the GameObjects that lie in all of
 *  the layers. It is also responsible for passing in 'hooks' to newly added GameObjects 
 *  so that the objects themselves can add/remove elements to the pool when needed. 
 * 
 *  Having a Pool of objects allows support for an object-to-object collision system
 *  as collisions between objects can be handled through layers. 
 *  @memberof GameObjects.Management */
class Pool {
    /** @type {Object<string, Layer>} */
    #layers
    /** @type {Array<Controller>} */
    #controllers
    /** @type {Array<Array<string>>} */
    #collisionOrder

    /** Create the Pool.
     *  @param {Array<string>} names - The names of the layers in the Pool. 
     *  @param {Array<Array<string>>} collisionOrder - A list of pairs of strings which
     *      denote the order in which collisions are checked. The first element is the name
     *      of the layer handling collisions and the second element is the name of the layer
     *      that's being collided with. 
     *  @example <caption>Creating a Pool object with collision checking.</caption>
     *  // Create the Pool with three layers and have layer1 check for collisions with layer2 and layer3
     *  // Note that when processing collisions, layer1 will check for collisions with layer3 FIRST.
     *  const pool = Pool(['layer1', 'layer2', 'layer3'], [['layer1', 'layer3'], ['layer2', 'layer3']]); */
    constructor(names, collisionOrder) { 
        this.#layers = {};
        this.#controllers = [];
        
        names.forEach(i => this.#layers[i] = new Layer());
        this.#collisionOrder = collisionOrder;

        this.addObjectToLayer = this.addObjectToLayer.bind(this);
        this.addObjectsToLayer = this.addObjectsToLayer.bind(this);
        this.handleLayerCollisions = this.handleLayerCollisions.bind(this);
    }

    /** Gets a layer from the Pool.
     *  @param {string} name - The name of the layer to retrieve. 
     *  @returns {Layer} The returned Layer. */
    getLayer(name) { return this.#layers[name]; }

    /** Add a new layer to the Pool.
     *  @param {string} name - The name of the layer to add. */
    addLayer(name) { this.#layers[name] = new Layer(); }

    /** Delete a layer from the Pool.
     *  @param {string} name - The name of the layer to delete. */
    removeLayer(name) { delete this.#layers[name]; }

    /** Add a GameObject to a specific layer in the Pool.
     *  @param {string} name - The name of the layer to add to.
     *  @param {GameObject} gameObject - The GameObject. */
    addObjectToLayer(name, gameObject) { 
        gameObject.poolHook = this.addObjectToLayer; 
        this.#layers[name].addObject(gameObject); 
    }

    /** Add many of GameObjects to a specific layer in the Pool.
     *  @param {string} name - The name of the layer to add to.
     *  @param {Array<GameObject>} gameObjects - The list of GameObjects. */
    addObjectsToLayer(name, gameObjects) {
        gameObjects.forEach(i => i.poolHook = this.addObjectToLayer);
        this.#layers[name].addObjects(gameObjects);
    }

    /** Adds a controller to the Pool.
     *  @param {Controller} controller - The controller to add. */
    addController(controller) { this.#controllers.push(controller); }

    /** Handles collisions between layers, processing it according to
     *  the collision order. */
    handleLayerCollisions() {
        for (let i in this.#collisionOrder) {
            const [ a, b ] = this.#collisionOrder[i]
            this.getLayer(a).handleCollisions(this.getLayer(b));
        }
    }

    /** Pass the currently tracked inputs into all layers.
     *  @param {InputTracker} inputs - The currently tracked inputs. */
    handleInputs(inputs) { 
        Object.keys(this.#layers).forEach(key => this.#layers[key].handleInputs(inputs)); 
        this.#controllers.forEach(controller => controller.passInputs(inputs));
    }

    /** Updates the state of the game objects contained in all layers.
     *  @param {number} dt - The milliseconds between the last two frames. */
    update(dt) { 
        this.handleLayerCollisions(); 
        Object.keys(this.#layers).forEach(key => this.#layers[key].update(dt)); 
    }

    /** Draw the game objects contained in all layers.
     *  @param {CanvasRenderingContext2D} context - The context to draw on. */
    draw(context) { Object.keys(this.#layers).forEach(key => this.#layers[key].draw(context)); }
}

export default Pool;
