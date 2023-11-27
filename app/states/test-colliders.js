import { State, Settings, Loader } from '../../boggersJS/core/index.js';
import { Vector2, InputTracker } from '../../boggersJS/common/index.js';
import { RectangleCollider, CircleCollider, Rectangle, ColliderResolver, Collider } from '../../boggersJS/components/physics/index.js';

/** A state for testing colliders. */
class TestColliders extends State {
    /** Create a new state object. 
     *  @param {Settings} settings - The settings shared by all states.
     *  @param {Loader} loader - The asset loader used by all states to load images, sounds, etc. */
    constructor(settings, loader) {
        super(settings, loader);
        this.modes = ['ray', 'rect', 'circle'];
        this.currentMode = 0;

        this.targets = {
            'rect1': { 'collider': new RectangleCollider(new Rectangle(new Vector2(120, 140), new Vector2(500, 200))), 'result': null, 'mtv': null },
            'circle1': { 'collider': new CircleCollider(new Rectangle(new Vector2(100, 100), new Vector2(100, 200))), 'result': null, 'mtv': null }
        };
    
        this.origin = new Vector2(200, 50);
        this.inputRay = this.origin.copy();
        this.inputRect = new RectangleCollider(new Rectangle(new Vector2(40, 30), this.origin.copy()));
        this.inputCircle = new CircleCollider(new Rectangle(new Vector2(40, 40), this.origin.copy()));
    }

    /** Draws a rectangle collider.
     *  @param {RectangleCollider} collider - The collider to draw.
     *  @param {Vector2} offset - Position offset.
     *  @param {CanvasRenderingContext2D} context - The context to draw on. */
    #drawRectangleCollider(collider, offset, context) {
        const newPos = collider.aabb.pos.add(offset);
        const dimensions = collider.aabb.dimensions;
        context.strokeRect(newPos.x, newPos.y, dimensions.x, dimensions.y);
    }

    /** Draws a circle collider.
     *  @param {CircleCollider} collider - The collider to draw.
     *  @param {Vector2} offset - Position offset.
     *  @param {CanvasRenderingContext2D} context - The context to draw on. */
    #drawCircleCollider(collider, offset, context) {
        const newPos = collider.aabb.centerPos.add(offset);
        context.beginPath();
        context.arc(newPos.x, newPos.y, collider.radius, 0, 2 * Math.PI);
        context.stroke();
    }

    /** Draws the ray.
     *  @param {CanvasRenderingContext2D} context - The context to draw on. */
    #drawInputRay(context) {
        context.strokeStyle = 'Black';
        context.beginPath();
        context.moveTo(this.origin.x, this.origin.y);
        context.lineTo(this.inputRay.x, this.inputRay.y);
        context.stroke();
    }

    /** Draws the input collider including it's NEXT position.
     *  @param {Collider} inputCollider - The input collider. 
     *  @param {CanvasRenderingContext2D} context - The context to draw on. */
    #drawInputCollider(inputCollider, context) {
        const centerPos = inputCollider.aabb.centerPos;
        const nextCenterPos = inputCollider.aabb.nextCenterPos;

        // Draw the line segment denoting the velocity
        context.strokeStyle = 'Black';
        context.beginPath();
        context.moveTo(centerPos.x, centerPos.y);
        context.lineTo(nextCenterPos.x, nextCenterPos.y);
        context.stroke();

        // Draw the before and after
        if (RectangleCollider.prototype.isPrototypeOf(inputCollider)) {
            this.#drawRectangleCollider(inputCollider, new Vector2(0, 0), context);
            this.#drawRectangleCollider(inputCollider, inputCollider.aabb.velocity, context);
        } else {
            this.#drawCircleCollider(inputCollider, new Vector2(0, 0), context);
            this.#drawCircleCollider(inputCollider, inputCollider.aabb.velocity, context);
        }
    }

    /** Draws the target collider with collision information if available.
     *  @param {string} name - The name of the target collider.
     *  @param {Collider | null} inputCollider - The input collider. Null if it's a ray.
     *  @param {CanvasRenderingContext2D} context - The context to draw on. */
    #drawTargetCollider(name, inputCollider, context) {
        const { collider, result, mtv } = this.targets[name];
        context.strokeStyle = !result ? 'Green' : 'Red';
        
        // Draw the collider
        if (RectangleCollider.prototype.isPrototypeOf(collider)) this.#drawRectangleCollider(collider, new Vector2(0, 0), context);
        if (CircleCollider.prototype.isPrototypeOf(collider)) this.#drawCircleCollider(collider, new Vector2(0, 0), context);

        // Draw the collision
        if (!result) return;
        const contactPoint = result.contactPoint;
        const normalLine = result.contactNormal.mulScalar(50).add(contactPoint);

        // Draw the contact point
        context.fillRect(contactPoint.x, contactPoint.y, 10, 10);

        // Draw the normal
        context.beginPath();
        context.moveTo(contactPoint.x, contactPoint.y);
        context.lineTo(normalLine.x, normalLine.y);
        context.stroke();

        // Draw the shifted input collider
        if (!inputCollider) return;
        if (RectangleCollider.prototype.isPrototypeOf(inputCollider)) this.#drawRectangleCollider(inputCollider, mtv, context);
        if (CircleCollider.prototype.isPrototypeOf(inputCollider)) this.#drawCircleCollider(inputCollider, mtv, context);
    }

    // IGNORE
    startup() {}
    cleanup() {}

    /** Processes the inputs given by the InputHandler and updates components. 
     *  @param {InputTracker} inputs - The currently tracked inputs. */
    update(inputs) {        
        // Keyboard controls
        if (inputs.has('w')) this.origin.addToY(-2);
        if (inputs.has('a')) this.origin.addToX(-2);
        if (inputs.has('s')) this.origin.addToY(2);
        if (inputs.has('d')) this.origin.addToX(2);
        if (inputs.consumeInput('m')) this.currentMode = (this.currentMode + 1) % this.modes.length;

        // Update input collider positions
        if (inputs.has('MouseMove')) {
            this.inputRay = inputs.get('MouseMove').pos.copy();
            this.inputRect.aabb.velocity = inputs.get('MouseMove').pos.subCopy(this.inputRect.aabb.pos);
            this.inputCircle.aabb.velocity = inputs.get('MouseMove').pos.subCopy(this.inputCircle.aabb.pos);
        }
        this.inputRect.aabb.pos = this.origin.copy();
        this.inputCircle.aabb.pos = this.origin.copy();

        // Reset results
        for (const name in this.targets) {
            this.targets[name].result = null;
            this.targets[name].mtv = null;
        }
        
        // Check collisions depending on mode
        let collider = null;
        switch (this.modes[this.currentMode]) {
            case 'ray': 
                for (const name in this.targets) {
                    collider = this.targets[name].collider;
                    this.targets[name].result = collider.collidesWithRay(this.origin, this.inputRay.subCopy(this.origin));
                }
                break;
            case 'rect': 
                for (const name in this.targets) {
                    collider = this.targets[name].collider;
                    this.targets[name].result = ColliderResolver.checkSweptCollides(this.inputRect, collider);
                    this.targets[name].mtv = ColliderResolver.findMTV(this.inputRect, collider);
                }
                break;
            case 'circle':
                for (const name in this.targets) {
                    collider = this.targets[name].collider;
                    this.targets[name].result = ColliderResolver.checkSweptCollides(this.inputCircle, collider);
                    this.targets[name].mtv = ColliderResolver.findMTV(this.inputCircle, collider);
                }
                break;
        }
    }

    /** Draws state elements and game objects onto the canvas.
     *  @param {CanvasRenderingContext2D} context - The context to draw on.
     *  @param {number} alpha - Used for interpolation when rendering between two states. */
    draw(context, alpha) {
        context.save();
        context.lineWidth = 3;

        // Pick the current input collider
        let currentInputCollider = null;
        switch (this.modes[this.currentMode]) {
            case 'ray': 
                this.#drawInputRay(context); 
                break;
            case 'rect': 
                this.#drawInputCollider(this.inputRect, context);
                currentInputCollider = this.inputRect;
                break;
            case 'circle': 
                this.#drawInputCollider(this.inputCircle, context); 
                currentInputCollider = this.inputCircle;
                break;
        }

        // Draw the input collider interacting with the targets
        for (const name in this.targets) this.#drawTargetCollider(name, currentInputCollider, context);

        context.restore();
    }
}

export default TestColliders;
