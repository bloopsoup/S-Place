import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { DialogueNode, DScriptChunk, DScriptReader, DScriptParser } from './index.js';

/** The path leading to the directory containing this script.
 *  @type {string} */
const __dirname = new URL('.', import.meta.url).pathname.substring(1);

/** Reads the requested DScript file as a raw string.
 *  @param {string} name - The name of the DScript file.
 *  @param {string} category - The category of the requested script.
 *  @returns {string} The resulting string. */
function readRaw(name, category) {
    return readFileSync(path.join(__dirname, `scripts/${category}/${name}.dscript`)).toString();
}

/** Reads the requested DScript file as a raw string and inserts it into the template.
 *  @param {string} name - The name of the DScript file.
 *  @param {string} category - The category of the requested script.
 *  @returns {string} The resulting string. */
function readTemplatedRaw(name, category) {
    const script = readFileSync(path.join(__dirname, `scripts/${category}/${name}.dscript`)).toString();
    const template = readFileSync(path.join(__dirname, `scripts/template`)).toString();
    return script.replace("[REPLACE]", template);
}

/** Asserts that the chunks match.
 *  @param {DScriptChunk} a - The first chunk.
 *  @param {DScriptChunk} b - The second chunk. 
 *  @throws {AssertionError} If the chunks are not equal. */
function assertChunkEqual(a, b) {
    assert.deepStrictEqual(a.choices, b.choices);
    if (a.convergingLabel !== b.convergingLabel) assert.fail('Chunks do not match; mismatched converging labels');
    if (a.status !== b.status) assert.fail('Chunks do not match; mismatched status messages');
    if (a.node === null || b.node === null) { if (a.node !== b.node) assert.fail('Chunks do not match; one node is null and the other is not'); }
    else assertNodeEqual(a.node, b.node);
}

/** Asserts that the chunk arrays match.
 *  @param {Array<DScriptChunk>} a - The first array. 
 *  @param {Array<DScriptChunk>} b - The second array.
 *  @throws {AssertionError} If the arrays are not equal. */
function assertChunkArrayEqual(a, b) {
    if (a.length !== b.length) assert.fail('Chunk arrays have different lengths');
    for (let i = 0; i < a.length; i++) assertChunkEqual(a[i], b[i]);
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

/** Asserts that the provided script has the correct output when read as chunks.
 *  @param {string} name - The name of the DScript file.
 *  @param {Array<DScriptChunk>} reference - The expected output when reading the script.
 *  @param {string} category - The category of the requested script.
 *  @throws {AssertionError} If the result does not match. */
export function assertScriptOutputEqual(name, reference, category) {
    const chunks = new DScriptReader(readRaw(name, category)).read();
    assert.ok(chunks);
    assertChunkArrayEqual(chunks, reference);
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

/** Asserts that the provided script is invalid when attempting to parse it into a tree.
 *  @param {string} name - The name of the DScript file.
 *  @throws {AssertionError} If the result of parsing is NOT null. */
export function assertTreeInvalid(name) {
    const chunks = new DScriptReader(readRaw(name, 'invalid-syntax')).read();
    assert.ok(chunks);
    assert.strictEqual(new DScriptParser(chunks).parse(), null, 'Expected null');
}
