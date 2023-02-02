/*
Research this
https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event
https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_text
*/

import GameObject from '../gameObject.js';
import { Input, Vector2 } from '../../common/index.js';

class TextBox extends GameObject {
    constructor(sprite, pos, textPos) {
        super(sprite);
        this.pos = pos;
        this.textPos = pos;
        this.dim = sprite.dimensions;

        this.msg = '';
        this.isActive = false;
    }

    handleInputs(input) {
        if ('MouseMove' in inputs) {
            const mouse_pos = inputs['MouseMove'].pos;
            if (mouse_pos.greaterThan(this.pos) && mouse_pos.lessThan(this.pos.addCopy(this.dim))) {
                if ('MouseHold' in inputs) {
                    this.isActive = true;
                }
            }
            else {
                if ('MouseHold' in inputs) {
                    this.isActive = false;
                }
            }
        }
    }

    draw(context){
        // draw sprite and text!
    }
}
