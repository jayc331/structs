export const AsyncStream = (BaseClass) => class AsyncStream extends BaseClass {

    #layerOptions;
    #iterator;
    #resolveWaitForItems;
    #readyBuffer = [];

    constructor(options = {}) {
        super(options);
        this.#layerOptions = this.#default(options.asyncStream);
    }

    #default(asyncStream = {}) {
        asyncStream = { ...asyncStream };
        return asyncStream;
    }
    
    // Makes the queue asynchronously iterable
    [Symbol.asyncIterator]() {
        // Create generator on first use, reuse on subsequent calls
        if (!this.#iterator) {
            this.#iterator = this.#createAsyncGenerator();
        }
        return this.#iterator;
    }

    // Returns a simplified async iterator that only yields the actual items
    values() {
        return this[Symbol.asyncIterator]();
    }

    // Generator that yields items from the ready buffer as they become available
    async *#createAsyncGenerator() {
        while (true) {
            // Yield all currently available items
            while (this.#readyBuffer.length > 0) {
                yield this.#readyBuffer.shift();
            }

            // Wait for new items if buffer is empty
            await new Promise(resolve => {
                this.#resolveWaitForItems = resolve;
            });
        }
    }

    poll() {
        const result = super.poll();

        if (result) {
            this.#readyBuffer.push(result);
        }

        // Unblock generator if it's waiting and we added items
        if (result && this.#resolveWaitForItems) {
            this.#resolveWaitForItems();
            this.#resolveWaitForItems = null;
        }

        return result;
    }
    
}
