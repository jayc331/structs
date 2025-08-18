export const Scheduler = (BaseClass) => class Scheduler extends BaseClass {

    #layerOptions;
    #setTimeout;
    #clearTimeout;
    #now;

    #timer = null;
    #running = false;

    constructor(options = {}) {
        super(options);
        this.#layerOptions = this.#default(options.scheduler);
    }
 
    #default(scheduler = {}) {
        scheduler = { 
            setTimeout: global.setTimeout,
            clearTimeout: global.clearTimeout,
            now: () => Date.now(),
            ...scheduler
        };

        // Ensure timer functions are present and valid
        const timerMethods = ['setTimeout', 'clearTimeout', 'now'];
        for (const method of timerMethods) {
            if (typeof scheduler[method] !== 'function') {
                throw new TypeError(`scheduler constructor: Missing or invalid timer function "${method}".`);
            }
        }
        
        this.#setTimeout = scheduler.setTimeout;
        this.#clearTimeout = scheduler.clearTimeout;
        this.#now = scheduler.now;

        return scheduler;
    }

    
    #clearTimer() {
        if (this.#timer) {
            this.#clearTimeout(this.#timer);
            this.#timer = null;
        }
        return this;
    }

    #setTimer() {
        if (!this.#timer && this.#running && !this.empty) {
            const next = this.peek();
            const delay = next.item.priority - this.#now();
            this.#timer = this.#setTimeout(() => this.#processReadyItems(), delay);
        }
        return this;
    }

    #resetTimer() {
        this.#clearTimer();
        this.#setTimer();
        return this;
    }

    #processReadyItems() {
        this.#clearTimer();
        if (this.#running) {
            const now = this.#now();
            while (!this.empty && this.peek().item.priority <= now) {
                super.poll();
            }
            this.#setTimer();
        }
        return this;
    }
    
    start() {
        this.#running = true;
        this.#setTimer();
        return this;
    }

    stop() {
        this.#running = false;
        this.#clearTimer();
        return this;
    }


    insert(...options) {
        const handle = super.insert(...options);
        this.#resetTimer();
        return handle;
    }

    update(...options) {
        const result = super.update(...options);
        this.#resetTimer();
        return result;
    }

    remove(...options) {
        const result = super.remove(...options);
        this.#resetTimer();
        return result;
    }

    clear(...options) {
        const result = super.clear(...options);
        this.#resetTimer();
        return result;
    }

    poll(...options) {
        const result = super.poll(...options);
        this.#resetTimer();
        return result;
    }

}
