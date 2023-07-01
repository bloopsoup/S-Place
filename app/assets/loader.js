import { Vector2 } from '../../boggersJS/common/index.js';
import { Sprite } from '../../boggersJS/components/index.js';

/** All loaded character sprites.
 *  @type {Object<string, CallableFunction>} */
export const characters = {
    'xoki':             () => new Sprite('xoki', new Vector2(80, 80), [20, 20, 5, 5, 1, 1, 1, 1])
};

/** All loaded decoration sprites.
 *  @type {Object<string, CallableFunction>} */
export const decoration = {
    'bg-back-peaks':    () => new Sprite('bg-back-peaks', new Vector2(1280, 720), [1]),
    'bg-front-bench':   () => new Sprite('bg-front-bench', new Vector2(1280, 720), [1]),
    'bg-mid-flag':      () => new Sprite('bg-mid-flag', new Vector2(1280, 720), [1]),

    'tiles-bld-small':  () => new Sprite('tiles-bld-small', new Vector2(240, 240), [2, 2, 2]),
    'tiles-grass':      () => new Sprite('tiles-grass', new Vector2(80, 80), [5, 5, 5, 5, 5, 5, 5, 5])
};

/** All loaded levels.
 *  @type {Object<string, CallableFunction>} */
export const levels = {
    'town-grass':       () => new Sprite('town-grass', new Vector2(4000, 800), [1]),
    'town-bld':         () => new Sprite('town-bld', new Vector2(4000, 800), [1])
};

/** All loaded UI sprites.
 *  @type {Object<string, CallableFunction>} */
export const ui = {
    'text-input':       () => new Sprite('text-input', new Vector2(600, 75), [2])
};

/** All loaded weapon sprites.
 *  @type {Object<string, CallableFunction>} */
export const weapons = {
    'bullet':           () => new Sprite('bullet', new Vector2(10, 10), [1]),
    'smg':              () => new Sprite('smg', new Vector2(100, 36), [1, 1, 2, 2, 1, 1], 10)
};
