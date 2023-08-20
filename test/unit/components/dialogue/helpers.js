import { DialogueNode } from './index.js';

/** Recursively compares DialogueNodes.
 *  @param {DialogueNode} a - The first node. 
 *  @param {DialogueNode} b - The second node. 
 *  @returns {boolean} The result. */
export function DialogeNodeEqual(a, b) {
    if (a.name !== b.name || a.emotion !== b.emotion || a.message !== b.message || a.isChoice !== b.isChoice || a.label !== b.label || a.choiceMessage !== b.choiceMessage || a.next.length !== b.next.length) return false;
    for (let i = 0; i < a.next.length; i++) { if (!DialogeNodeEqual(a.next[i], b.next[i])) return false; }
    return true;
};
