import { strict as assert } from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { DialogueNode, DScriptReader } from './index.js';
import { assertNodeArrayEqual, readRaw } from './helpers.js';

describe('DScriptReader read', () => {
    describe('valid cases', () => {
        /** Asserts that the provided script has the correct output.
         *  @param {string} name - The name of the DScript file.
         *  @param {Array<object>} reference - The expected output when reading the script.
         *  @throws {AssertionError} If the result does not match. */
        function assertScriptOutputEqual(name, reference) {
            const chunks = new DScriptReader(readRaw(name, true)).read();
            assert.ok(chunks);
            assert.deepStrictEqual(chunks, reference);
            assertNodeArrayEqual(chunks.map(chunk => chunk.node), reference.map(chunk => chunk.node));
        }

        it('should handle a script with one message node', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''), choices: null }
            ];
            assertScriptOutputEqual('one-message', reference);
        });

        it('should handle a script with many message nodes', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Alice', 'angry', 'I am also angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Richard', 'angry', 'I am semi-angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Fanagle', 'happy', 'I am anti-angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Eric', 'happy', 'I am okay-angry right now.', false, ''), choices: null }
            ];
            assertScriptOutputEqual('many-message', reference);
        });

        it('should handle a script with many message nodes with comments and whitespace', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Alice', 'angry', 'I am also angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Richard', 'angry', 'I am semi-angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Fanagle', 'happy', 'I am anti-angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Eric', 'happy', 'I am okay-angry right now.', false, ''), choices: null }
            ];
            assertScriptOutputEqual('many-message-w', reference);
        });

        it('should handle a script with one choice node', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''), choices: { FIGHT: 'No', FRIENDSHIP: 'Yes', IGNORE: 'Maybe' } }
            ];
            assertScriptOutputEqual('one-choice', reference);
        });
    });

    describe('invalid cases', () => {
        /** Asserts that the provided script is invalid.
         *  @param {string} name - The name of the DScript file. 
         *  @throws {AssertionError} If the result of reading is NOT null. */
        function assertScriptInvalid(name) {
            assert.strictEqual(new DScriptReader(readRaw(name, false)).read(), null, 'Expected null');
        }

        it('should error on an empty script', () => assertScriptInvalid('only-empty'));
        it('should error on a whitespace-only script', () => assertScriptInvalid('only-spaces'));
        it('should error on a comment-only script', () => assertScriptInvalid('only-comments'));
        it('should error if a message node has no header', () => assertScriptInvalid('no-header'));
        it('should error if a message node has no header in a mostly valid script', () => assertScriptInvalid('no-header-many'));
        it('should error if a message node has no message', () => assertScriptInvalid('no-message'));
        it('should error if a message node has no message in a mostly valid script', () => assertScriptInvalid('no-message-many'));
        it('should error if a choice node has no choices', () => assertScriptInvalid('no-choices'));
    });
});
