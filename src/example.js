import { PairingHeap } from './structures/PairingHeap.js';
import { EventHandler } from './mixins/EventHandler.js';
import { AsyncStream } from './mixins/AsyncStream.js';
import { Scheduler } from './mixins/Scheduler.js';

/**
 * =============================================================================
 * A Clear Example of a Scheduled Priority Queue
 * =============================================================================
 *
 * This file demonstrates the power of composing functionality using mixins
 * on top of a core data structure.
 *
 * We will build a scheduled queue that:
 * 1. Uses a PairingHeap as the underlying priority queue.
 * 2. Emits events for key actions (insert, poll) using EventHandler.
 * 3. Schedules items to be processed at specific times using Scheduler.
 * 4. Allows for asynchronous consumption of processed items using AsyncStream.
 *
 */

// 1. Compose the class with desired functionality
const ScheduledQueue = PairingHeap.with(
    EventHandler,
    AsyncStream,
    Scheduler
);

// 2. Instantiate the queue
const queue = new ScheduledQueue({ comparator: (a, b) => a - b });

console.log('Scheduled Queue created. Listening for events...');

// 3. Set up event listeners to observe the queue's behavior
// The object passed to the event handler is an ItemRegistry.Handle
// Its structure is: { id: 'your-id', item: <PairingHeap.Node> }
// The PairingHeap.Node then contains the actual data: { priority: 123, item: 'your-data' }
queue.on('insert', (handle) => {
    const scheduledTime = new Date(handle.item.priority).toLocaleTimeString();
    console.log(`[EVENT] ==> Task scheduled: "${handle.item.item}" (ID: ${handle.id}), due at ${scheduledTime}.`);
});

queue.on('poll', (handle) => {
    const pollTime = new Date().toLocaleTimeString();
    console.log(`[EVENT] <== Task polled at ${pollTime}: "${handle.item.item}" (ID: ${handle.id}). It's now in the async buffer.`);
});


// 4. Define an asynchronous consumer
async function runConsumer() {
    console.log('\n--- Consumer started. Waiting for tasks... ---');
    for await (const handle of queue) {
        const processTime = new Date().toLocaleTimeString();
        console.log(`--- Task processed by consumer at ${processTime}: "${handle.item.item}" ---`);
        // Simulate some work
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    console.log('--- Consumer finished. ---');
}

// 5. Main function to set up and run the demo
async function main() {
    // Start the consumer in the background
    runConsumer();

    // Give the consumer a moment to initialize
    await new Promise(resolve => setTimeout(resolve, 10));

    console.log('\n--- Producer starting. Scheduling tasks... ---\n');

    // Schedule some tasks. The scheduler will poll them based on their priority (timestamp).
    const now = Date.now();
    queue.insert('Send welcome email', now + 3000, 'task-3');
    queue.insert('Process payment', now + 1000, 'task-1');
    queue.insert('Update user profile', now + 2000, 'task-2');
    queue.insert('Generate analytics report', now + 4000, 'task-4');

    // Start the scheduler. It will begin polling items when their time is due.
    queue.start();
    console.log('\nQueue started. The scheduler is now running.');
    console.log('Items will be polled according to their schedule and then processed by the consumer.');
}

// Run the main function
main();
