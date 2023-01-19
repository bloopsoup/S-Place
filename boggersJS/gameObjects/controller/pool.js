import Layer from "./layer.js";

export default class Pool {
    /** Handles layers of gameObjects. */

    #layers
    #collisionOrder

    constructor(names, collisionOrder) { 
        this.#layers = {};
        names.forEach(i => this.#layers[i] = new Layer());
        this.#collisionOrder = collisionOrder;

        this.handleLayerCollisions = this.handleLayerCollisions.bind(this);
    }

    getLayer(name) { return this.#layers[name]; }
    addLayer(name, layer) { this.#layers[name] = layer; }
    removeLayer(name) { delete this.#layers[name]; }

    addObjectToLayer(name, gameObject) { 
        gameObject.poolHook = this.addObjectToLayer; 
        this.#layers[name].addObject(gameObject); 
    }
    addObjectsToLayer(name, gameObjects) {
        gameObjects.forEach(i => i.poolHook = this.addObjectToLayer);
        this.#layers[name].addObjects(gameObjects);
    }

    handleLayerCollisions() {
        for (let i in this.#collisionOrder) {
            const [ a, b, buffered ] = this.#collisionOrder[i]
            this.getLayer(a).handleCollisions(this.getLayer(b), buffered);
        }
    }

    handleInputs(inputs) { Object.keys(this.#layers).forEach(key => this.#layers[key].handleInputs(inputs)); }

    update(dt) { 
        this.handleLayerCollisions(); 
        Object.keys(this.#layers).forEach(key => this.#layers[key].update(dt)); 
    }

    draw(context) { Object.keys(this.#layers).forEach(key => this.#layers[key].draw(context)); }
}
