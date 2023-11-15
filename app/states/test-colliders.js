import { State, Settings, Loader } from '../../boggersJS/core/index.js';
import { Vector2, InputTracker } from '../../boggersJS/common/index.js';
import { RectangleCollider, CircleCollider, Rectangle } from '../../boggersJS/components/index.js';

/** A state for testing colliders. */
class TestColliders extends State {
    /** Create a new state object. 
     *  @param {Settings} settings - The settings shared by all states.
     *  @param {Loader} loader - The asset loader used by all states to load images, sounds, etc. */
    constructor(settings, loader) {
        super(settings, loader);

        this.aabb1 = new Rectangle(new Vector2(50, 60), new Vector2(200, 200));
        this.rectCollider1 = new RectangleCollider(this.aabb1);
        this.rectColliderResult = null;

        this.aabb2 = new Rectangle(new Vector2(70, 70), new Vector2(100, 200));
        this.circleCollider1 = new CircleCollider(this.aabb2);
        this.circleColliderResult = null;

        this.origin = new Vector2(20, 20);
        this.end = this.origin.copy();
    }

    // IGNORE
    startup() {}
    cleanup() {}

    /** Processes the inputs given by the InputHandler and updates components. 
     *  @param {InputTracker} inputs - The currently tracked inputs. */
    update(inputs) {
        if (inputs.has('MouseMove')) inputs.get('MouseMove').pos.copyTo(this.end);
        if (inputs.consumeInput('w')) this.origin.addToY(-10);
        if (inputs.consumeInput('a')) this.origin.addToX(-10);
        if (inputs.consumeInput('s')) this.origin.addToY(10);
        if (inputs.consumeInput('d')) this.origin.addToX(10);

        // Check collisions
        this.rectColliderResult = this.rectCollider1.collidesWithRay(this.origin, this.end.subCopy(this.origin));
        this.circleColliderResult = this.circleCollider1.collidesWithRay(this.origin, this.end.subCopy(this.origin));
    }

    /** Draws state elements and game objects onto the canvas.
     *  @param {CanvasRenderingContext2D} context - The context to draw on.
     *  @param {number} alpha - Used for interpolation when rendering between two states. */
    draw(context, alpha) {
        context.save();
        context.lineWidth = 3;

        // Draw testing ray
        context.strokeStyle = 'Black';
        context.beginPath();
        context.moveTo(this.origin.x, this.origin.y);
        context.lineTo(this.end.x, this.end.y);
        context.stroke();

        // Draw colliders
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

        context.restore();
    }
}

export default TestColliders;
