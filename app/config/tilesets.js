import { Vector2 } from '../../boggersJS/common/index.js';

export const minimal = {
    '1-T':  new Vector2(0, 0), '1-L':  new Vector2(0, 1), '1-D':  new Vector2(0, 2), '1-R':  new Vector2(0, 3), 
    'I-TR': new Vector2(0, 4), 'I-TL': new Vector2(1, 0), 'I-LL': new Vector2(1, 1), 'I-LR': new Vector2(1, 2), 
    'I-RL': new Vector2(1, 3), 'I-RR': new Vector2(1, 4), 'I-BL': new Vector2(2, 0), 'I-BR': new Vector2(2, 1),
    '2-TL': new Vector2(2, 2), '2-DL': new Vector2(2, 3), '2-DR': new Vector2(2, 4), '2-TR': new Vector2(3, 0), '2-TD': new Vector2(3, 1), '2-LR': new Vector2(3, 2),
    '3-R':  new Vector2(3, 3), '3-T':  new Vector2(3, 4), '3-L':  new Vector2(4, 0), '3-D':  new Vector2(4, 1), 
    '4':    new Vector2(4, 2),
    'S-DR': new Vector2(4, 3), 'S-TR': new Vector2(4, 4), 'S-TL': new Vector2(5, 0), 'S-DL': new Vector2(5, 1),
    '0-T':  new Vector2(5, 2),
    'X':    new Vector2(5, 3),
    'GRSS': new Vector2(5, 4), 
    'PLNT': new Vector2(6, 0), 'POTS': new Vector2(6, 1), 'BUSH': new Vector2(6, 2), 'FUSH': new Vector2(6, 3), 
    'LEF1': new Vector2(6, 4), 'LEF2': new Vector2(7, 0), 'FLO1': new Vector2(7, 1), 'FLO2': new Vector2(7, 2),
    'FEN2': new Vector2(7, 3), 'FEN1': new Vector2(7, 4)
};
Object.keys(minimal).forEach(key => minimal[key].swap());
