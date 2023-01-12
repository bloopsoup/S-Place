export default class Pool {
    /** Handles layers of game objects. */

    constructor(layers, collisionOrder) { 
        this.layers = layers;
        this.collisionOrder = collisionOrder;

        this.handleLayerCollisions = this.handleLayerCollisions.bind(this);
    }

    getLayer(layerName) { return this.layers[layerName]; }
    addLayer(layerName, layer) { this.layers[layerName] = layer; }
    removeLayer(layerName) { delete this.layers[layerName]; }

    addObjectToLayer(layerName, gameObject) { 
        gameObject.setPoolHook(this.addObjectToLayer); 
        this.layers[layerName].addObject(gameObject); 
    }
    addObjectsToLayer(layerName, gameObjects) {
        gameObjects.forEach(i => i.setPoolHook(this.addObjectToLayer));
        this.layers[layerName].addObjects(gameObjects);
    }

    handleLayerCollisions() {
        for (let i in this.collisionOrder) {
            const [ a, b, buffered ] = this.collisionOrder[i]
            this.getLayer(a).handleCollisions(this.getLayer(b), buffered);
        }
    }

    handleInputs(inputs) { Object.keys(this.layers).forEach(key => this.layers[key].handleInputs(inputs)); }

    update(dt) { this.handleLayerCollisions(); Object.keys(this.layers).forEach(key => this.layers[key].update(dt)); }

    draw(context) { Object.keys(this.layers).forEach(key => this.layers[key].draw(context)); }
}
