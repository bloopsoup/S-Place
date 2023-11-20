import { State, Settings, Loader } from '../../boggersJS/core/index.js';
import { Vector2, InputTracker } from '../../boggersJS/common/index.js';
import { RectangleCollider, CircleCollider, Rectangle, ColliderResolver } from '../../boggersJS/components/index.js';

/** A state for testing colliders. */
class TestColliders extends State {
    /** Create a new state object. 
     *  @param {Settings} settings - The settings shared by all states.
     *  @param {Loader} loader - The asset loader used by all states to load images, sounds, etc. */
    constructor(settings, loader) {
        super(settings, loader);
        this.modes = ['ray', 'rect']
        this.currentMode = 0;
    
        this.origin = new Vector2(20, 20);
        this.end = this.origin.copy();
        this.endCollider = new RectangleCollider(new Rectangle(new Vector2(30, 30), this.origin.copy()));

        this.aabb1 = new Rectangle(new Vector2(50, 60), new Vector2(200, 200));
        this.rectCollider1 = new RectangleCollider(this.aabb1);
        this.rectColliderResult = null;
        this.rectColliderMTV = null;

        this.aabb2 = new Rectangle(new Vector2(70, 70), new Vector2(100, 200));
        this.circleCollider1 = new CircleCollider(this.aabb2);
        this.circleColliderResult = null;
    }

    // IGNORE
    startup() {}
    cleanup() {}

    /** Processes the inputs given by the InputHandler and updates components. 
     *  @param {InputTracker} inputs - The currently tracked inputs. */
    update(inputs) {
        if (inputs.has('MouseMove')) {
            inputs.get('MouseMove').pos.copyTo(this.end);
            inputs.get('MouseMove').pos.copyTo(this.endCollider.aabb.pos);
        }
        
        if (inputs.consumeInput('w')) this.origin.addToY(-10);
        if (inputs.consumeInput('a')) this.origin.addToX(-10);
        if (inputs.consumeInput('s')) this.origin.addToY(10);
        if (inputs.consumeInput('d')) this.origin.addToX(10);
        if (inputs.consumeInput('m')) this.currentMode = (this.currentMode + 1) % this.modes.length;

        // Reset results
        this.origin.copyTo(this.endCollider.aabb.oldPos);
        this.rectColliderResult = null;
        this.rectColliderMTV = null;
        this.circleColliderResult = null;
        
        // Check collisions depending on mode
        if (this.modes[this.currentMode] == 'ray') {
            this.rectColliderResult = this.rectCollider1.collidesWithRay(this.origin, this.end.subCopy(this.origin));
            this.circleColliderResult = this.circleCollider1.collidesWithRay(this.origin, this.end.subCopy(this.origin));
        } else if (this.modes[this.currentMode] == 'rect') {
            this.rectColliderResult = ColliderResolver.checkSweptRectToRectCollides(this.endCollider, this.rectCollider1);
            this.rectColliderMTV = ColliderResolver.findSweptRectToRectMTV(this.endCollider, this.rectCollider1);
        }
    }

    /** Draws the testing rectangle.
     *  @param {CanvasRenderingContext2D} context - The context to draw on. */
    drawRectangle(context) {
        context.strokeStyle = 'Black';
        context.beginPath();
        context.moveTo(this.endCollider.aabb.oldCenterPos.x, this.endCollider.aabb.oldCenterPos.y);
        context.lineTo(this.endCollider.aabb.centerPos.x, this.endCollider.aabb.centerPos.y);
        context.stroke();
        context.strokeRect(this.endCollider.aabb.oldPos.x, this.endCollider.aabb.oldPos.y, this.endCollider.aabb.dimensions.x, this.endCollider.aabb.dimensions.y);
        context.strokeRect(this.endCollider.aabb.pos.x, this.endCollider.aabb.pos.y, this.endCollider.aabb.dimensions.x, this.endCollider.aabb.dimensions.y);
    }

    /** Draws the colliders in relation to the testing rectangle.
     *  @param {CanvasRenderingContext2D} context - The context to draw on. */
    drawCollidersToRectangle(context) {
        // Draw the rectangle WITH collision information if available
        context.strokeStyle = 'Green';
        if (this.rectColliderResult) {
            context.strokeStyle = 'Red';
            context.fillRect(this.rectColliderResult.contactPoint.x, this.rectColliderResult.contactPoint.y, 10, 10);
            
            context.beginPath();
            context.moveTo(this.rectColliderResult.contactPoint.x, this.rectColliderResult.contactPoint.y);
            const normalLine = this.rectColliderResult.contactPoint.addCopy(this.rectColliderResult.contactNormal.mulCopy(new Vector2(30, 30)));
            context.lineTo(normalLine.x, normalLine.y);
            context.stroke();
            const newPos = this.endCollider.aabb.pos.addCopy(this.rectColliderMTV);
            context.strokeRect(newPos.x, newPos.y, this.endCollider.aabb.dimensions.x, this.endCollider.aabb.dimensions.y);
        }
        context.strokeRect(this.rectCollider1.aabb.pos.x, this.rectCollider1.aabb.pos.y, this.rectCollider1.aabb.dimensions.x, this.rectCollider1.aabb.dimensions.y);
    }

    /** Draws the testing ray.
     *  @param {CanvasRenderingContext2D} context - The context to draw on. */
    drawRay(context) {
        context.strokeStyle = 'Black';
        context.beginPath();
        context.moveTo(this.origin.x, this.origin.y);
        context.lineTo(this.end.x, this.end.y);
        context.stroke();
    }

    /** Draws the colliders in relation to the testing ray.
     *  @param {CanvasRenderingContext2D} context - The context to draw on. */
    drawCollidersToRay(context) {
        // Draw the rectangle WITH collision information if available
        context.strokeStyle = 'Green';
        if (this.rectColliderResult) {
            context.strokeStyle = 'Red';
            context.fillRect(this.rectColliderResult.contactPoint.x, this.rectColliderResult.contactPoint.y, 10, 10);
            
            context.beginPath();
            context.moveTo(this.rectColliderResult.contactPoint.x, this.rectColliderResult.contactPoint.y);
            const normalLine = this.rectColliderResult.contactPoint.addCopy(this.rectColliderResult.contactNormal.mulCopy(new Vector2(30, 30)));
            context.lineTo(normalLine.x, normalLine.y);
            context.stroke();
        }
        context.strokeRect(this.rectCollider1.aabb.pos.x, this.rectCollider1.aabb.pos.y, this.rectCollider1.aabb.dimensions.x, this.rectCollider1.aabb.dimensions.y);

        // Draw the circle WITH collision information if available
        context.strokeStyle = 'Green';
        if (this.circleColliderResult) {
            context.strokeStyle = 'Red';
            context.fillRect(this.circleColliderResult.contactPoint.x, this.circleColliderResult.contactPoint.y, 10, 10);

            context.beginPath();
            context.moveTo(this.circleColliderResult.contactPoint.x, this.circleColliderResult.contactPoint.y);
            const normalLine = this.circleColliderResult.contactPoint.addCopy(this.circleColliderResult.contactNormal.mulCopy(new Vector2(30, 30)));
            context.lineTo(normalLine.x, normalLine.y);
            context.stroke();
        }
        context.beginPath();
        context.arc(this.circleCollider1.centerPos.x, this.circleCollider1.centerPos.y, this.circleCollider1.radius, 0, 2 * Math.PI);
        context.stroke();
    }

    /** Draws state elements and game objects onto the canvas.
     *  @param {CanvasRenderingContext2D} context - The context to draw on.
     *  @param {number} alpha - Used for interpolation when rendering between two states. */
    draw(context, alpha) {
        context.save();
        context.lineWidth = 3;
        
        if (this.modes[this.currentMode] == 'ray') {
            this.drawRay(context);
            this.drawCollidersToRay(context);
        } else if (this.modes[this.currentMode] == 'rect') {
            this.drawRectangle(context);
            this.drawCollidersToRectangle(context);
        }

        context.restore();
    }
}

export default TestColliders;
