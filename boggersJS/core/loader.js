/** Handles loading in assets and state-persistent data.
 *  @memberof Core */
class Loader {
    /** @type {Object<string, Object<string, HTMLElement>>} */
    #elements
    
    /** Create the loader.
     *  @param {Object<string, Array<string>>} paths - An object that
     *      maps folder paths to lists of filenames contained in those
     *      folders. */
    constructor(paths) {
        this.#elements = {};
        for (const path in paths) paths[path].forEach(filename => this.#loadElement(`${path}${filename}`));
    }

    /** Gets the element type from a given path.
     *  @param {string} path - The full path. 
     *  @returns {string | null} The element type or null if there is no
     *      corresponding element type to the path's extension. */
    #getElementType(path) { 
        const extension = path.split('.')[path.split('.').length - 1];
        switch (extension) {
            case 'png':
            case 'jpeg':
                return 'img';
            case 'mp3':
            case 'ogg':
                return 'audio';
            default:
                return null
        }
    }

    /** Gets the entry location from a given path. This info
     *  is used to index asset elements later.
     * @param {string} path - The full path. 
     * @returns {Array<string>} A pair consisting of the category of
     *      the file (parent folder) and the name of the file itself. */
    #getEntryLocation(path) {
        const pathParts = path.split('/');
        const category = pathParts[pathParts.length - 2];
        const filename = pathParts[pathParts.length - 1];
        return [category, filename];
    }

    /** Adds an entry to the loader.
     *  @param {HTMLImageElement | HTMLAudioElement} element - The element
     *      of the entry being added. Note that its SRC attribute will be
     *      used to determine the entry's location. */
    #addEntry(element) {
        const [category, filename] = this.#getEntryLocation(element.src);
        if (!(category in this.#elements)) this.#elements[category] = {};
        this.#elements[category][filename] = element;
    }

    /** Loads an asset element from the path and adds it as an entry.
     *  @param {string} path - The full path. */
    #loadElement(path) {
        const elementType = this.#getElementType(path);
        if (elementType === null) return;

        const element = document.createElement(elementType);
        element.src = path;
        this.#addEntry(element);
    }
}

export default Loader;
