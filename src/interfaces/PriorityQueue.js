import { Collection } from './Collection.js';

/**
 * Abstract base class defining the contract for a Priority Queue.
 * Any concrete Priority Queue implementation (like PairingHeap, BinaryHeap, etc.)
 * should extend this class and provide concrete implementations for its methods.
 */
export class PriorityQueue extends Collection {
    /**
     * Constructs a new PriorityQueue.
     * Subclasses should call super() in their constructors.
     */
    // constructor() {
    //     // This is an abstract base class, so direct instantiation is not intended.
    //     // You might add a check here to prevent direct instantiation if desired,
    //     // but relying on subclasses to implement methods is common.
    // }

    /**
     * Returns the item with the highest priority (minimum priority value) without removing it.
     * @abstract
     * @returns {{ id: string | number, priority: number, item: any } | null}
     * An object containing the ID, priority, and item of the highest priority element,
     * or null if the queue is empty.
     * @throws {Error} Must be implemented by subclasses.
     */
    peek() {
        throw new Error('Method peek() must be implemented by subclasses.');
    }

    /**
     * Checks if an item with the given unique ID exists within the priority queue.
     * @abstract
     * @param {string | number} id - The unique ID of the item to check for.
     * @returns {boolean} True if an item with the ID exists, false otherwise.
     * @throws {Error} Must be implemented by subclasses.
     */
    contains(id) {
        throw new Error('Method contains(id) must be implemented by subclasses.');
    }

    /**
     * Retrieves the data (ID, priority, item) for an item with the given unique ID without removing it.
     * @abstract
     * @param {string | number} id - The unique ID of the item to retrieve.
     * @returns {{ id: string | number, priority: number, item: any } | null}
     * An object containing the ID, priority, and item, or null if the ID is not found.
     * @throws {Error} Must be implemented by subclasses.
     */
    get(id) {
        throw new Error('Method get(id) must be implemented by subclasses.');
    }

    /**
     * Inserts a new item with its priority and unique ID into the priority queue.
     * @abstract
     * @param {string | number} id - The unique ID of the item.
     * @param {number} priority - The priority value.
     * @param {any} item - The arbitrary data associated with the item.
     * @returns {boolean} Returns true if the insertion was successful.
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
     * @param {string | number} id - The unique ID of the item to update.
     * @param {{ priority?: number, item?: any }} options - Object with update options.
     * @returns {{ before: {id: string|number, priority: number, item: any}, after: {id: string|number, priority: number, item: any}} | false} 
     * Returns an object containing the node's state before and after the update if the update was successful.
     * Returns false if no changes were made.
     * @throws {Error} Throws an error if the ID is not found.
     * @throws {Error} Must be implemented by subclasses.
     */
    update(id, options) {
         throw new Error('Method update(id, options) must be implemented by subclasses.');
    }

    /**
     * Removes an arbitrary item from the queue using its unique ID.
     * @abstract
     * @param {string | number} id - The unique ID of the item to remove.
     * @returns {{ id: string | number, priority: number, item: any } | null}
     * An object containing the ID, priority, and item of the removed element,
     * or null if the ID was not found.
     * @throws {Error} Must be implemented by subclasses.
     */
    remove(id) {
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