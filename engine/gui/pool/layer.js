export default class Layer {
    /** Handles a list of game objects. To be used with Pool. */

    constructor() { this.gameObjects = []; }

    addObject(gameObject) { this.gameObjects.push(gameObject); }
    addObjects(gameObjects) { this.gameObjects.push(...gameObjects); }
    clean() { this.gameObjects = this.gameObjects.filter(i => !i.canDelete()); }

    handleCollisions(other, buffered) {
        for (let i in this.gameObjects) {
            const gameObjectA = this.gameObjects[i];
            for (let j in other.gameObjects) {
                const gameObjectB = other.gameObjects[j];
                gameObjectA.handleCollisions(gameObjectB, buffered);
            }
        }
    }

    handleInputs(inputs) { this.gameObjects.forEach(i => i.handleInputs(inputs)); }

    update(dt) { this.clean(); this.gameObjects.forEach(i => i.update(dt)); }

    draw(context) { this.gameObjects.forEach(i => i.draw(context)); }
}
