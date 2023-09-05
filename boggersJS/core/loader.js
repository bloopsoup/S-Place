import { Sprite } from "../components/index.js";

/** Handles loading in assets and state-persistent data.
 *  @memberof Core */
class Loader {
    /** @type {Object<string, Object<string, Sprite>>} */
    #sprites
    
    /** Create the loader.
     *  @param {Object<string, Array<Object>>} paths - An object that
     *      maps folder paths to lists of contained file metadata. */
    constructor(paths) {
        this.#sprites = {};
        for (const path in paths) paths[path].forEach(data => { data['path'] = path + data['filename']; this.#loadEntry(data); });
    }

    /** Gets the entry location from a given path. This info
     *  is used to index asset elements later.
     * @param {string} path - The full path. 
     * @returns {Array<string>} A pair consisting of the category of
     *      the file (parent folder) and the name of the file itself. */
    #getEntryLocation(path) {
        const pathParts = path.split('/');
        const category = pathParts[pathParts.length - 2];
        const filename = pathParts[pathParts.length - 1].split('.')[0];
        return [category, filename];
    }

    /** Gets the entry type from a given path.
     *  @param {string} path - The full path. 
     *  @returns {string | null} The entry type or null if there is no
     *      corresponding entry type to the path's extension. */
    #getEntryType(path) { 
        const extension = path.split('.')[1];
        switch (extension) {
            case 'png':
            case 'jpeg':
                return 'img';
            case 'mp3':
            case 'ogg':
                return 'audio';
            default:
                return null;
        }
    }

    /** Loads an asset element from the file metadata.
     *  @param {Object<string, Object>} data - The metadata of a file. */
    #loadEntry(data) {
        const elementType = this.#getEntryType(data['path']);
        if (elementType === null) return;
        if (elementType === 'img') this.#loadSprite(data);
    }

    /** Loads a sprite into the loader. 
     *  @param {Object<string, Object>} data - The metadata of a file. */
    #loadSprite(data) {
        const [category, filename] = this.#getEntryLocation(data['path']);
        const element = document.createElement('img');
        element.src = data['path'];

        if (!(category in this.#sprites)) this.#sprites[category] = {};
        this.#sprites[category][filename] = new Sprite(filename, data['size'], data['format']);
    }

    /** Gets a loaded sprite.
     *  @param {string} category - The category of the element. 
     *  @param {string} filename - The filename of the element.
     *  @returns {Sprite} The retrieved element. */
    getSprite(category, filename) { return this.#sprites[category][filename]; }
}

export default Loader;
