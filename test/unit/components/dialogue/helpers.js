import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { DialogueNode, DScriptReader, DScriptParser } from './index.js';

/** The path leading to the directory containing this script.
 *  @type {string} */
const __dirname = new URL('.', import.meta.url).pathname.substring(1);

/** Reads the requested DScript file as a raw string.
 *  @param {string} name - The name of the DScript file.
 *  @param {string} category - The category of the requested script.
 *  @returns {string} The resulting string. */
export function readRaw(name, category) {
    return readFileSync(path.join(__dirname, `scripts/${category}/${name}.dscript`)).toString();
}

/** Reads the requested DScript file as a raw string and inserts it into the template.
 *  @param {string} name - The name of the DScript file.
 *  @param {string} category - The category of the requested script.
 *  @returns {string} The resulting string. */
export function readTemplatedRaw(name, category) {
    const script = readFileSync(path.join(__dirname, `scripts/${category}/${name}.dscript`)).toString();
    const template = readFileSync(path.join(__dirname, `scripts/template`)).toString();
    return script.replace("[REPLACE]", template);
}

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

/** Asserts that the provided script has the correct output when read as chunks.
 *  @param {string} name - The name of the DScript file.
 *  @param {Array<object>} reference - The expected output when reading the script.
 *  @param {string} category - The category of the requested script.
 *  @throws {AssertionError} If the result does not match. */
export function assertScriptOutputEqual(name, reference, category) {
    const chunks = new DScriptReader(readRaw(name, category)).read();
    assert.ok(chunks);
    assert.deepStrictEqual(chunks, reference);
        assertNodeArrayEqual(chunks.filter(chunk => chunk.node).map(chunk => chunk.node), reference.filter(chunk => chunk.node).map(chunk => chunk.node));
}

/** Asserts that the provided script has the correct output when parsed into a tree.
 *  @param {string} name - The name of the DScript file.
 *  @param {DialogueNode} reference - The expected output when parsing the script.
 *  @param {string} category - The category of the requested script.
 *  @throws {AssertionError} If the result does not match. */
export function assertTreeEqual(name, reference, category) {
    const chunks = new DScriptReader(readRaw(name, category)).read();
    assert.ok(chunks);
    const root = new DScriptParser(chunks).parse();
    assert.ok(root);
    assertNodeEqual(root, reference);
}

/** Asserts that the provided script is invalid.
 *  @param {string} name - The name of the DScript file. 
 *  @throws {AssertionError} If the result of reading is NOT null. */
export function assertScriptInvalid(name) {
    assert.strictEqual(new DScriptReader(readRaw(name, 'invalid')).read(), null, 'Expected null');
}

/** Asserts that the provided templated script is invalid.
 *  @param {string} name - The name of the DScript file. 
 *  @throws {AssertionError} If the result of reading is NOT null. */
export function assertTemplatedScriptInvalid(name) {
    assert.strictEqual(new DScriptReader(readTemplatedRaw(name, 'invalid')).read(), null, 'Expected null');
}
