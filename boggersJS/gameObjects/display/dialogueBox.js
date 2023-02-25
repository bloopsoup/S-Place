import GameObject from '../gameObject.js';
import { Movable, Collider, Sprite } from '../../components/index.js';
import { InputTracker, Vector2 } from '../../common/index.js';

class DialogueBox extends GameObject {
    constructor(sprite, pos, msgArray) {
        super(sprite);
        this.pos = pos;
        this.msgArray = msgArray;

        this.movable = new Movable(new Vector2(0, 0), this.sprite.dimensions, pos, new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0));

        this.msgIndex = 0;
        this.msg = this.msgArray[this.msgIndex];
        this.counter = 0;
        this.display = '';

        this.doneTyping = false;
        this.msgDone = false;
    }

    handleInputs(inputs) {
        if (! this.msgDone && this.doneTyping && inputs.has('MouseHold')) {
            if (this.collider.pointOverlaps(this.movable, inputs.get('MouseHold').pos)) {
                this.msgIndex ++;
                this.msg = this.msgArray[this.msgIndex];
                this.display = '';
                this.doneTyping = false;
            }
        } 
    }

    update(dt) {
        if (! this.doneTyping && ! this.msgDone) {
            if (this.display.length == this.msg.length) {
                this.doneTyping = true;
                if (this.msgIndex == this.msgArray.length - 1) {this.msgDone = true;}
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
    }
    
    draw(context, alpha){
        context.font = "48px serif";
        context.fillText(this.display, this.movable.pos.x, this.movable.pos.y);
    }
}
