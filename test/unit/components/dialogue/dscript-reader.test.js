import { strict as assert } from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { DialogueNode, DScriptReader } from './index.js';
import { assertNodeArrayEqual, readRaw } from './helpers.js';

describe('DScriptReader read', () => {
    describe('valid cases', () => {  
        it('should handle a script with one message node', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''), choices: null }
            ];
            const chunks = new DScriptReader(readRaw('one-message')).read();
    
            assert.ok(chunks);
            assert.deepStrictEqual(chunks, reference);
            assertNodeArrayEqual(chunks.map(chunk => chunk.node), reference.map(chunk => chunk.node));
        });

        it('should handle a script with many message nodes', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Alice', 'angry', 'I am also angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Richard', 'angry', 'I am semi-angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Fanagle', 'happy', 'I am anti-angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Eric', 'happy', 'I am okay-angry right now.', false, ''), choices: null }
            ];
            const chunks = new DScriptReader(readRaw('many-message')).read();
    
            assert.ok(chunks);
            assert.deepStrictEqual(chunks, reference);
            assertNodeArrayEqual(chunks.map(chunk => chunk.node), reference.map(chunk => chunk.node));
        });

        it('should handle a script with many message nodes with comments and whitespace', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Alice', 'angry', 'I am also angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Richard', 'angry', 'I am semi-angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Fanagle', 'happy', 'I am anti-angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Eric', 'happy', 'I am okay-angry right now.', false, ''), choices: null }
            ];
            const chunks = new DScriptReader(readRaw('many-message-w')).read();
    
            assert.ok(chunks);
            assert.deepStrictEqual(chunks, reference);
            assertNodeArrayEqual(chunks.map(chunk => chunk.node), reference.map(chunk => chunk.node));
        });
    });

    describe('invalid cases', () => {  
        it('should error on an empty script', () => {
            const chunks = new DScriptReader(readRaw('only-empty')).read();
            assert.strictEqual(chunks, null);
        });

        it('should error on a whitespace-only script', () => {
            const chunks = new DScriptReader(readRaw('only-spaces')).read();
            assert.strictEqual(chunks, null);
        });

        it('should error on a comment-only script', () => {
            const chunks = new DScriptReader(readRaw('only-comments')).read();
            assert.strictEqual(chunks, null);
        });

        it('should error if a message has no header', () => {
            const chunks = new DScriptReader(readRaw('no-header')).read();
            assert.strictEqual(chunks, null);
        });

        it('should error if a message has no header in a seemingly valid script', () => {
            const chunks = new DScriptReader(readRaw('no-header-many')).read();
            assert.strictEqual(chunks, null);
        });
    });
});
