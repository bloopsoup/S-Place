import GameObject from '../gameObject.js';
import { Input, Vector2 } from '../../common/index.js';
class Button extends GameObject {
    constructor(sprite, pos, callback) {
        super(sprite);
        this.pos = pos;
        this.callback = callback
        this.dim = sprite.dimensions
        this.isHovered = false;
        this.isClicked = false;
    }


    handleInputs(inputs) {
        if ('MouseMove' in inputs) {
            const mouse_pos = inputs['MouseMove'].pos;
            if (mouse_pos.greaterThan(this.pos) && mouse_pos.lessThan(this.pos.addCopy(this.dim))) {
                this.isHovered = true;
                if ('MouseHold' in inputs) {
                    this.isClicked = true;
                    this.callback()
                }
                else {this.isClicked = false;}
            }
            else {this.isHovered = false;}
        }
    }

    draw(context) { 
        if (this.isClicked) { this.sprite.drawFrame(context, this.pos, new Vector2(2, 0)); }
        else if (this.isHovered) { this.sprite.drawFrame(context, this.pos, new Vector2(1, 0)); }
        else { this.sprite.drawFrame(context, this.pos, new Vector2(0, 0)); }
    }
}