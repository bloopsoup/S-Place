export default class Input {
    /** Stores input related information such as mouse positions. */

    #name
    #pos

    constructor(name, pos) {
        this.#name = name;
        this.#pos = pos;
    }

    get name() { return this.#name; }
    get pos() { return this.#pos.copy(); }

    copy() { return new Input(this.#name, this.#pos.copy()); }
}
