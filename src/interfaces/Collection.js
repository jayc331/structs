export class Collection {

    /**
     * Creates a new class by composing mixins with this base class.
     * @param {...Function} mixins - Mixin functions to apply to this class.
     * @returns {typeof Collection} A new class with the mixins applied.
     */
    static with(...mixins) {
        return mixins.reduce((base, mixin) => mixin(base), this);
    }

    /**
     * Checks if the collection is currently empty.
     * @abstract
     * @returns {boolean} True if the collection contains no elements, false otherwise.
     * @throws {Error} Must be implemented by subclasses.
     */
    get empty() {
        throw new Error('Getter empty must be implemented by subclasses.');
    }

    /**
     * Gets the current number of elements in the collection.
     * @abstract
     * @returns {number} The size of the collection.
     * @throws {Error} Must be implemented by subclasses.
     */
    get size() {
            throw new Error('Getter size must be implemented by subclasses.');
    }

    /**
     * Checks if an item with the given reference exists within the collection.
     * @abstract
     * @param {string | number | ItemRegistry.Handle | T} ref - The reference to the item to check for.
     * @returns {boolean} True if an item with the reference exists, false otherwise.
     * @throws {Error} Must be implemented by subclasses.
     */
    has(ref) {
        throw new Error('Method has(ref) must be implemented by subclasses.');
    }

    /**
     * Returns a default iterator for the collection.
     * @abstract
     * @returns {Iterator<any>} An iterator for the collection.
     * @throws {Error} Must be implemented by subclasses.
     */
    [Symbol.iterator]() {
        throw new Error('Method [Symbol.iterator]() must be implemented by subclasses.');
    }

}