import { describe, it } from 'node:test';
import { DialogueNode } from './index.js';
import { assertScriptOutputEqual, assertScriptInvalid, assertTemplatedScriptInvalid } from './helpers.js';

describe('DScriptReader read', () => {
    describe('valid cases', () => {
        it('should handle a script with one message node', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''), choices: null }
            ];
            assertScriptOutputEqual('linear-single', reference, 'valid');
        });

        it('should handle a script with many message nodes', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Alice', 'angry', 'I am also angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Richard', 'angry', 'I am semi-angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Fanagle', 'happy', 'I am anti-angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Eric', 'happy', 'I am okay-angry right now.', false, ''), choices: null }
            ];
            assertScriptOutputEqual('linear-simple', reference, 'valid');
        });

        it('should handle a script with many message nodes with comments and whitespace', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Alice', 'angry', 'I am also angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Richard', 'angry', 'I am semi-angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Fanagle', 'happy', 'I am anti-angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Eric', 'happy', 'I am okay-angry right now.', false, ''), choices: null }
            ];
            assertScriptOutputEqual('linear-simple-comment', reference, 'valid');
        });

        it('should handle a script with one choice node', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''), choices: { FIGHT: 'No', FRIENDSHIP: 'Yes', IGNORE: 'Maybe' } }
            ];
            assertScriptOutputEqual('branch-single', reference, 'valid');
        });

        it('should handle a script with one nested choice node', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''), choices: { FIGHT: 'No', FRIENDSHIP: 'Yes', IGNORE: 'Maybe' } },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('YOU', 'scared', 'Pick an attack.', true, 'FIGHT'), choices: { LOSE: 'Punch', WIN: 'Kick' } }
            ];
            assertScriptOutputEqual('branch-single-nested', reference, 'valid');
        });

        it('should handle a script with a branch', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Alice', 'angry', 'I am also angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Richard', 'angry', 'I am semi-angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Fanagle', 'happy', 'I am anti-angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Eric', 'happy', 'I am okay-angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''), choices: { FIGHT: 'No', FRIENDSHIP: 'Yes', IGNORE: 'Maybe' } },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME TO BOX.', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FRIEND!', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME FOR SHOTS.', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', '...', false, 'IGNORE'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', '...hm?', false, 'IGNORE'), choices: null }
            ];
            assertScriptOutputEqual('branch-simple', reference, 'valid');
        });

        it('should handle a script with a branch that converges', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Alice', 'angry', 'I am also angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Richard', 'angry', 'I am semi-angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Fanagle', 'happy', 'I am anti-angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Eric', 'happy', 'I am okay-angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''), choices: { FIGHT: 'No', FRIENDSHIP: 'Yes', IGNORE: 'Maybe' } },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME TO BOX.', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: 'FIGHT', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FRIEND!', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME FOR SHOTS.', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: 'FRIENDSHIP', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', '...', false, 'IGNORE'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', '...hm?', false, 'IGNORE'), choices: null },
                { status: "GOOD", convergingLabel: 'IGNORE', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'neutral', 'Meh, you are alright...', false, ''), choices: null }
            ];
            assertScriptOutputEqual('branch-simple-converge', reference, 'valid');
        });

        it('should handle a script with a branch that converges repeatedly', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''), choices: { FIGHT: 'No', FRIENDSHIP: 'Yes', IGNORE: 'Maybe' } },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME TO BOX.', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: 'FIGHT', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FRIEND!', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME FOR SHOTS.', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: 'FRIENDSHIP', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', '...', false, 'IGNORE'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', '...hm?', false, 'IGNORE'), choices: null },
                { status: "GOOD", convergingLabel: 'IGNORE', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'Meh, you are alright... BUT I WILL ASK AGAIN!', true, ''), choices: { FIGHT: 'No', FRIENDSHIP: 'Yes', IGNORE: 'Maybe' } },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME TO BOX.', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: 'FIGHT', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FRIEND!', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME FOR SHOTS.', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: 'FRIENDSHIP', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', '...', false, 'IGNORE'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', '...hm?', false, 'IGNORE'), choices: null },
                { status: "GOOD", convergingLabel: 'IGNORE', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'neutral', 'Meh, you are alright...', false, ''), choices: null }
            ];
            assertScriptOutputEqual('branch-simple-converge-repeat', reference, 'valid');
        });

        it('should handle a script with a branch that converges with a permanent split', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Alice', 'angry', 'I am also angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Richard', 'angry', 'I am semi-angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Fanagle', 'happy', 'I am anti-angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Eric', 'happy', 'I am okay-angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''), choices: { FIGHT: 'No', FRIENDSHIP: 'Yes', IGNORE: 'Maybe' } },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME TO BOX.', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'WE BOXIN.', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FRIEND!', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME FOR SHOTS.', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: 'FRIENDSHIP', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', '...', false, 'IGNORE'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', '...hm?', false, 'IGNORE'), choices: null },
                { status: "GOOD", convergingLabel: 'IGNORE', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'neutral', 'Meh, you are alright...', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'WE ARE NOT ALRIGHT.', false, 'FIGHT'), choices: null }
            ];
            assertScriptOutputEqual('branch-simple-split', reference, 'valid');
        });

        it('should handle a script with a branch with interleaved paths', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''), choices: { FIGHT: 'No', FRIENDSHIP: 'Yes', IGNORE: 'Maybe' } },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FRIEND!', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', '...', false, 'IGNORE'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME TO BOX.', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME FOR SHOTS.', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', '...hm?', false, 'IGNORE'), choices: null }
            ];
            assertScriptOutputEqual('branch-simple-no-order', reference, 'valid');
        });

        it('should handle a script with a branch that converges with interleaved paths', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''), choices: { FIGHT: 'No', FRIENDSHIP: 'Yes', IGNORE: 'Maybe' } },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FRIEND!', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', '...', false, 'IGNORE'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME TO BOX.', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME FOR SHOTS.', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', '...hm?', false, 'IGNORE'), choices: null },
                { status: "GOOD", convergingLabel: 'FRIENDSHIP', node: null, choices: null },
                { status: "GOOD", convergingLabel: 'IGNORE', node: null, choices: null },
                { status: "GOOD", convergingLabel: 'FIGHT', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'neutral', 'Meh, you are alright...', false, ''), choices: null }
            ];
            assertScriptOutputEqual('branch-simple-converge-no-order', reference, 'valid');
        });

        it('should handle a script with nested branches', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''), choices: { FIGHT: 'No', FRIENDSHIP: 'Yes' } },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME TO BOX.', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('YOU', 'scared', 'Pick an attack.', true, 'FIGHT'), choices: { LOSE: 'Punch', WIN: 'Kick' } },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'happy', 'Har har! Bad move.', false, 'LOSE'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('YOU', 'dead', 'I am dead.', false, 'LOSE'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'sad', 'Oh no! You found the right move...', false, 'WIN'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('YOU', 'happy', 'I am not dead.', false, 'WIN'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FRIEND!', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME FOR SHOTS.', false, 'FRIENDSHIP'), choices: null }
            ];
            assertScriptOutputEqual('branch-nested', reference, 'valid');
        });

        it('should handle a script with nested branches that converge', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''), choices: { FIGHT: 'No', FRIENDSHIP: 'Yes' } },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME TO BOX.', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('YOU', 'scared', 'Pick an attack.', true, 'FIGHT'), choices: { LOSE: 'Punch', WIN: 'Kick' } },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'happy', 'Har har! Bad move.', false, 'LOSE'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('YOU', 'dead', 'I am dead.', false, 'LOSE'), choices: null },
                { status: "GOOD", convergingLabel: 'LOSE', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'sad', 'Oh no! You found the right move...', false, 'WIN'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('YOU', 'happy', 'I am not dead.', false, 'WIN'), choices: null },
                { status: "GOOD", convergingLabel: 'WIN', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'happy', 'Welp, good effort.', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: 'FIGHT', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FRIEND!', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME FOR SHOTS.', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: 'FRIENDSHIP', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'neutral', 'Meh, you are alright...', false, ''), choices: null }
            ];
            assertScriptOutputEqual('branch-nested-converge', reference, 'valid');
        });

        it('should handle a script with nested branches that converge with permanent splits', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''), choices: { FIGHT: 'No', FRIENDSHIP: 'Yes' } },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME TO BOX.', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('YOU', 'scared', 'Pick an attack.', true, 'FIGHT'), choices: { LOSE: 'Punch', WIN: 'Kick' } },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'happy', 'Har har! Bad move.', false, 'LOSE'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('YOU', 'dead', 'I am dead.', false, 'LOSE'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'sad', 'Oh no! You found the right move...', false, 'WIN'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('YOU', 'happy', 'I am not dead.', false, 'WIN'), choices: null },
                { status: "GOOD", convergingLabel: 'WIN', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'happy', 'Welp, good effort.', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FRIEND!', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME FOR SHOTS.', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: 'FRIENDSHIP', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'neutral', 'Meh, you are alright...', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'WE ARE NOT ALRIGHT.', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'RESPAWN ALREADY!', false, 'LOSE'), choices: null }
            ];
            assertScriptOutputEqual('branch-nested-split', reference, 'valid');
        });

        it('should handle a script with nested branches with interleaved paths', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''), choices: { FIGHT: 'No', FRIENDSHIP: 'Yes' } },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FRIEND!', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME TO BOX.', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('YOU', 'scared', 'Pick an attack.', true, 'FIGHT'), choices: { LOSE: 'Punch', WIN: 'Kick' } },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'happy', 'Har har! Bad move.', false, 'LOSE'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'sad', 'Oh no! You found the right move...', false, 'WIN'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME FOR SHOTS.', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('YOU', 'dead', 'I am dead.', false, 'LOSE'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('YOU', 'happy', 'I am not dead.', false, 'WIN'), choices: null } 
            ];
            assertScriptOutputEqual('branch-nested-no-order', reference, 'valid');
        });

        it('should handle a script with nested branches that converge with interleaved paths', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''), choices: { FIGHT: 'No', FRIENDSHIP: 'Yes' } },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FRIEND!', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME TO BOX.', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('YOU', 'scared', 'Pick an attack.', true, 'FIGHT'), choices: { LOSE: 'Punch', WIN: 'Kick' } },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'happy', 'Har har! Bad move.', false, 'LOSE'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'sad', 'Oh no! You found the right move...', false, 'WIN'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME FOR SHOTS.', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: 'FRIENDSHIP', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('YOU', 'dead', 'I am dead.', false, 'LOSE'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('YOU', 'happy', 'I am not dead.', false, 'WIN'), choices: null },
                { status: "GOOD", convergingLabel: 'WIN', node: null, choices: null },
                { status: "GOOD", convergingLabel: 'LOSE', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'happy', 'Welp, good effort.', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: 'FIGHT', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'neutral', 'Meh, you are alright...', false, ''), choices: null }
            ];
            assertScriptOutputEqual('branch-nested-converge-no-order', reference, 'valid');
        });
    });

    describe('invalid cases', () => {
        it('should error on an empty script', () => assertScriptInvalid('only-empty'));
        it('should error on a whitespace-only script', () => assertScriptInvalid('only-spaces'));
        it('should error on a comment-only script', () => assertScriptInvalid('only-comments'));

        it('should error if a node has no header', () => assertScriptInvalid('header-blank'));
        it('should error if a node header has too few elements', () => assertScriptInvalid('header-too-few'));
        it('should error if a node header too much elements', () => assertScriptInvalid('header-too-much'));
        it('should error if a node header has an invalid type', () => assertScriptInvalid('header-type'));

        it('should error if a node has no message', () => assertScriptInvalid('message-blank'));

        it('should error if a choice node has no choices', () => assertScriptInvalid('choices-blank'));
        it('should error if a choice node has badly formatted choices', () => assertScriptInvalid('choices-format'));
        it('should error if a choice node does not END its choices if there is an upcoming node', () => assertScriptInvalid('choices-no-end'));

        it('should error if a converge has no label', () => assertScriptInvalid('converge-no-label'));
        it('should error if a converge has the wrong keyword', () => assertScriptInvalid('converge-wrong-word'));

        it('should error if there exists an error in an otherwise valid script', () => {
            const names = [
                'header-blank', 'header-too-few', 'header-too-much', 'header-type',
                'message-blank',
                'choices-blank', 'choices-format', 'choices-no-end',
                'converge-no-label', 'converge-wrong-word'
            ];
            names.forEach(name => assertTemplatedScriptInvalid(name));
        });
    });

    describe('invalid syntax cases', () => {
        it('should handle a script that references an undefined label', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Richard', 'angry', 'Wait, are we fighting now?', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I suppose.', false, 'FIGHT'), choices: null }
            ];
            assertScriptOutputEqual('linear-simple-disconnect', reference, 'invalid-syntax');
        });

        it('should handle a script that converges on an undefined label', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: 'FIGHT', node: null, choices: null }
            ];
            assertScriptOutputEqual('linear-simple-disconnect-converge', reference, 'invalid-syntax');
        });

        it('should handle a script that tries to converge on its root', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Richard', 'angry', 'I am angry right now as well.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: '\'\'', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am converged angry right now.', false, ''), choices: null }
            ];
            assertScriptOutputEqual('linear-simple-root-converge', reference, 'invalid-syntax');
        });

        it('should handle a script that tries to converge twice', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''), choices: { FIGHT: 'No', FRIENDSHIP: 'Yes', IGNORE: 'Maybe' } },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME TO BOX.', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: 'FIGHT', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FRIEND!', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME FOR SHOTS.', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: 'FRIENDSHIP', node: null, choices: null },
                { status: "GOOD", convergingLabel: 'FRIENDSHIP', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', '...', false, 'IGNORE'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', '...hm?', false, 'IGNORE'), choices: null },
                { status: "GOOD", convergingLabel: 'IGNORE', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'neutral', 'Meh, you are alright...', false, ''), choices: null }
            ];
            assertScriptOutputEqual('branch-simple-twice-converged', reference, 'invalid-syntax');
        });

        it('should handle a script that tries to converge into a runaway parent', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''), choices: { FIGHT: 'No', FRIENDSHIP: 'Yes', IGNORE: 'Maybe' } },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME TO BOX.', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: 'FIGHT', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FRIEND!', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME FOR SHOTS.', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: 'FRIENDSHIP', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', '...', false, 'IGNORE'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', '...hm?', false, 'IGNORE'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'neutral', 'Meh, you are alright...', false, ''), choices: null },
                { status: "GOOD", convergingLabel: 'IGNORE', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'neutral', 'Meh, you are NOT ALRIGHT...', false, ''), choices: null }
            ];
            assertScriptOutputEqual('branch-simple-runaway-parent', reference, 'invalid-syntax');
        });

        it('should handle a script that has a parent path attempt to advance with no converging children', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''), choices: { FIGHT: 'No', FRIENDSHIP: 'Yes', IGNORE: 'Maybe' } },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME TO BOX.', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FRIEND!', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME FOR SHOTS.', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', '...', false, 'IGNORE'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', '...hm?', false, 'IGNORE'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'neutral', 'Meh, you are alright...', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'neutral', 'No harm your way.', false, ''), choices: null }
            ];
            assertScriptOutputEqual('branch-simple-not-converged', reference, 'invalid-syntax');
        });

        it('should handle a script that tries to converge on a newly declared path', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''), choices: { FIGHT: 'No', FRIENDSHIP: 'Yes', IGNORE: 'Maybe' } },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME TO BOX.', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: 'FIGHT', node: null, choices: null },
                { status: "GOOD", convergingLabel: 'FRIENDSHIP', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', '...', false, 'IGNORE'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', '...hm?', false, 'IGNORE'), choices: null },
                { status: "GOOD", convergingLabel: 'IGNORE', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'neutral', 'Meh, you are alright...', false, ''), choices: null }
            ];
            assertScriptOutputEqual('branch-simple-new-converge', reference, 'invalid-syntax');
        });

        it('should handle a script that references an undefined label (has a branch)', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''), choices: { FIGHT: 'No', FRIENDSHIP: 'Yes', IGNORE: 'Maybe' } },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'confused', 'Uh, is this here?', false, 'NOTFIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', '...', false, 'IGNORE'), choices: null }
            ];
            assertScriptOutputEqual('branch-simple-disconnect', reference, 'invalid-syntax');
        });

        it('should handle a script that has two choice nodes of the same label in a row', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''), choices: { FIGHT: 'No', FRIENDSHIP: 'Yes', IGNORE: 'Maybe' } },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'Choice electric boogaloo.', true, ''), choices: { WORLD: 'No', HELLO: 'Yes', OKAY: 'Maybe' } }
            ];
            assertScriptOutputEqual('branch-simple-double-choice', reference, 'invalid-syntax');
        });

        it('should handle a script with a path attempting to advance when it is converging', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''), choices: { FIGHT: 'No', FRIENDSHIP: 'Yes', IGNORE: 'Maybe' } },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME TO BOX.', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: 'FIGHT', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FRIEND!', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME FOR SHOTS.', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: 'FRIENDSHIP', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', '...', false, 'IGNORE'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', '...hm?', false, 'IGNORE'), choices: null },
                { status: "GOOD", convergingLabel: 'IGNORE', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'confused', 'Uh... we already converged...', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'neutral', 'Meh, you are alright...', false, ''), choices: null }
            ];
            assertScriptOutputEqual('branch-simple-already-converged', reference, 'invalid-syntax');
        });

        it('should handle a script where a path converges leaving a dangling choice', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''), choices: { FIGHT: 'No', FRIENDSHIP: 'Yes' } },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME TO BOX.', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('YOU', 'scared', 'Pick an attack.', true, 'FIGHT'), choices: { LOSE: 'Punch', WIN: 'Kick' } },
                { status: "GOOD", convergingLabel: 'FIGHT', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FRIEND!', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME FOR SHOTS.', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: 'FRIENDSHIP', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'neutral', 'Meh, you are alright...', false, ''), choices: null }
            ];
            assertScriptOutputEqual('branch-nested-choice-converge', reference, 'invalid-syntax');
        });

        it('should handle a script where a path attempts to converge with pending children', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''), choices: { FIGHT: 'No', FRIENDSHIP: 'Yes' } },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME TO BOX.', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('YOU', 'scared', 'Pick an attack.', true, 'FIGHT'), choices: { LOSE: 'Punch', WIN: 'Kick' } },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'happy', 'Har har! Bad move.', false, 'LOSE'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('YOU', 'dead', 'I am dead.', false, 'LOSE'), choices: null },
                { status: "GOOD", convergingLabel: 'LOSE', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'sad', 'Oh no! You found the right move...', false, 'WIN'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('YOU', 'happy', 'I am not dead.', false, 'WIN'), choices: null },
                { status: "GOOD", convergingLabel: 'WIN', node: null, choices: null },
                { status: "GOOD", convergingLabel: 'FIGHT', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FRIEND!', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME FOR SHOTS.', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: 'FRIENDSHIP', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'neutral', 'Meh, you are alright...', false, ''), choices: null }
            ];
            assertScriptOutputEqual('branch-nested-pending-children', reference, 'invalid-syntax');
        });

        it('should handle a script where an already defined label is redefined', () => {
            const reference = [
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''), choices: { FIGHT: 'No', FRIENDSHIP: 'Yes' } },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME TO BOX.', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('YOU', 'scared', 'Pick an attack.', true, 'FIGHT'), choices: { LOSE: 'Punch', FIGHT: 'Kick' } },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'happy', 'Har har! Bad move.', false, 'LOSE'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('YOU', 'dead', 'I am dead.', false, 'LOSE'), choices: null },
                { status: "GOOD", convergingLabel: 'LOSE', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'sad', 'Oh no! You found the right move...', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('YOU', 'happy', 'I am not dead.', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: 'FIGHT', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'happy', 'Welp, good effort.', false, 'FIGHT'), choices: null },
                { status: "GOOD", convergingLabel: 'FIGHT', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'Okay then, FRIEND!', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'pissed', 'TIME FOR SHOTS.', false, 'FRIENDSHIP'), choices: null },
                { status: "GOOD", convergingLabel: 'FRIENDSHIP', node: null, choices: null },
                { status: "GOOD", convergingLabel: null, node: new DialogueNode('Bob', 'neutral', 'Meh, you are alright...', false, ''), choices: null }
            ];
            assertScriptOutputEqual('branch-nested-reuse-label', reference, 'invalid-syntax');
        });
    });
});
