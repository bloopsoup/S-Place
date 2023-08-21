import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { DialogueNode } from './index.js';

/** The path leading to the directory containing this script.
 *  @type {string} */
const __dirname = new URL('.', import.meta.url).pathname.substring(1);

/** Recursively asserts that the DialogueNodes match.
 *  @param {DialogueNode} a - The first node. 
 *  @param {DialogueNode} b - The second node. 
 *  @throws {AssertionError} If the nodes are not equal. */
export function assertNodeEqual(a, b) {
    if (a.name !== b.name) assert.fail('DialogueNodes do not match; mismatched names');
    if (a.emotion !== b.emotion) assert.fail('DialogueNodes do not match; mismatched emotions');
    if (a.message !== b.message) assert.fail('DialogueNodes do not match; mismatched messages');
    if (a.isChoice !== b.isChoice) assert.fail('DialogueNodes do not match; mismatched isChoice');
    if (a.label !== b.label) assert.fail('DialogueNodes do not match; mismatched labels');
    if (a.choiceMessage !== b.choiceMessage) assert.fail('DialogueNodes do not match; mismatched choice messages');
    if (a.next.length !== b.next.length) assert.fail('DialogueNodes do not match; mismatched neighbor lengths');
    for (let i = 0; i < a.next.length; i++) assertNodeEqual(a.next[i], b.next[i]);
}

/** Recursively asserts that each DialogueNode in the list match
 *  with the corresponding DialogueNode in the other list.
 *  @param {Array<DialogueNode>} a - The first array. 
 *  @param {Array<DialogueNode>} b - The second array.
 *  @throws {AssertionError} If the arrays are not equal. */
export function assertNodeArrayEqual(a, b) {
    if (a.length !== b.length) assert.fail('DialogueNode arrays have different lengths');
    for (let i = 0; i < a.length; i++) assertNodeEqual(a[i], b[i]);
}

/** Reads the requested DScript file as a raw string.
 * @param {string} name - The name of the DScript file.
 * @param {boolean} valid - Whether to read in a valid DScript file or an invalid one.
 * @returns {string} The resulting string. */
export function readRaw(name, valid) {
    const folder = valid ? 'valid' : 'invalid';
    return readFileSync(path.join(__dirname, `scripts/${folder}/${name}.dscript`)).toString();
}
