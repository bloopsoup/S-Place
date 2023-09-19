import { describe, it } from 'node:test';
import { DialogueNode } from './index.js';
import { assertTreeEqual, assertTreeInvalid } from './helpers.js';

describe('DScriptParser parse', () => {
    describe('valid cases', () => {
        it('should handle a script with one message node', () => {
            const referenceNodes = [
                new DialogueNode('Bob', 'angry', 'I am angry right now.', false, '')
            ];
            const root = referenceNodes[0];

            assertTreeEqual('linear-single', root, 'valid');
        });

        it('should handle a script with many message nodes', () => {
            const referenceNodes = [
                new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''),
                new DialogueNode('Alice', 'angry', 'I am also angry right now.', false, ''),
                new DialogueNode('Richard', 'angry', 'I am semi-angry right now.', false, ''),
                new DialogueNode('Fanagle', 'happy', 'I am anti-angry right now.', false, ''),
                new DialogueNode('Eric', 'happy', 'I am okay-angry right now.', false, '')
            ];
            const root = referenceNodes[0];
            referenceNodes[0].addNeighbor(referenceNodes[1]);
            referenceNodes[1].addNeighbor(referenceNodes[2]);
            referenceNodes[2].addNeighbor(referenceNodes[3]);
            referenceNodes[3].addNeighbor(referenceNodes[4]);

            assertTreeEqual('linear-simple', root, 'valid');
        });

        it('should handle a script with many message nodes with comments and whitespace', () => {
            const referenceNodes = [
                new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''),
                new DialogueNode('Alice', 'angry', 'I am also angry right now.', false, ''),
                new DialogueNode('Richard', 'angry', 'I am semi-angry right now.', false, ''),
                new DialogueNode('Fanagle', 'happy', 'I am anti-angry right now.', false, ''),
                new DialogueNode('Eric', 'happy', 'I am okay-angry right now.', false, '')
            ];
            const root = referenceNodes[0];
            referenceNodes[0].addNeighbor(referenceNodes[1]);
            referenceNodes[1].addNeighbor(referenceNodes[2]);
            referenceNodes[2].addNeighbor(referenceNodes[3]);
            referenceNodes[3].addNeighbor(referenceNodes[4]);

            assertTreeEqual('linear-simple-comment', root, 'valid');
        });

        it('should handle a script with one choice node', () => {
            const referenceNodes = [
                new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, '')
            ];
            const root = referenceNodes[0];

            assertTreeEqual('branch-single', root, 'valid');
        });

        it('should handle a script with one nested choice node', () => {
            const referenceNodes = [
                new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''),
                new DialogueNode('YOU', 'scared', 'Pick an attack.', true, 'FIGHT')
            ];
            const root = referenceNodes[0];
            referenceNodes[0].addNeighbor(referenceNodes[1]);
            referenceNodes[1].choiceMessage = 'No';

            assertTreeEqual('branch-single-nested', root, 'valid');
        });

        it('should handle a script with a branch', () => {
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
            const root = referenceNodes[0];
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

            assertTreeEqual('branch-simple', root, 'valid');
        });

        it('should handle a script with a branch that converges', () => {
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
                new DialogueNode('Bob', 'pissed', '...hm?', false, 'IGNORE'),
                new DialogueNode('Bob', 'neutral', 'Meh, you are alright...', false, '')
            ];
            const root = referenceNodes[0];
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

            referenceNodes[7].addNeighbor(referenceNodes[12]);
            referenceNodes[9].addNeighbor(referenceNodes[12]);
            referenceNodes[11].addNeighbor(referenceNodes[12]);

            assertTreeEqual('branch-simple-converge', root, 'valid');
        });

        it('should handle a script with a branch that converges repeatedly', () => {
            const referenceNodes = [
                new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''),
                new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'),
                new DialogueNode('Bob', 'pissed', 'TIME TO BOX.', false, 'FIGHT'),
                new DialogueNode('Bob', 'pissed', 'Okay then, FRIEND!', false, 'FRIENDSHIP'),
                new DialogueNode('Bob', 'pissed', 'TIME FOR SHOTS.', false, 'FRIENDSHIP'),
                new DialogueNode('Bob', 'pissed', '...', false, 'IGNORE'),
                new DialogueNode('Bob', 'pissed', '...hm?', false, 'IGNORE'),
                new DialogueNode('Bob', 'angry', 'Meh, you are alright... BUT I WILL ASK AGAIN!', true, ''),
                new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'),
                new DialogueNode('Bob', 'pissed', 'TIME TO BOX.', false, 'FIGHT'),
                new DialogueNode('Bob', 'pissed', 'Okay then, FRIEND!', false, 'FRIENDSHIP'),
                new DialogueNode('Bob', 'pissed', 'TIME FOR SHOTS.', false, 'FRIENDSHIP'),
                new DialogueNode('Bob', 'pissed', '...', false, 'IGNORE'),
                new DialogueNode('Bob', 'pissed', '...hm?', false, 'IGNORE'),
                new DialogueNode('Bob', 'neutral', 'Meh, you are alright...', false, '')
            ];
            const root = referenceNodes[0];
            referenceNodes[0].addNeighbor(referenceNodes[1]);
            referenceNodes[1].choiceMessage = 'No';
            referenceNodes[1].addNeighbor(referenceNodes[2]);

            referenceNodes[0].addNeighbor(referenceNodes[3]);
            referenceNodes[3].choiceMessage = 'Yes';
            referenceNodes[3].addNeighbor(referenceNodes[4]);

            referenceNodes[0].addNeighbor(referenceNodes[5]);
            referenceNodes[5].choiceMessage = 'Maybe';
            referenceNodes[5].addNeighbor(referenceNodes[6]);

            referenceNodes[2].addNeighbor(referenceNodes[7]);
            referenceNodes[4].addNeighbor(referenceNodes[7]);
            referenceNodes[6].addNeighbor(referenceNodes[7]);

            referenceNodes[7].addNeighbor(referenceNodes[8]);
            referenceNodes[8].choiceMessage = 'No';
            referenceNodes[8].addNeighbor(referenceNodes[9]);

            referenceNodes[7].addNeighbor(referenceNodes[10]);
            referenceNodes[10].choiceMessage = 'Yes';
            referenceNodes[10].addNeighbor(referenceNodes[11]);

            referenceNodes[7].addNeighbor(referenceNodes[12]);
            referenceNodes[12].choiceMessage = 'Maybe';
            referenceNodes[12].addNeighbor(referenceNodes[13]);

            referenceNodes[9].addNeighbor(referenceNodes[14]);
            referenceNodes[11].addNeighbor(referenceNodes[14]);
            referenceNodes[13].addNeighbor(referenceNodes[14]);

            assertTreeEqual('branch-simple-converge-repeat', root, 'valid');
        });

        it('should handle a script with a branch that converges with a permanent split', () => {
            const referenceNodes = [
                new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''),
                new DialogueNode('Alice', 'angry', 'I am also angry right now.', false, ''),
                new DialogueNode('Richard', 'angry', 'I am semi-angry right now.', false, ''),
                new DialogueNode('Fanagle', 'happy', 'I am anti-angry right now.', false, ''),
                new DialogueNode('Eric', 'happy', 'I am okay-angry right now.', false, ''),
                new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''),
                new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'),
                new DialogueNode('Bob', 'pissed', 'TIME TO BOX.', false, 'FIGHT'),
                new DialogueNode('Bob', 'pissed', 'WE BOXIN.', false, 'FIGHT'),
                new DialogueNode('Bob', 'pissed', 'Okay then, FRIEND!', false, 'FRIENDSHIP'),
                new DialogueNode('Bob', 'pissed', 'TIME FOR SHOTS.', false, 'FRIENDSHIP'),
                new DialogueNode('Bob', 'pissed', '...', false, 'IGNORE'),
                new DialogueNode('Bob', 'pissed', '...hm?', false, 'IGNORE'),
                new DialogueNode('Bob', 'neutral', 'Meh, you are alright...', false, ''),
                new DialogueNode('Bob', 'pissed', 'WE ARE NOT ALRIGHT.', false, 'FIGHT')
            ];
            const root = referenceNodes[0];
            referenceNodes[0].addNeighbor(referenceNodes[1]);
            referenceNodes[1].addNeighbor(referenceNodes[2]);
            referenceNodes[2].addNeighbor(referenceNodes[3]);
            referenceNodes[3].addNeighbor(referenceNodes[4]);
            referenceNodes[4].addNeighbor(referenceNodes[5]);

            referenceNodes[5].addNeighbor(referenceNodes[6]);
            referenceNodes[6].choiceMessage = 'No';
            referenceNodes[6].addNeighbor(referenceNodes[7]);
            referenceNodes[7].addNeighbor(referenceNodes[8]);
            referenceNodes[8].addNeighbor(referenceNodes[14]);

            referenceNodes[5].addNeighbor(referenceNodes[9]);
            referenceNodes[9].choiceMessage = 'Yes';
            referenceNodes[9].addNeighbor(referenceNodes[10]);

            referenceNodes[5].addNeighbor(referenceNodes[11]);
            referenceNodes[11].choiceMessage = 'Maybe';
            referenceNodes[11].addNeighbor(referenceNodes[12]);

            referenceNodes[10].addNeighbor(referenceNodes[13]);
            referenceNodes[12].addNeighbor(referenceNodes[13]);

            assertTreeEqual('branch-simple-split', root, 'valid');
        });

        it('should handle a script with a branch with interleaved paths', () => {
            const referenceNodes = [
                new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''),
                new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''),
                new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'),
                new DialogueNode('Bob', 'pissed', 'TIME TO BOX.', false, 'FIGHT'),
                new DialogueNode('Bob', 'pissed', 'Okay then, FRIEND!', false, 'FRIENDSHIP'),
                new DialogueNode('Bob', 'pissed', 'TIME FOR SHOTS.', false, 'FRIENDSHIP'),
                new DialogueNode('Bob', 'pissed', '...', false, 'IGNORE'),
                new DialogueNode('Bob', 'pissed', '...hm?', false, 'IGNORE')
            ];
            const root = referenceNodes[0];
            referenceNodes[0].addNeighbor(referenceNodes[1]);

            referenceNodes[1].addNeighbor(referenceNodes[2]);
            referenceNodes[2].choiceMessage = 'No';
            referenceNodes[2].addNeighbor(referenceNodes[3]);

            referenceNodes[1].addNeighbor(referenceNodes[4]);
            referenceNodes[4].choiceMessage = 'Yes';
            referenceNodes[4].addNeighbor(referenceNodes[5]);

            referenceNodes[1].addNeighbor(referenceNodes[6]);
            referenceNodes[6].choiceMessage = 'Maybe';
            referenceNodes[6].addNeighbor(referenceNodes[7]);

            assertTreeEqual('branch-simple-no-order', root, 'valid');
        });

        it('should handle a script with a branch that converges with interleaved paths', () => {
            const referenceNodes = [
                new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''),
                new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''),
                new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'),
                new DialogueNode('Bob', 'pissed', 'TIME TO BOX.', false, 'FIGHT'),
                new DialogueNode('Bob', 'pissed', 'Okay then, FRIEND!', false, 'FRIENDSHIP'),
                new DialogueNode('Bob', 'pissed', 'TIME FOR SHOTS.', false, 'FRIENDSHIP'),
                new DialogueNode('Bob', 'pissed', '...', false, 'IGNORE'),
                new DialogueNode('Bob', 'pissed', '...hm?', false, 'IGNORE'),
                new DialogueNode('Bob', 'neutral', 'Meh, you are alright...', false, '')
            ];
            const root = referenceNodes[0];
            referenceNodes[0].addNeighbor(referenceNodes[1]);

            referenceNodes[1].addNeighbor(referenceNodes[2]);
            referenceNodes[2].choiceMessage = 'No';
            referenceNodes[2].addNeighbor(referenceNodes[3]);

            referenceNodes[1].addNeighbor(referenceNodes[4]);
            referenceNodes[4].choiceMessage = 'Yes';
            referenceNodes[4].addNeighbor(referenceNodes[5]);

            referenceNodes[1].addNeighbor(referenceNodes[6]);
            referenceNodes[6].choiceMessage = 'Maybe';
            referenceNodes[6].addNeighbor(referenceNodes[7]);

            referenceNodes[3].addNeighbor(referenceNodes[8]);
            referenceNodes[5].addNeighbor(referenceNodes[8]);
            referenceNodes[7].addNeighbor(referenceNodes[8]);

            assertTreeEqual('branch-simple-converge-no-order', root, 'valid');
        });

        it('should handle a script with nested branches', () => {
            const referenceNodes = [
                new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''),
                new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''),
                new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'),
                new DialogueNode('Bob', 'pissed', 'TIME TO BOX.', false, 'FIGHT'),
                new DialogueNode('YOU', 'scared', 'Pick an attack.', true, 'FIGHT'),
                new DialogueNode('Bob', 'happy', 'Har har! Bad move.', false, 'LOSE'),
                new DialogueNode('YOU', 'dead', 'I am dead.', false, 'LOSE'),
                new DialogueNode('Bob', 'sad', 'Oh no! You found the right move...', false, 'WIN'),
                new DialogueNode('YOU', 'happy', 'I am not dead.', false, 'WIN'),
                new DialogueNode('Bob', 'pissed', 'Okay then, FRIEND!', false, 'FRIENDSHIP'),
                new DialogueNode('Bob', 'pissed', 'TIME FOR SHOTS.', false, 'FRIENDSHIP')
            ];
            const root = referenceNodes[0];
            referenceNodes[0].addNeighbor(referenceNodes[1]);

            referenceNodes[1].addNeighbor(referenceNodes[2]);
            referenceNodes[2].choiceMessage = 'No';
            referenceNodes[2].addNeighbor(referenceNodes[3]);
            referenceNodes[3].addNeighbor(referenceNodes[4]);

            referenceNodes[4].addNeighbor(referenceNodes[5]);
            referenceNodes[5].choiceMessage = 'Punch';
            referenceNodes[5].addNeighbor(referenceNodes[6]);

            referenceNodes[4].addNeighbor(referenceNodes[7]);
            referenceNodes[7].choiceMessage = 'Kick';
            referenceNodes[7].addNeighbor(referenceNodes[8]);

            referenceNodes[1].addNeighbor(referenceNodes[9]);
            referenceNodes[9].choiceMessage = 'Yes';
            referenceNodes[9].addNeighbor(referenceNodes[10]);

            assertTreeEqual('branch-nested', root, 'valid');
        });

        it('should handle a script with nested branches that converge', () => {
            const referenceNodes = [
                new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''),
                new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''),
                new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'),
                new DialogueNode('Bob', 'pissed', 'TIME TO BOX.', false, 'FIGHT'),
                new DialogueNode('YOU', 'scared', 'Pick an attack.', true, 'FIGHT'),
                new DialogueNode('Bob', 'happy', 'Har har! Bad move.', false, 'LOSE'),
                new DialogueNode('YOU', 'dead', 'I am dead.', false, 'LOSE'),
                new DialogueNode('Bob', 'sad', 'Oh no! You found the right move...', false, 'WIN'),
                new DialogueNode('YOU', 'happy', 'I am not dead.', false, 'WIN'),
                new DialogueNode('Bob', 'happy', 'Welp, good effort.', false, 'FIGHT'),
                new DialogueNode('Bob', 'pissed', 'Okay then, FRIEND!', false, 'FRIENDSHIP'),
                new DialogueNode('Bob', 'pissed', 'TIME FOR SHOTS.', false, 'FRIENDSHIP'),
                new DialogueNode('Bob', 'neutral', 'Meh, you are alright...', false, '')
            ];
            const root = referenceNodes[0];
            referenceNodes[0].addNeighbor(referenceNodes[1]);

            referenceNodes[1].addNeighbor(referenceNodes[2]);
            referenceNodes[2].choiceMessage = 'No';
            referenceNodes[2].addNeighbor(referenceNodes[3]);
            referenceNodes[3].addNeighbor(referenceNodes[4]);

            referenceNodes[4].addNeighbor(referenceNodes[5]);
            referenceNodes[5].choiceMessage = 'Punch';
            referenceNodes[5].addNeighbor(referenceNodes[6]);

            referenceNodes[4].addNeighbor(referenceNodes[7]);
            referenceNodes[7].choiceMessage = 'Kick';
            referenceNodes[7].addNeighbor(referenceNodes[8]);

            referenceNodes[6].addNeighbor(referenceNodes[9]);
            referenceNodes[8].addNeighbor(referenceNodes[9]);

            referenceNodes[1].addNeighbor(referenceNodes[10]);
            referenceNodes[10].choiceMessage = 'Yes';
            referenceNodes[10].addNeighbor(referenceNodes[11]);

            referenceNodes[9].addNeighbor(referenceNodes[12]);
            referenceNodes[11].addNeighbor(referenceNodes[12]);

            assertTreeEqual('branch-nested-converge', root, 'valid');
        });

        it('should handle a script with nested branches that converge with permanent splits', () => {
            const referenceNodes = [
                new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''),
                new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''),
                new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'),
                new DialogueNode('Bob', 'pissed', 'TIME TO BOX.', false, 'FIGHT'),
                new DialogueNode('YOU', 'scared', 'Pick an attack.', true, 'FIGHT'),
                new DialogueNode('Bob', 'happy', 'Har har! Bad move.', false, 'LOSE'),
                new DialogueNode('YOU', 'dead', 'I am dead.', false, 'LOSE'),
                new DialogueNode('Bob', 'sad', 'Oh no! You found the right move...', false, 'WIN'),
                new DialogueNode('YOU', 'happy', 'I am not dead.', false, 'WIN'),
                new DialogueNode('Bob', 'happy', 'Welp, good effort.', false, 'FIGHT'),
                new DialogueNode('Bob', 'pissed', 'Okay then, FRIEND!', false, 'FRIENDSHIP'),
                new DialogueNode('Bob', 'pissed', 'TIME FOR SHOTS.', false, 'FRIENDSHIP'),
                new DialogueNode('Bob', 'neutral', 'Meh, you are alright...', false, ''),
                new DialogueNode('Bob', 'pissed', 'WE ARE NOT ALRIGHT.', false, 'FIGHT'),
                new DialogueNode('Bob', 'pissed', 'RESPAWN ALREADY!', false, 'LOSE')
            ];
            const root = referenceNodes[0];
            referenceNodes[0].addNeighbor(referenceNodes[1]);

            referenceNodes[1].addNeighbor(referenceNodes[2]);
            referenceNodes[2].choiceMessage = 'No';
            referenceNodes[2].addNeighbor(referenceNodes[3]);
            referenceNodes[3].addNeighbor(referenceNodes[4]);

            referenceNodes[4].addNeighbor(referenceNodes[5]);
            referenceNodes[5].choiceMessage = 'Punch';
            referenceNodes[5].addNeighbor(referenceNodes[6]);

            referenceNodes[4].addNeighbor(referenceNodes[7]);
            referenceNodes[7].choiceMessage = 'Kick';
            referenceNodes[7].addNeighbor(referenceNodes[8]);

            referenceNodes[8].addNeighbor(referenceNodes[9]);

            referenceNodes[1].addNeighbor(referenceNodes[10]);
            referenceNodes[10].choiceMessage = 'Yes';
            referenceNodes[10].addNeighbor(referenceNodes[11]);

            referenceNodes[11].addNeighbor(referenceNodes[12]);
            referenceNodes[9].addNeighbor(referenceNodes[13]);
            referenceNodes[6].addNeighbor(referenceNodes[14]);

            assertTreeEqual('branch-nested-split', root, 'valid');
        });

        it('should handle a script with nested branches with interleaved paths', () => {
            const referenceNodes = [
                new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''),
                new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''),
                new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'),
                new DialogueNode('Bob', 'pissed', 'TIME TO BOX.', false, 'FIGHT'),
                new DialogueNode('YOU', 'scared', 'Pick an attack.', true, 'FIGHT'),
                new DialogueNode('Bob', 'happy', 'Har har! Bad move.', false, 'LOSE'),
                new DialogueNode('YOU', 'dead', 'I am dead.', false, 'LOSE'),
                new DialogueNode('Bob', 'sad', 'Oh no! You found the right move...', false, 'WIN'),
                new DialogueNode('YOU', 'happy', 'I am not dead.', false, 'WIN'),
                new DialogueNode('Bob', 'pissed', 'Okay then, FRIEND!', false, 'FRIENDSHIP'),
                new DialogueNode('Bob', 'pissed', 'TIME FOR SHOTS.', false, 'FRIENDSHIP')
            ];
            const root = referenceNodes[0];
            referenceNodes[0].addNeighbor(referenceNodes[1]);

            referenceNodes[1].addNeighbor(referenceNodes[2]);
            referenceNodes[2].choiceMessage = 'No';
            referenceNodes[2].addNeighbor(referenceNodes[3]);
            referenceNodes[3].addNeighbor(referenceNodes[4]);

            referenceNodes[4].addNeighbor(referenceNodes[5]);
            referenceNodes[5].choiceMessage = 'Punch';
            referenceNodes[5].addNeighbor(referenceNodes[6]);

            referenceNodes[4].addNeighbor(referenceNodes[7]);
            referenceNodes[7].choiceMessage = 'Kick';
            referenceNodes[7].addNeighbor(referenceNodes[8]);

            referenceNodes[1].addNeighbor(referenceNodes[9]);
            referenceNodes[9].choiceMessage = 'Yes';
            referenceNodes[9].addNeighbor(referenceNodes[10]);

            assertTreeEqual('branch-nested-no-order', root, 'valid');
        });

        it('should handle a script with nested branches that converge with interleaved paths', () => {
            const referenceNodes = [
                new DialogueNode('Bob', 'angry', 'I am angry right now.', false, ''),
                new DialogueNode('Bob', 'angry', 'I am angry right now. Are you?', true, ''),
                new DialogueNode('Bob', 'pissed', 'Okay then, FIGHT!', false, 'FIGHT'),
                new DialogueNode('Bob', 'pissed', 'TIME TO BOX.', false, 'FIGHT'),
                new DialogueNode('YOU', 'scared', 'Pick an attack.', true, 'FIGHT'),
                new DialogueNode('Bob', 'happy', 'Har har! Bad move.', false, 'LOSE'),
                new DialogueNode('YOU', 'dead', 'I am dead.', false, 'LOSE'),
                new DialogueNode('Bob', 'sad', 'Oh no! You found the right move...', false, 'WIN'),
                new DialogueNode('YOU', 'happy', 'I am not dead.', false, 'WIN'),
                new DialogueNode('Bob', 'happy', 'Welp, good effort.', false, 'FIGHT'),
                new DialogueNode('Bob', 'pissed', 'Okay then, FRIEND!', false, 'FRIENDSHIP'),
                new DialogueNode('Bob', 'pissed', 'TIME FOR SHOTS.', false, 'FRIENDSHIP'),
                new DialogueNode('Bob', 'neutral', 'Meh, you are alright...', false, '')
            ];
            const root = referenceNodes[0];
            referenceNodes[0].addNeighbor(referenceNodes[1]);

            referenceNodes[1].addNeighbor(referenceNodes[2]);
            referenceNodes[2].choiceMessage = 'No';
            referenceNodes[2].addNeighbor(referenceNodes[3]);
            referenceNodes[3].addNeighbor(referenceNodes[4]);

            referenceNodes[4].addNeighbor(referenceNodes[5]);
            referenceNodes[5].choiceMessage = 'Punch';
            referenceNodes[5].addNeighbor(referenceNodes[6]);

            referenceNodes[4].addNeighbor(referenceNodes[7]);
            referenceNodes[7].choiceMessage = 'Kick';
            referenceNodes[7].addNeighbor(referenceNodes[8]);

            referenceNodes[6].addNeighbor(referenceNodes[9]);
            referenceNodes[8].addNeighbor(referenceNodes[9]);

            referenceNodes[1].addNeighbor(referenceNodes[10]);
            referenceNodes[10].choiceMessage = 'Yes';
            referenceNodes[10].addNeighbor(referenceNodes[11]);

            referenceNodes[9].addNeighbor(referenceNodes[12]);
            referenceNodes[11].addNeighbor(referenceNodes[12]);

            assertTreeEqual('branch-nested-converge-no-order', root, 'valid');
        });
    });

    describe('invalid syntax cases', () => {
        it('should handle a script that references an undefined label', () => assertTreeInvalid('linear-simple-disconnect'));
        it('should handle a script that converges on an undefined label', () => assertTreeInvalid('linear-simple-disconnect-converge'));
        it('should handle a script that tries to converge on its root', () => assertTreeInvalid('linear-simple-root-converge'));
        it('should handle a script that tries to converge twice', () => assertTreeInvalid('branch-simple-twice-converged'));
        it('should handle a script that tries to converge into a runaway parent', () => assertTreeInvalid('branch-simple-runaway-parent'));
        it('should handle a script that has a parent path attempt to advance with no converging children', () => assertTreeInvalid('branch-simple-not-converged'));
        it('should handle a script that tries to converge on a newly declared path', () => assertTreeInvalid('branch-simple-new-converge'));
        it('should handle a script that references an undefined label (has a branch)', () => assertTreeInvalid('branch-simple-disconnect'));
        it('should handle a script that has two choice nodes of the same label in a row', () => assertTreeInvalid('branch-simple-double-choice'));
        it('should handle a script with a path attempting to advance when it is converging', () => assertTreeInvalid('branch-simple-already-converged'));
        it('should handle a script where a path converges leaving a dangling choice', () => assertTreeInvalid('branch-nested-choice-converge'));
        it('should handle a script where a path attempts to converge with pending children', () => assertTreeInvalid('branch-nested-pending-children'));
        it('should handle a script where an already defined label is redefined', () => assertTreeInvalid('branch-nested-reuse-label'));
        it('should handle a script with a branch that converges repeatedly with a long-running path', () => assertTreeInvalid('branch-simple-returning-parent'));
    });
});
