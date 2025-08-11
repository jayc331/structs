/**
 * Represents a single node within the Pairing Heap data structure.
 * Each node holds the actual item data, its priority, a unique identifier,
 * and pointers to maintain the heap's tree structure.
 */
export class PairingHeapNode {
    /**
     * A unique identifier for the item, allowing O(1) lookup.
     * @type {string | number}
     */
    id;

    /**
     * The priority value of the item. Lower values typically indicate higher priority (e.g., timestamp).
     * @type {number}
     */
    priority;

    /**
     * The arbitrary data associated with this node.
     * @type {any}
     */
    item;

    /**
     * Pointer to the first child node in a singly linked list of children.
     * @type {PairingHeapNode | null}
     */
    child = null;

    /**
     * Pointer to the next sibling node in the child list.
     * @type {PairingHeapNode | null}
     */
    sibling = null;

    /**
     * Pointer to the parent node (if this is the first child) or the previous sibling node.
     * @type {PairingHeapNode | null}
     */
    prev = null;

    /**
     * Constructs a new PairingHeapNode.
     * @param {string | number} id - A unique identifier for the item, allowing O(1) lookup.
     * @param {number} priority - The priority value of the item. Lower values typically indicate higher priority.
     * @param {any} item - The arbitrary data associated with this node.
     */
    constructor(id, priority, item) {
        this.id = id;
        this.priority = priority;
        this.item = item;
    }

    /**
     * Returns a JSON serializable representation of the node.
     * Includes only the public properties that represent the node's data.
     * @returns {{ id: string | number, priority: number, item: any }}
     */
    toJSON() {
        return {
            id: this.id,
            priority: this.priority,
            item: this.item
        };
    }
} 