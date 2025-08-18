import { Collection } from '../interfaces/Collection.js';

/**
 * ItemRegistry provides addressability for data-structure items via either
 * user-supplied ids (string | number) or handles. It implements the Collection
 * interface and can be used as a standalone, specialized data structure.
 *
 * The registry is "handle-centric". A handle is a canonical, stable reference to a
 * registered item. Items and optional IDs can be used to look up this handle.
 *
 * The default iterator for the registry yields [handle, item] pairs, making it
 * behave like a Map<Handle, T>.
 *
 * The Handle class (accessible as ItemRegistry.Handle) provides a safe, immutable
 * reference to a registered item.
 *
 * @template {object} T The type of the item being registered.
 */
export class ItemRegistry extends Collection {
    /**
     * Handle represents a reference to a registered item in this registry.
     * Handles are immutable and provide a safe way to reference items.
     * @template T
     */
    static Handle = class Handle {
        /**
         * @param {string | number | undefined} id
         * @param {T} item
         */
        constructor(id, item) {
            if (item === null || typeof item !== 'object') {
                throw new Error('Handle: item must be an object');
            }
            
            /** @type {string | number | undefined} */
            this.id = id;
            /** @type {T} */
            this.item = item;
            Object.freeze(this);
        }
    };

    /** @type {Map<string | number, ItemRegistry.Handle<T>>} */
    #idToHandle = new Map();
    
    /** @type {Map<T, ItemRegistry.Handle<T>>} */
    #itemToHandle = new Map();

    /**
     * Registers an item and returns its canonical handle.
     * Throws an error if the item is already registered or if the ID is a duplicate.
     *
     * @param {T} item - The internal item object to register. Must be an object.
     * @param {string | number} [id] - Optional explicit id for this item.
     * @returns {ItemRegistry.Handle<T>} The handle for the item.
     * @throws {Error} If the item is already registered or if the ID is duplicate.
     */
    register(item, id) {
        if (item === null || typeof item !== 'object') {
            throw new Error('ItemRegistry: The "item" must be an object.');
        }

        if (this.#itemToHandle.has(item)) {
            throw new Error('ItemRegistry: Item is already registered.');
        }

        if (id !== undefined && this.#idToHandle.has(id)) {
            throw new Error(`ItemRegistry: Duplicate id "${String(id)}"`);
        }

        const handle = new ItemRegistry.Handle(id, item);

        this.#itemToHandle.set(item, handle);
        if (id !== undefined) {
            this.#idToHandle.set(id, handle);
        }

        return handle;
    }
    
    /**
     * Resolves a reference to a handle. Accepts ID, Handle, or Item.
    *
    * @param {string | number | ItemRegistry.Handle<T> | T} ref - The ID, handle, or item.
    * @returns {ItemRegistry.Handle<T> | null} The handle, or null if not found.
    */
    resolveHandle(ref) {
        if (ref === null || ref === undefined) return null;

        if (ref instanceof ItemRegistry.Handle) {
            if (this.#itemToHandle.get(ref.item) !== ref) {
                throw new Error("ItemRegistry: Handle is stale or not associated with this registry.")
            }
            return ref;
        }

        if (typeof ref === 'string' || typeof ref === 'number') {
            return this.#idToHandle.get(ref) ?? null;
        }

        // ref is assumed to be an item object
        return this.#itemToHandle.get(ref) ?? null;
    }

    /**
     * Resolves a reference to an item. Accepts ID, Handle, or Item.
     *
     * @param {string | number | ItemRegistry.Handle<T> | T} ref - The ID, handle, or item.
     * @returns {T | null} The item object, or null if not found.
     */
    resolveItem(ref) {
        const handle = this.resolveHandle(ref);
        return handle?.item ?? null;
    }

    /**
     * Resolves a reference to an ID. Accepts ID, Handle, or Item.
     *
     * @param {string | number | ItemRegistry.Handle<T> | T} ref - The ID, handle, or item.
     * @returns {string | number | undefined} The ID, or undefined if not found.
     */
    resolveId(ref) {
        const handle = this.resolveHandle(ref);
        return handle?.id;
    }

    /**
     * Returns true if a reference can be resolved to an item.
     *
     * @param {string | number | ItemRegistry.Handle<T> | T} ref
     * @returns {boolean}
     */
    has(ref) {
        return this.resolveHandle(ref) !== null;
    }

    /**
     * Unregisters an item by its reference.
     *
     * @param {string | number | ItemRegistry.Handle<T> | T} ref - The ID, handle, or item to unregister.
     */
    unregister(ref) {
        const handle = this.resolveHandle(ref);
        if (handle) {
            if (handle.id !== undefined) {
                this.#idToHandle.delete(handle.id);
            }
            this.#itemToHandle.delete(handle.item);
        }
    }

    /**
     * Gets the current number of elements in the store.
     * @returns {number} The size of the store.
     */
    get size() {
        return this.#itemToHandle.size;
    }

    /**
     * Checks if the store is currently empty.
     * @returns {boolean} True if the store contains no elements, false otherwise.
     */
    get empty() {
        return this.size === 0;
    }

    /**
     * Clears all registered items and their associated data.
     */
    clear() {
        this.#idToHandle.clear();
        this.#itemToHandle.clear();
    }

    /**
     * Returns an iterator for all registered handles.
     * @returns {Iterator<ItemRegistry.Handle<T>>} Iterator for all handles in the store.
     */
    handles() {
        return this.#itemToHandle.values();
    }

    /**
     * Returns an iterator for all registered items.
     * @returns {Iterator<T>} Iterator for all items in the store.
     */
    items() {
        return this.#itemToHandle.keys();
    }

    /**
     * Returns an iterator for all registered IDs that are not undefined.
     * @returns {Iterator<string | number>} Iterator for all defined IDs in the store.
     */
    ids() {
        return this.#idToHandle.keys();
    }

    /**
     * Returns an iterator for [handle, item] pairs for every entry.
     * @returns {Iterator<[ItemRegistry.Handle<T>, T]>}
     */
    *entries() {
        for (const [item, handle] of this.#itemToHandle.entries()) {
            yield [handle, item];
        }
    }

    /**
     * Iterates over the registry entries, calling a function for each one.
     *
     * @param {function(item: T, handle: ItemRegistry.Handle<T>, registry: ItemRegistry<T>): void} callback 
     *   A function to execute for each entry. It receives the item, its handle,
     *   and the registry instance itself.
     */
    forEach(callback) {
        for (const [handle, item] of this.entries()) {
            callback(item, handle, this);
        }
    }

    /**
     * Creates an iterator for all entries ([handle, item]) in the store.
     * @returns {Iterator<[ItemRegistry.Handle<T>, T]>}
     */
    [Symbol.iterator]() {
        return this.entries();
    }
}
