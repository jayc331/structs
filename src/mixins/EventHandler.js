import EventEmitter from 'events';

export const EventHandler = (BaseClass) => class EventHandler extends BaseClass {
    #layerOptions;
    #eventEmitter;

    constructor(options = {}) {
        super(options);
        this.#layerOptions = this.#default(options.eventHandler);
        this.#eventEmitter = this.#layerOptions.eventEmitter;
    }

    #default(eventHandler = {}) {
        eventHandler = {
            eventEmitter: new EventEmitter(),
            ...eventHandler
        };

        const emitterMethods = ['on', 'off', 'emit'];
        for (const method of emitterMethods) {
            if (typeof eventHandler.eventEmitter[method] !== "function") {
                throw new TypeError(`Invalid "eventHandler" option: Missing function "${method}".`);
            }
        }
        
        return eventHandler;
    }


    emit(eventName, ...args) {
        this.#eventEmitter.emit(eventName, ...args);
        if (eventName !== 'all') this.#eventEmitter.emit('all', eventName, ...args);
    }

    on(...options) {
        this.#eventEmitter.on(...options);
        return this;
    }

    off(...options) {
        this.#eventEmitter.off(...options);
        return this;
    }

    once(...options) {
        this.#eventEmitter.once(...options);
        return this;
    }


    insert(...options) {
        const result = super.insert(...options);
        if (result) this.emit('insert', result);
        return result;
    }
    
    update(...options) {
        const result = super.update(...options);
        if (result) this.emit('update', result);
        return result;
    }

    remove(...options) {
        const result = super.remove(...options);    
        if (result) this.emit('remove', result);
        return result;
    }

    clear(...options) {
        const result = super.clear(...options);
        if (result) this.emit('clear', result);
        return result;
    }

    poll(...options) {
        const result = super.poll(...options);
        if (result) this.emit('poll', result);
        return result;
    }
    
    peek(...options) {
        const result = super.peek(...options);
        if (result) this.emit('peek', result);
        return result;
    }
    
    get(...options) {
        const result = super.get(...options);
        if (result) this.emit('get', result);
        return result;
    }
    
    has(...options) {
        const result = super.has(...options);
        if (result) this.emit('has', result);
        return result;
    }
    
};