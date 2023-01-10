export default class Pool {
    /** Handles layers of game objects. */

    constructor(layers, collisionOrder) { 
        this.layers = layers;
        this.collisionOrder = collisionOrder;

        this.handleLayerCollisions = this.handleLayerCollisions.bind(this);
    }

    getLayer(layerName) { return this.layers[layerName]; }
    addLayer(layerName, layer) { this.layers[layerName] = layer; }
    addObjectToLayer(layerName, gameObject) { this.layers[layerName].add(gameObject); }
    removeLayer(layerName) { delete this.layers[layerName]; }

    handleLayerCollisions() {
        for (let i in this.collisionOrder) {
            const [ a, b, trigger ] = this.collisionOrder[i]
            this.getLayer(a).handleCollisions(this.getLayer(b), trigger);
        }
    }

    handleInputs(inputs) { Object.keys(this.layers).forEach(key => this.layers[key].handleInputs(inputs)); }

    update(dt) { this.handleLayerCollisions(); Object.keys(this.layers).forEach(key => this.layers[key].update(dt)); }

    draw(context) { Object.keys(this.layers).forEach(key => this.layers[key].draw(context)); }
}
