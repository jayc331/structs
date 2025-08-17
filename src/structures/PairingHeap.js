// Import the PriorityQueue base class
import { PriorityQueue } from '../interfaces/PriorityQueue.js';
import { ItemRegistry } from './ItemRegistry.js';


/**
 * Implements a Priority Queue using a Pairing Heap.
 * This data structure provides efficient O(1) amortized time complexity for insert and decreaseKey operations,
 * and O(log n) time complexity for poll and remove operations.
 * It uses a map for O(1) average time lookup by item ID.
 * This class extends the abstract PriorityQueue base class.
 */
export class PairingHeap extends PriorityQueue {
    static Node = class Node {
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
         * @type {Node | null}
         */
        child = null;
    
        /**
         * Pointer to the next sibling node in the child list.
         * @type {PairingHeap.Node | null}
         */
        sibling = null;
    
        /**
         * Pointer to the parent node (if this is the first child) or the previous sibling node.
         * @type {PairingHeap.Node | null}
         */
        prev = null;
    
        /**
         * Constructs a new PairingHeap.Node.
         * @param {number} priority - The priority value of the item. Lower values typically indicate higher priority.
         * @param {any} item - The arbitrary data associated with this node.
         */
        constructor(priority, item) {
            this.priority = priority;
            this.item = item;
        }
    
        /**
         * Returns a JSON serializable representation of the node.
         * Includes only the public properties that represent the node's data.
         * @returns {{ priority: number, item: any }}
         */
        toJSON() {
            return {
                priority: this.priority,
                item: this.item
            };
        }
    } 

    /**
     * The root node of the heap (highest priority / minimum value).
     * @type {PairingHeap.Node | null}
     * @private
     */
    #root; // Changed to private #field

    /**
     * A registry to store nodes, keyed by their unique ID, for quick access.
     * @type {ItemRegistry<PairingHeap.Node>}
     * @private
     */
    #nodeRegistry;

    /**
     * Constructs an empty PairingHeap.
     */
    constructor() {
        super(); // Initialize the base PriorityQueue.
        this.#root = null;
        // A registry to store nodes, keyed by their unique ID, for quick access.
        this.#nodeRegistry = new ItemRegistry();
    }

    /**
     * Checks if the heap is currently empty.
     * @returns {boolean} True if the heap contains no elements, false otherwise.
     */
    get empty() {
        return this.#root === null; // Accessing private #root
    }

    /**
     * Gets the current number of elements in the heap.
     * Relies on the size of the internal itemMap.
     * Accessed as a property (`heap.size`) rather than a method (`heap.size()`).
     * @returns {number} The size of the heap.
     */
    get size() {
        return this.#nodeRegistry.size;
    }

    /**
     * Returns the item with the highest priority (minimum priority value) without removing it from the heap.
     * @returns {{ id: string | number, priority: number, item: any } | null}
     * An object containing the ID, priority, and item of the root node, or null if the heap is empty.
     */
    peek() {
        if (this.empty) {
            return null;
        }
        // Accessing properties of the private #root node (id, priority, item are public on PairingHeap.Node)
        return this.#nodeRegistry.resolveHandle(this.#root);
    }

     /**
     * Checks if an item with the given reference exists within the heap.
     * Uses the internal map for efficient lookup.
     * @param {string | number | ItemRegistry.Handle<PairingHeap.Node> | PairingHeap.Node} ref - The reference to the item to check for.
     * @returns {boolean} True if an item with the reference exists, false otherwise.
     */
    has(ref) {
        return this.#nodeRegistry.has(ref);
    }

    /**
     * Retrieves the data (ID, priority, item) for a node with the given unique ID without removing it.
     * Uses the internal map for efficient lookup.
     * @param {string | number} id - The unique ID of the item to retrieve.
     * @returns {{ id: string | number, priority: number, item: any } | null}
     * An object containing the ID, priority, and item, or null if the ID is not found.
     */
    get(ref) {
        return this.#nodeRegistry.resolveHandle(ref);
    }

    /**
     * Inserts a new item with its priority and unique ID into the heap.
     * @param {string | number} id - The unique ID of the item.
     * @param {number} priority - The priority value (e.g., timestamp).
     * @param {any} item - The arbitrary data associated with the item.
     * @returns {boolean} Returns true if the insertion was successful.
     * @throws {Error} Throws an error if an item with the same ID already exists in the heap.
     */
    insert(priority, item, id) {
        // Check for duplicate IDs before creating the node or modifying the heap.
        if (this.#nodeRegistry.has(id)) {
            throw new Error(`Insert failed: Item with ID "${id}" already exists.`);
        }

        // Create a new PairingHeap.Node for the item.
        const newNode = new PairingHeap.Node(priority, item);
        // Add the new node to the lookup map.
        const handle = this.#nodeRegistry.register(newNode, id);

        // If the heap is currently empty, the new node becomes the root.
        if (this.empty) {
            this.#root = newNode;
        } else {
            // If the heap is not empty, link the new node with the current root.
            // The #link method handles maintaining the min-heap property.
            this.#root = this.#link(this.#root, newNode);
        }

        // No need to manually increment size here, #nodeMap.size tracks it.
        return handle;
    }

    /**
     * Removes and returns the item with the highest priority (minimum priority value) from the heap.
     * This is the standard poll operation for a priority queue.
     * @returns {{ id: string | number, priority: number, item: any } | null}
     * An object containing the ID, priority, and item of the removed node, or null if the heap was empty.
     */
    poll() {
        // If the heap is empty, there's nothing to extract.
        if (this.empty) {
            return null;
        }

        // The minimum element is always at the root. Store it before removal.
        const minNode = this.#root; // Accessing private #root
        // Prepare the result object containing the data of the node to be removed.
        // Accessing public properties of the PairingHeap.Node instance
        const result = { id: this.#nodeRegistry.resolveId(minNode), priority: minNode.priority, item: minNode.item };

        // Remove the node's ID from the lookup map.
        this.#nodeRegistry.unregister(minNode);

        // If the root has no children, removing the root makes the heap empty.
        // Accessing public #child property of the PairingHeap.Node instance (PairingHeap methods can access #fields of PairingHeap.Node instances)
        if (minNode.child === null) {
            this.#root = null; // Accessing private #root
        } else {
            // If the root has children, combine all its children into a new heap structure.
            // The #combineSiblings method handles merging the child list into a single heap.
            // Calling private #combineSiblings and accessing private #root and public #child of PairingHeap.Node
            this.#root = this.#combineSiblings(minNode.child);
        }

        // No need to manually decrement size here, #nodeMap.size tracks it.

        // Clear the pointers on the removed node to assist garbage collection.
        // Accessing and setting public #fields of the PairingHeap.Node instance
        minNode.child = null;
        minNode.sibling = null;
        minNode.prev = null;

        return result;
    }

    /**
     * Decreases the priority of an existing item identified by its unique ID.
     * This operation is efficient in Pairing Heaps (O(1) amortized).
     * @param {string | number | ItemRegistry.Handle<PairingHeap.Node> | PairingHeap.Node} ref - The reference to the item whose priority should be decreased.
     * @param {number} newPriority - The new priority value. Must be strictly lower than the current priority.
     * @returns {boolean} Returns true if the priority was successfully decreased.
     * @throws {Error} Throws an error if the ID is not found or if the new priority is not lower than the current priority.
     */
    decreaseKey(ref, newPriority) {
        // Find the node using the lookup map.
        const node = this.#nodeRegistry.resolveItem(ref);

        // Throw an error if the node is not found.
        if (!node) {
            throw new Error(`DecreaseKey failed: Item with reference "${ref}" not found.`);
        }

        // Store the old priority for comparison and potential event emission later.
        const oldPriority = node.priority; // Accessing public priority property of PairingHeap.Node

        // Throw an error if the new priority is not strictly lower than the current one.
        if (newPriority >= oldPriority) {
            throw new Error(`DecreaseKey failed: New priority ${newPriority} is not lower than current priority ${oldPriority} for item reference "${ref}".`);
        }

        // Update the node's priority.
        node.priority = newPriority; // Setting public priority property of PairingHeap.Node

        // If the updated node is not the root, it might now have a higher priority (lower value)
        // than its parent. To maintain the heap property, we cut it from its current position
        // and link it with the root.
        if (node !== this.#root) { // Comparing with private #root
            this.#cut(node); // Calling private #cut
            this.#root = this.#link(this.#root, node); // Calling private #link and accessing private #root
        }
        // If the node was already the root, decreasing its priority doesn't violate the heap property,
        // as it remains the minimum element. No structural changes are needed.

        return true; // Indicate successful decrease.
    }

    /**
     * Increases the priority of an existing item identified by its unique ID.
     * This operation is less efficient than decreaseKey, typically involving a remove and insert.
     * @param {string | number | ItemRegistry.Handle<PairingHeap.Node> | PairingHeap.Node} ref - The reference to the item whose priority should be increased.
     * @param {number} newPriority - The new priority value. Must be strictly greater than the current priority.
     * @returns {boolean} Returns true if the priority was successfully increased.
     * @throws {Error} Throws an error if the ID is not found or if the new priority is not greater than the current priority.
     */
    increaseKey(ref, newPriority) {
        const node = this.#nodeRegistry.resolveItem(ref);

        if (!node) {
            throw new Error(`IncreaseKey failed: Item with reference "${ref}" not found.`);
        }

        const oldPriority = node.priority;

        if (newPriority <= oldPriority) {
            throw new Error(`IncreaseKey failed: New priority ${newPriority} is not greater than current priority ${oldPriority} for item reference "${ref}".`);
        }

        // To increase a key, we remove the node and re-insert it with the new priority.
        const { id, item } = this.remove(ref);
        this.insert(newPriority, item, id);

        return true;
    }

    /**
     * Updates the priority and optionally the item data of an existing item.
     * It automatically determines whether to perform a decreaseKey or increaseKey operation
     * based on the comparison of the new priority with the current priority.
     * @param {string | number | ItemRegistry.Handle<PairingHeap.Node> | PairingHeap.Node} ref - The reference to the item to update.
     * @param {{ priority?: number, item?: any }} options - Object with update options.
     * @returns {{ before: {id: string|number, priority: number, item: any}, after: {id: string|number, priority: number, item: any}} | false} 
     * Returns an object containing the node's state before and after the update if the update was successful.
     * Returns false if the new priority is the same as the old one (no change made).
     * @throws {Error} Throws an error if the ID is not found.
     */
    update(ref, options) {
        // Find the node to get its current priority.
        const node = this.#nodeRegistry.resolveItem(ref);

        if (!node) {
            throw new Error(`Update failed: Item with reference "${ref}" not found.`);
        }

        // Destructure options with defaults
        const { priority: newPriority, item: newItem } = options || {};

        // Capture the before state
        const beforeState = node.toJSON();
        
        // If no priority change and no new item, no action is needed.
        if (newPriority === undefined && newItem === undefined) {
            return false; // Indicate no change occurred.
        }

        // If priority is the same and only updating item, just update the item
        if (newPriority === undefined || newPriority === beforeState.priority) {
            // Update the item if provided
            if (newItem !== undefined) {
                node.item = newItem;
                return {
                    before: beforeState,
                    after: node.toJSON()
                };
            }
            return false; // No change if priority is same and no new item
        }

        // Update the item if a new one is provided
        if (newItem !== undefined) {
            node.item = newItem;
        }

        // Determine whether the priority is decreasing or increasing.
        if (newPriority < beforeState.priority) {
            // If decreasing, call the decreaseKey method.
            this.decreaseKey(ref, newPriority);
        } else if (newPriority > beforeState.priority) { 
            // If increasing, call the increaseKey method.
            this.increaseKey(ref, newPriority);
        }

        // Get the updated node after the operation
        const updatedNode = this.#nodeRegistry.resolveItem(ref);
        
        // Capture the after state
        const afterState = updatedNode.toJSON();
        
        // Return an object with the before and after states
        return {
            before: beforeState,
            after: afterState
        };
    }

    

    /**
     * Removes an arbitrary item from the heap using its unique ID.
     * This operation involves cutting the node and combining the resulting sub-heaps.
     * @param {string | number | ItemRegistry.Handle<PairingHeap.Node> | PairingHeap.Node} ref - The reference to the item to remove.
     * @returns {{ id: string | number, priority: number, item: any } | null}
     * An object containing the ID, priority, and item of the removed node, or null if the ID was not found.
     */
    remove(ref) {
        const node = this.#nodeRegistry.resolveItem(ref);

        if (!node) {
            return null; // Item not found
        }

        // Prepare the result before modifying the node or map
        // Accessing public properties of the PairingHeap.Node instance
        const result = { id: this.#nodeRegistry.resolveId(node), priority: node.priority, item: node.item };

        // Remove from the lookup map
        this.#nodeRegistry.unregister(node);

        // If removing the root, handle separately
        if (node === this.#root) { // Comparing with private #root
             // If root has no children, heap becomes empty
            if (node.child === null) { // Accessing public #child property of PairingHeap.Node
                this.#root = null; // Accessing private #root
            } else {
                // Combine children to form new root
                // Calling private #combineSiblings and accessing public #child of PairingHeap.Node
                this.#root = this.#combineSiblings(node.child);
            }
        } else {
            // If removing a non-root node, cut it from its parent/sibling list
            this.#cut(node); // Calling private #cut

            // If the removed node had children, combine them into a sub-heap
            if (node.child) { // Accessing public #child property of PairingHeap.Node
                // Calling private #combineSiblings and accessing public #child of PairingHeap.Node
                const subheap = this.#combineSiblings(node.child);
                // Link the resulting sub-heap with the main heap root
                this.#root = this.#link(this.#root, subheap); // Calling private #link and accessing private #root
            }
            // If node.child was null, cutting it was sufficient, no sub-heap to re-link.
        }

        // No need to manually decrement size here, #nodeMap.size tracks it.

        // Clear pointers on the removed node for garbage collection
        // Setting public #fields of the PairingHeap.Node instance
        node.child = null;
        node.sibling = null;
        node.prev = null;

        return result;
    }

    /**
     * Clears the entire heap, removing all nodes.
     * Resets the root and clears the item map.
     */
    clear() {
        this.#root = null; // Set the root to null.
        this.#nodeRegistry.clear(); // Clear all entries from the lookup map.
        // Note: Individual node objects might still exist if referenced elsewhere,
        // but they are no longer part of the heap structure.
    }


    // --- Internal Pairing Heap Helper Methods ---

    /**
     * Links two heap roots (subtrees) into a single tree, preserving the min-heap property.
     * The root with the higher priority becomes the first child of the root with the lower priority.
     * @private
     * @param {PairingHeap.Node | null} node1 - The root of the first heap.
     * @param {PairingHeap.Node | null} node2 - The root of the second heap.
     * @returns {PairingHeap.Node | null} The root of the new merged heap.
     */
    #link(node1, node2) { // Changed to private #method
        // Handle cases where one or both inputs are null.
        if (!node1) return node2;
        if (!node2) return node1;

        // Determine which node has the lower priority (this will be the new root).
        // Accessing public priority property of PairingHeap.Node instances
        if (node1.priority > node2.priority) {
            [node1, node2] = [node2, node1]; // Array destructuring for swapping.
        }

        // Now, node1 is the root with the lower priority. Link node2 as node1's new first child.

        // 1. Set node2's '#prev' pointer to its new parent, node1.
        // Accessing and setting public #prev property of PairingHeap.Node instance
        node2.prev = node1;

        // 2. Set node2's '#sibling' pointer to node1's current first child.
        // Accessing and setting public #sibling and #child properties of PairingHeap.Node instances
        node2.sibling = node1.child;

        // 3. If node1 already had a child (its old first child), update that child's '#prev' pointer.
        //    The old first child's '#prev' pointer currently points to node1 (its parent).
        //    After node2 is inserted as the new first child, the old first child's previous sibling is now node2.
        // Accessing public #child property of PairingHeap.Node instance
        if (node1.child) {
            // Accessing and setting public #prev property of PairingHeap.Node instance
            node1.child.prev = node2;
        }

        // 4. Set node1's '#child' pointer to point to node2, making node2 the new first child.
        // Accessing and setting public #child property of PairingHeap.Node instance
        node1.child = node2;

        // Return the root of the merged tree (which is node1, the one with lower priority).
        return node1;
    }

    /**
     * Cuts a node from its current position within the heap's tree structure.
     * This involves adjusting the '#child' pointer of its parent or the '#sibling' pointer of its previous sibling.
     * Relies on the '#prev' pointer for efficient O(1) access to the parent/previous sibling.
     * This method is typically used internally before linking the cut node elsewhere.
     * Assumes the node being cut is NOT the root of the main heap.
     * @private
     * @param {PairingHeap.Node} node - The node to cut. Must not be the root of the main heap.
     */
    #cut(node) { // Changed to private #method
        // Safeguard: This method is designed for non-root nodes.
        // Root removal is handled directly in poll/remove.
        // Accessing public #prev property of PairingHeap.Node instance
        if (!node.prev) {
             console.error("Internal Error: Attempted to cut a node with no parent/prev pointer. This node might be the root or already cut.");
             return; // Cannot cut a node that isn't linked in the tree.
        }

        // Determine if the node is the first child of its parent or a subsequent sibling.

        // If the node is the first child of its parent (node.#prev):
        // Accessing public #prev and #child properties of PairingHeap.Node instances
        if (node.prev.child === node) {
            // Update the parent's '#child' pointer to point to this node's sibling, effectively removing this node from the child list.
            // Accessing public #prev and #sibling properties of PairingHeap.Node instances
            node.prev.child = node.sibling;
        }
        // If the node is NOT the first child, it must be a sibling following another node (node.#prev):
        else { // Implicitly, node.#prev.sibling === node here.
             // Update the previous sibling's '#sibling' pointer to point to this node's sibling, bypassing this node.
            // Accessing public #prev and #sibling properties of PairingHeap.Node instances
            node.prev.sibling = node.sibling;
        }

        // If the node being cut has a sibling that follows it, update that sibling's '#prev' pointer.
        // The following sibling's '#prev' pointer currently points to the node being cut.
        // It should now point to the node that comes *before* the cut node (which is node.#prev).
        // Accessing public #sibling property of PairingHeap.Node instance
        if (node.sibling) {
            // Accessing and setting public #prev property of PairingHeap.Node instance
            node.sibling.prev = node.prev;
        }

        // Clear the cut node's connection pointers to isolate it.
        // Setting public #fields of the PairingHeap.Node instance
        node.prev = null;
        node.sibling = null;
    }

    /**
     * Combines a list of sibling trees (which result from cutting a parent's children)
     * into a single tree using the two-pass method of the Pairing Heap.
     * This method is typically used internally during poll or remove operations.
     * @private
     * @param {PairingHeap.Node | null} firstSibling - The head of the singly linked list of sibling nodes (roots of subtrees) to combine.
     * @returns {PairingHeap.Node | null} The root of the single, combined heap.
     */
    #combineSiblings(firstSibling) { // Changed to private #method
        if (!firstSibling) {
            return null; // No siblings to combine
        }

        // Pass 1: Link pairs of siblings from left to right
        // Create a list to store the roots of the combined pairs.
        const pairs = [];
        let current = firstSibling;
        let nextSibling;

        while (current) {
            const node1 = current;
            // Accessing public #sibling property of PairingHeap.Node instance
            nextSibling = current.sibling;

            // If there's a second node in the pair
            if (nextSibling) {
                const node2 = nextSibling;
                // Move the 'current' pointer to the start of the next pair (or null if no more pairs).
                // Accessing public #sibling property of PairingHeap.Node instance
                current = nextSibling.sibling;

                // Crucially, clear the '#prev' and '#sibling' pointers of the nodes being linked.
                // This is crucial to correctly break the old sibling list structure
                // and prepare nodes for the new tree structure formed by #link.
                // Setting public #fields of PairingHeap.Node instances
                node1.prev = null;
                node1.sibling = null;
                node2.prev = null;
                node2.sibling = null;

                // Link the pair (node1 and node2) and add the resulting root to the list of pairs.
                // #link ensures the node with lower priority is the root of the pair.
                // Calling private #link
                pairs.push(this.#link(node1, node2));
            } else {
                // If there's an odd number of nodes, the last node is left unpaired.
                // Clear its pointers and add it as a single-node tree to the pairs list.
                // Setting public #fields of PairingHeap.Node instance
                current.prev = null;
                current.sibling = null;
                pairs.push(current);
                current = null; // End the loop as this was the last node.
            }
        }

        // Pass 2: Link the combined pairs from right to left
        // This pass merges the trees created in Pass 1 into a single final tree.
        // The last element in the 'pairs' array is the starting point for the merge.
        if (pairs.length === 0) {
             return null; // Should not happen if firstSibling was not null, but good safeguard.
        }
         if (pairs.length === 1) {
             return pairs[0]; // Only one tree resulted from Pass 1.
         }

        // Start merging from the second-to-last pair with the last pair.
        // Calling private #link
        let resultRoot = this.#link(pairs[pairs.length - 2], pairs[pairs.length - 1]);

        // Continue merging from right to left.
        // The result of each merge becomes the right operand for the next merge to its left.
        for (let i = pairs.length - 3; i >= 0; i--) {
            // Calling private #link
            resultRoot = this.#link(pairs[i], resultRoot);
        }

        return resultRoot;
    }
}
