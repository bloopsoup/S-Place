import GameObject from '../gameObject.js';
import { Movable, Collider, Sprite } from '../../components/index.js';
import { InputTracker, Vector2 } from '../../common/index.js';

class DialogueBox extends GameObject {
    constructor(sprite, pos, msg) {
        super(sprite);
        this.pos = pos;
        this.msg = msg;
        this.display = '';
        this.counter = 0;
        this.doneTyping = false;
    }

    handleInputs(inputs) {
        if (inputs.has('MouseHold')) {
            if (this.collider.pointOverlaps(this.movable, inputs.get('MouseHold').pos)) this.#isActive = true;
            else this.#isActive = false;
        }
        if (this.#isActive) {
            if (inputs.has('Enter')) this.submitText();
            if (inputs.has('Backspace')) this.#text = this.#text.slice(0, -1);
            const c = inputs.consumePrintableInput();
            if (c) this.#text += c;
        }   
    }

    update(dt) {
        if (this.display.length == this.msg.length) {
            this.doneTyping = true;
        }
        else if (this.counter == 0) {
            const str = this.msg[this.display.length];
            if (str === '.' || str === ',') {
                this.counter += 50;
            }
            else if (str === ' ') {
                this.counter += 20;
            }
            else {
                this.counter += 5;
            }
            this.display += str;
        }
        else {
            this.counter --;
        }
    }
    
    draw(context){
        context.font = "48px serif";
        context.fillText(this.display, this.movable.pos.x, this.movable.pos.y);
    }
}
