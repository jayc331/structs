import { Collection } from './Collection.js';

/**
 * Abstract base class defining the contract for a Priority Queue.
 * Any concrete Priority Queue implementation (like PairingHeap, BinaryHeap, etc.)
 * should extend this class and provide concrete implementations for its methods.
 */
export class PriorityQueue extends Collection {
    /**
     * The comparator function used to determine the order of elements in the priority queue.
     * It takes two arguments (a, b) and should return:
     * - A negative number if a has higher priority than b (a comes before b).
     * - A positive number if b has higher priority than a (b comes before a).
     * - Zero if a and b have the same priority.
     * @type {function(any, any): number}
     * @private
     */
    #comparator;

    /**
     * Constructs a new PriorityQueue.
     * Subclasses should call super() in their constructors.
     * @param {object} [options] - An options object.
     * @param {function(any, any): number} [options.comparator] - Optional comparator function.
     *   If not provided, a default min-heap comparator (a - b) is used.
     */
    constructor(options = {}) {
        super();

        // Extract comparator from options object
        const { comparator } = options;

        // Default comparator for a min-heap (lower priority value means higher priority)
        this.#comparator = comparator || ((a, b) => a - b);
    }

    /**
     * Returns the comparator function used by this priority queue.
     * @returns {function(any, any): number}
     */
    get comparator() {
        return this.#comparator;
    }

    /**
     * Returns the item with the highest priority (minimum priority value) without removing it.
     * @abstract
     * @returns {ItemRegistry.Handle | null}
     * A handle to the highest priority element, or null if the queue is empty.
     * @throws {Error} Must be implemented by subclasses.
     */
    peek() {
        throw new Error('Method peek() must be implemented by subclasses.');
    }

    

    /**
     * Retrieves the data (ID, priority, item) for an item with the given unique ID without removing it.
     * @abstract
     * @param {string | number | ItemRegistry.Handle | T} ref - The reference to the item to retrieve.
     * @returns {ItemRegistry.Handle | null}
     * A handle to the item, or null if the ID is not found.
     * @throws {Error} Must be implemented by subclasses.
     */
    get(ref) {
        throw new Error('Method get(id) must be implemented by subclasses.');
    }

    /**
     * Inserts a new item with its priority and unique ID into the priority queue.
     * @abstract
     * @param {number} priority - The priority value.
     * @param {any} item - The arbitrary data associated with the item.
     * @param {string | number} [id] - Optional unique ID for the item.
     * @returns {ItemRegistry.Handle} A handle to the newly inserted item.
     * @throws {Error} Throws an error if an item with the same ID already exists or on other insertion failures.
     * @throws {Error} Must be implemented by subclasses.
     */
    insert(id, priority, item) {
        throw new Error('Method insert(id, priority, item) must be implemented by subclasses.');
    }

    /**
     * Removes and returns the item with the highest priority (minimum priority value) from the queue.
     * @abstract
     * @returns {{ id: string | number, priority: number, item: any } | null}
     * An object containing the ID, priority, and item of the removed element,
     * or null if the queue was empty.
     * @throws {Error} Must be implemented by subclasses.
     */
    poll() {
        throw new Error('Method poll() must be implemented by subclasses.');
    }

    /**
     * Updates the priority and optionally the item data of an existing item.
     * @abstract
     * @param {string | number | ItemRegistry.Handle | T} ref - The reference to the item to update.
     * @param {{ priority?: number, item?: any }} options - Object with update options.
     * @returns {{ before: {id: string|number, priority: number, item: any}, after: {id: string|number, priority: number, item: any}} | false} 
     * Returns an object containing the node's state before and after the update if the update was successful.
     * Returns false if no changes were made.
     * @throws {Error} Throws an error if the ID is not found.
     * @throws {Error} Must be implemented by subclasses.
     */
    setPriority(ref, options) {
         throw new Error('Method update(id, options) must be implemented by subclasses.');
    }

    /**
     * Removes an arbitrary item from the queue using its unique ID.
     * @abstract
     * @param {string | number | ItemRegistry.Handle | T} ref - The reference to the item to remove.
     * @returns {{ id: string | number, priority: number, item: any } | null}
     * An object containing the ID, priority, and item of the removed element,
     * or null if the ID was not found.
     * @throws {Error} Must be implemented by subclasses.
     */
    remove(ref) {
        throw new Error('Method remove(id) must be implemented by subclasses.');
    }

    /**
     * Clears the entire priority queue, removing all elements.
     * @abstract
     * @throws {Error} Must be implemented by subclasses.
     */
    clear() {
        throw new Error('Method clear() must be implemented by subclasses.');
    }

    // Note: Internal helper methods like _link, _cut, _combineSiblings
    // are specific to the PairingHeap implementation and are not part
    // of the generic PriorityQueue contract. They should remain in the
    // PairingHeap class.

} 