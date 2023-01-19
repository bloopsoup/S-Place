export default class Layer {
    /** Handles a list of gameObjects. To be used with Pool. */

    #gameObjects

    constructor() { this.#gameObjects = []; }

    addObject(gameObject) { this.#gameObjects.push(gameObject); }
    addObjects(gameObjects) { this.#gameObjects.push(...gameObjects); }
    clean() { this.#gameObjects = this.#gameObjects.filter(i => !i.canDelete()); }

    handleCollisions(other, buffered) {
        for (let i in this.#gameObjects) {
            const a = this.#gameObjects[i];
            for (let j in other.#gameObjects) {
                const b = other.#gameObjects[j];
                a.handleCollisions(b, buffered);
            }
        }
    }

    handleInputs(inputs) { this.#gameObjects.forEach(i => i.handleInputs(inputs)); }

    update(dt) { this.clean(); this.#gameObjects.forEach(i => i.update(dt)); }

    draw(context) { this.#gameObjects.forEach(i => i.draw(context)); }
}
