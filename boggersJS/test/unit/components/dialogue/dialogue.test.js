import { strict as assert } from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { Dialogue, DialogueNode } from './index.js';

describe('Dialogue methods', () => {
    /** @type {Dialogue} */
    let dialogue;

    beforeEach(() => {
        const referenceNodes = [
            new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''),
            new DialogueNode('Alice', 'angry', 'I am also angry right now.', false, ''),
            new DialogueNode('Richard', 'angry', 'I am semi-angry right now.', false, ''),
            new DialogueNode('Fanagle', 'happy', 'I am anti-angry right now.', false, ''),
            new DialogueNode('Eric', 'happy', 'I am okay-angry right now.', false, ''),
            new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''),
            new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'),
            new DialogueNode('Bob', 'pissed', 'TIME TO BOX.', false, 'FIGHT'),
            new DialogueNode('Bob', 'pissed', 'Okay then, FRIEND!', false, 'FRIENDSHIP'),
            new DialogueNode('Bob', 'pissed', 'TIME FOR SHOTS.', false, 'FRIENDSHIP'),
            new DialogueNode('Bob', 'pissed', '...', false, 'IGNORE'),
            new DialogueNode('Bob', 'pissed', '...hm?', false, 'IGNORE')
        ];
        referenceNodes[0].addNeighbor(referenceNodes[1]);
        referenceNodes[1].addNeighbor(referenceNodes[2]);
        referenceNodes[2].addNeighbor(referenceNodes[3]);
        referenceNodes[3].addNeighbor(referenceNodes[4]);
        referenceNodes[4].addNeighbor(referenceNodes[5]);

        referenceNodes[5].addNeighbor(referenceNodes[6]);
        referenceNodes[6].choiceMessage = 'No';
        referenceNodes[6].addNeighbor(referenceNodes[7]);

        referenceNodes[5].addNeighbor(referenceNodes[8]);
        referenceNodes[8].choiceMessage = 'Yes';
        referenceNodes[8].addNeighbor(referenceNodes[9]);

        referenceNodes[5].addNeighbor(referenceNodes[10]);
        referenceNodes[10].choiceMessage = 'Maybe';
        referenceNodes[10].addNeighbor(referenceNodes[11]);

        dialogue = new Dialogue(referenceNodes[0], 1);
    });

    describe('constructor', () => {
      it('should initialize the display information', () => {
        assert.deepStrictEqual(dialogue.headerContent, ['Bob', 'angry']);
        assert.strictEqual(dialogue.messageContent, '');
        assert.deepStrictEqual(dialogue.choiceContent, null);
      });
    });

    describe('ended', () => {
      it('should be false if there is a node', () => {
        assert.ok(!dialogue.ended());
      });

      it('should be true if there is no node', () => {
        for (let i = 0; i < 100; i++) dialogue.advance();
        assert.ok(dialogue.ended());
      });
    });

    describe('reset', () => {
      it('should reset the dialogue when it is partially complete', () => {
        for (let i = 0; i < 5; i++) dialogue.advance();
        for (let i = 0; i < 5; i++) dialogue.updateText();
        dialogue.reset();

        assert.deepStrictEqual(dialogue.headerContent, ['Bob', 'angry']);
        assert.strictEqual(dialogue.messageContent, '');
        assert.deepStrictEqual(dialogue.choiceContent, null);
      });

      it('should reset the dialogue when it is finished', () => {
        for (let i = 0; i < 100; i++) dialogue.advance();
        for (let i = 0; i < 100; i++) dialogue.updateText();
        dialogue.reset();

        assert.deepStrictEqual(dialogue.headerContent, ['Bob', 'angry']);
        assert.strictEqual(dialogue.messageContent, '');
        assert.deepStrictEqual(dialogue.choiceContent, null);
      });

      it('should reset the dialogue when it has not progressed at all', () => {
        dialogue.reset();

        assert.deepStrictEqual(dialogue.headerContent, ['Bob', 'angry']);
        assert.strictEqual(dialogue.messageContent, '');
        assert.deepStrictEqual(dialogue.choiceContent, null);
      });
    });

    describe('advance', () => {
      it('should update the display information to reflect the next message node', () => {
        for (let i = 0; i < 5; i++) dialogue.updateText();
        dialogue.advance();

        assert.deepStrictEqual(dialogue.headerContent, ['Alice', 'angry']);
        assert.strictEqual(dialogue.messageContent, '');
        assert.deepStrictEqual(dialogue.choiceContent, null);
      });

      it('should update the display information to reflect the next choice node', () => {
        for (let i = 0; i < 5; i++) dialogue.updateText();
        for (let i = 0; i < 5; i++) dialogue.advance();
        
        assert.deepStrictEqual(dialogue.headerContent, ['Bob', 'angry']);
        assert.strictEqual(dialogue.messageContent, '');
        assert.deepStrictEqual(dialogue.choiceContent, ['No', 'Yes', 'Maybe']);
      });

      it('should update the display information to reflect the next message node after a choice node', () => {
        for (let i = 0; i < 5; i++) dialogue.updateText();
        for (let i = 0; i < 5; i++) dialogue.advance();
        dialogue.advance(1);
        
        assert.deepStrictEqual(dialogue.headerContent, ['Bob', 'pissed']);
        assert.strictEqual(dialogue.messageContent, '');
        assert.deepStrictEqual(dialogue.choiceContent, null);
      });

      it('should set the next node to be null if used past the end of the script', () => {
        for (let i = 0; i < 5; i++) dialogue.updateText();
        for (let i = 0; i < 100; i++) dialogue.advance();
        
        assert.deepStrictEqual(dialogue.headerContent, null);
        assert.strictEqual(dialogue.messageContent, null);
        assert.deepStrictEqual(dialogue.choiceContent, null);
      });

      it('should set the next node to be null if an invalid index is given', () => {
        dialogue.advance(2);
        
        assert.deepStrictEqual(dialogue.headerContent, null);
        assert.strictEqual(dialogue.messageContent, null);
        assert.deepStrictEqual(dialogue.choiceContent, null);
      });
    });

    describe('updateText', () => {
      it('should add one letter at a time for each passed interval', () => {
        dialogue.updateText();
        assert.strictEqual(dialogue.messageContent, 'I');
        dialogue.updateText();
        assert.strictEqual(dialogue.messageContent, 'I ');
        dialogue.updateText();
        assert.strictEqual(dialogue.messageContent, 'I a');
        dialogue.updateText();
        assert.strictEqual(dialogue.messageContent, 'I am');
      });

      it('should do nothing if it reaches the end of the message', () => {
        for (let i = 0; i < 100; i++) dialogue.updateText();

        assert.strictEqual(dialogue.messageContent, 'I am angry right now.');
      });

      it('should do nothing if there is no node', () => {
        for (let i = 0; i < 100; i++) dialogue.advance();
        dialogue.updateText();

        assert.strictEqual(dialogue.messageContent, null);
      });
    });
});
