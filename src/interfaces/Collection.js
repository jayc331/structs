export class Collection {

    /**
     * Creates a new class by composing mixins with this base class
     * @param {...Function} mixins - Mixin functions to apply to this class
     * @returns {typeof PriorityQueue} A new class with the mixins applied
     */
    static with(...mixins) {
        return mixins.reduce((base, mixin) => mixin(base), this);
    }

    /**
     * Checks if the priority queue is currently empty.
     * @abstract
     * @returns {boolean} True if the queue contains no elements, false otherwise.
     * @throws {Error} Must be implemented by subclasses.
     */
    get empty() {
        throw new Error('Getter empty must be implemented by subclasses.');
    }

    /**
     * Gets the current number of elements in the priority queue.
     * @abstract
     * @returns {number} The size of the queue.
     * @throws {Error} Must be implemented by subclasses.
     */
    get size() {
            throw new Error('Getter size must be implemented by subclasses.');
    }

}