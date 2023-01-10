export default class Layer {
    /** Handles a list of game objects. To be used with Pool. */

    constructor(gameObjects) { this.gameObjects = gameObjects; }

    addObject(gameObject) { this.gameObjects.push(gameObject); }
    clean() { this.gameObjects = this.gameObjects.filter(i => !i.canDelete()); }

    handleCollisions(other, trigger) {
        for (let i in this.gameObjects) {
            const gameObjectA = this.gameObjects[i];
            for (let j in other.gameObjects) {
                const gameObjectB = other.gameObjects[j];
                gameObjectA.getCollidable().runTrigger(gameObjectB.getCollidable(), trigger);
            }
        }
    }

    handleInputs(inputs) { this.gameObjects.forEach(i => i.handleInputs(inputs)); }

    update(dt) { this.clean(); this.gameObjects.forEach(i => i.update(dt)); }

    draw(context) { this.gameObjects.forEach(i => i.draw(context)); }
}
