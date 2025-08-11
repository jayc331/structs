import { PairingHeap, EventHandler, AsyncStream, Scheduler } from "./index.js";

const queue = new (PairingHeap.with(EventHandler, AsyncStream, Scheduler))()


// queue.insert(id, priority, item)
queue.insert('channel id 1', Date.now() + 3_000, 'something')
queue.insert('channel id 2', Date.now() + 4_000, 'something')
queue.insert('channel id 3', Date.now() + 5_000, 'something')
queue.start(); 


const main = async () => {
    // queue.on('all', console.debug)

    queue.on('poll', (item) => {
        console.log('[!] item is ready')
    })

    // Consumer 1: Using for-await
    async function consumer1() {
        for await (const item of queue) {
            console.log('Consumer 1:', item);
            console.log('Consumer 1: waiting for 3 seconds')
            await new Promise(resolve => setTimeout(resolve, 3_000));
        }
    }

    // Consumer 2: Using for await
    // async function consumer2() {
    //     for await (const item of queue) {
    //         console.log('Consumer 2:', item);
    //     }
    // }

    // why does the task queue actually distribute the items

    consumer1();
    // consumer2();

    //  item_1_expires: 2:30, 
    //  process_queue: 2:37
    //
    //  loop:
    //      waits base time +- random duration
    //      process_queue
    //
    //   item_1   processed_here                
    //     |        |                         
    //     v        v                         
    // |  window 1  |window 2|   window 3  | window 4 |  window 5 |
    // each window duration is base duration +- random duration

}

main();

    // for await (const item of queue.values()) {
    //     console.log(item)
    // }
    // const now = Date.now();
    // const queue = new (PairingHeap.with(EventHandler, AsyncStream, Scheduler))();
    // // queue.on("all", (event, ...args) => console.debug(`[ALL] [${event}]`));
    // // queue.on("poll", (...args) => console.log(`[POLL]`, ...args));
    // // console.log('inserting item 1')
    // queue.insert(1, now + 5_000, 'id 1');
    // queue.insert(2, now + 10_000, 'id 2');
    // queue.insert(3, now + 15_000, 'id 3');
    // queue.start();

// ChannelManager() {
//     clientInformation.on('channel update', (channel) => {
//         queue.update(channel_id, channel.rateLiit()
//     })
// client.on(channel remove, (channel) => queue.remove(chadjwhajdw))
// client.on(channel create, (channel) => )
// }

// original computational expeisnvie
// item_1_expires: 2:30,
// item_1_expiry_set_at_end_boundary: 2:37
// item_1_processed: 2:37
//     
//   item_1  set_here                
//     |      |                         |
//     v      v                         v
// | window 1 | window 2 | window 3 | window 4 | window 5 |
// each window duration is base duration +- random duration



// queue.on('poll', (itme) => {
//     channel.send()
// })


// const queue = new PairingHeap.with(Scheduler, EventHandler, AsyncStream);
// queue.on("all", (event, ...args) => console.debug(`[ALL] [${event}]`));
// queue.start();

// const queue = new (PairingHeap.with(EventHandler, AsyncStream, Scheduler))();
// queue.start();

// // Producer: Insert items with different priorities
// queue.insert('msg1', Date.now() + 1000, 'Hello');
// queue.insert('msg2', Date.now() + 2000, 'World');
// queue.insert('msg3', Date.now() + 3000, '!');




// Both consumers will see the same items in the same order because:
// 1. Single timer ensures items are processed in order
// 2. Single iterator ensures both consumers get the same items
// 3. The ready buffer is shared between both consumers