import { DialogueNode } from './index.js';
import { DialogeNodeEqual } from './helpers.js';
import { strict as assert } from 'node:assert';
import { beforeEach, describe, it } from 'node:test';

describe('DialogueNode methods', () => {
    describe('constructor', () => {
      it('should initialize its attributes', () => {
        const node = new DialogueNode('Bob', 'angry', 'message', false, 'root', 'choice message');

        assert.strictEqual(node.name, 'Bob');
        assert.strictEqual(node.emotion, 'angry');
        assert.strictEqual(node.message, 'message');
        assert.ok(!node.isChoice);
        assert.strictEqual(node.label, 'root');
        assert.strictEqual(node.choiceMessage, 'choice message');
        assert.deepStrictEqual(node.next, []);
      });

      it('should initialize its default attributes', () => {
        const node = new DialogueNode('Bob', 'angry', 'message', false);

        assert.strictEqual(node.name, 'Bob');
        assert.strictEqual(node.emotion, 'angry');
        assert.strictEqual(node.message, 'message');
        assert.ok(!node.isChoice);
        assert.strictEqual(node.label, '');
        assert.strictEqual(node.choiceMessage, '');
        assert.deepStrictEqual(node.next, []);
      });
    });

    describe('choiceMessage setter', () => {
      /** @type {DialogueNode} */
      let node;

      beforeEach(() => { node = new DialogueNode('Bob', 'angry', 'message', false, 'root', 'choice message'); });

      it('should set the choiceMessage', () => {
        node.choiceMessage = 'new choice message';

        assert.strictEqual(node.choiceMessage, 'new choice message');
      });
    });

    describe('addNeighbor', () => {
      /** @type {DialogueNode} */
      let node;
      /** @type {DialogueNode} */
      let nodeReference;
      /** @type {DialogueNode} */
      let nodeReference2;
      
      beforeEach(() => {
        node = new DialogueNode('Bob', 'angry', 'message', false, 'root', 'choice message');
        nodeReference = new DialogueNode('Alice', 'happy', 'message2', true, 'root2', 'choice message2');
        nodeReference2 = new DialogueNode('Mallow', 'pissed', 'message3', false, 'root3', 'choice message3');
      })

      it('should add another node', () => {
        const newNode = new DialogueNode('Alice', 'happy', 'message2', true, 'root2', 'choice message2');
        node.addNeighbor(newNode);

        assert.strictEqual(node.next.length, 1);
        assert.ok(DialogeNodeEqual(node.next[0], nodeReference));
      });

      it('should add many nodes', () => {
        const newNode = new DialogueNode('Alice', 'happy', 'message2', true, 'root2', 'choice message2');
        const newNode2 = new DialogueNode('Mallow', 'pissed', 'message3', false, 'root3', 'choice message3');
        node.addNeighbor(newNode);
        node.addNeighbor(newNode2);

        assert.strictEqual(node.next.length, 2);
        assert.ok(DialogeNodeEqual(node.next[0], nodeReference));
        assert.ok(DialogeNodeEqual(node.next[1], nodeReference2));
      });

      it('should add another nested node', () => {
        nodeReference.addNeighbor(nodeReference2);

        const newNode = new DialogueNode('Alice', 'happy', 'message2', true, 'root2', 'choice message2');
        const newNode2 = new DialogueNode('Mallow', 'pissed', 'message3', false, 'root3', 'choice message3');
        newNode.addNeighbor(newNode2);
        node.addNeighbor(newNode);

        assert.strictEqual(node.next.length, 1);
        assert.strictEqual(newNode.next.length, 1);
        assert.ok(DialogeNodeEqual(node.next[0], nodeReference));
        assert.ok(DialogeNodeEqual(newNode.next[0], nodeReference2));
      });
    });

    describe('to', () => {
      /** @type {DialogueNode} */
      let node;
      /** @type {DialogueNode} */
      let nodeReference;
      /** @type {DialogueNode} */
      let nodeReference2;
      
      beforeEach(() => {
        node = new DialogueNode('Bob', 'angry', 'message', false, 'root', 'choice message');
        nodeReference = new DialogueNode('Alice', 'happy', 'message2', true, 'root2', 'choice message2');
        nodeReference2 = new DialogueNode('Mallow', 'pissed', 'message3', false, 'root3', 'choice message3');

        node.addNeighbor(nodeReference);
        node.addNeighbor(nodeReference2);
      })

      it('should access the requested neighbors', () => {
        const retrievedNode = node.to(0);
        const retrievedNode2 = node.to(1);

        assert.ok(retrievedNode);
        assert.ok(retrievedNode2);
        assert.ok(DialogeNodeEqual(retrievedNode, nodeReference));
        assert.ok(DialogeNodeEqual(retrievedNode2, nodeReference2));
      });

      it('should access the first neighbor by default', () => {
        const retrievedNode = node.to();

        assert.ok(retrievedNode);
        assert.ok(DialogeNodeEqual(retrievedNode, nodeReference));
      });

      it('should be able to modify the neighbor and have its changes seen in the parent', () => {
        const retrievedNode = node.to(0);
        assert.ok(retrievedNode);
        retrievedNode.choiceMessage = 'new message';

        const retrievedNodeAgain = node.to(0);
        assert.ok(retrievedNodeAgain);

        assert.strictEqual(retrievedNodeAgain.choiceMessage, 'new message');
        assert.ok(DialogeNodeEqual(retrievedNodeAgain, nodeReference));
      });

      it('should return null on invalid indices', () => {
        assert.deepStrictEqual(node.to(-1), null);
        assert.deepStrictEqual(node.to(5), null);
      });
    });
});
