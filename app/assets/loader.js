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

    'bld-small-band':   () => new Sprite('bld-small-band', new Vector2(160, 160), [1]),
    'bld-small-blocks': () => new Sprite('bld-small-blocks', new Vector2(160, 160), [1]),
    'bld-small-cafe':   () => new Sprite('bld-small-cafe', new Vector2(160, 160), [1]),
    'bld-small-shop':   () => new Sprite('bld-small-shop', new Vector2(160, 160), [1]),
    'bld-small-sloped': () => new Sprite('bld-small-sloped', new Vector2(160, 160), [1]),
    'bld-small-window': () => new Sprite('bld-small-window', new Vector2(160, 160), [1]),

    'tiles-grass':      () => new Sprite('tiles-grass', new Vector2(80, 80), [5, 5, 5, 5, 5, 5, 5, 5])
};

/** All loaded UI sprites.
 *  @type {Object<string, CallableFunction>} */
export const ui = {

};

/** All loaded weapon sprites.
 *  @type {Object<string, CallableFunction>} */
export const weapons = {
    'bullet':           () => new Sprite('bullet', new Vector2(10, 10), [1]),
    'smg':              () => new Sprite('smg', new Vector2(100, 36), [1, 1, 10, 10, 1, 1])
}
