'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

function handle(context) {
    for (let [student, handlers] of context) {
        handlers.forEach(handlerObject => {
            if (handlerObject.times > 0 && handlerObject.count % handlerObject.frequency === 0) {
                handlerObject.handler.call(student);
                handlerObject.times--;
            }
            handlerObject.count++;
        });
    }
}

function getEvents(event) {
    let events = [];
    while (event !== '') {
        events.push(event);
        event = event.substring(0, event.lastIndexOf('.'));
    }

    return events;
}

function nameCheck(ev, event) {
    const hasDot = event.includes('.');
    const nameDoesntHaveDot = ev === event && !hasDot;
    const nameHasDot = ev === event && hasDot;

    return nameDoesntHaveDot || nameHasDot;
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let subscriptions = new Map();

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (!subscriptions[event]) {
                subscriptions[event] = new Map();
            }
            if (!subscriptions[event].get(context)) {
                subscriptions[event].set(context, []);
            }

            subscriptions[event].get(context).push({
                handler: handler,
                count: 0,
                times: Infinity,
                frequency: 1
            });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            for (const ev in subscriptions) {
                if (nameCheck(ev, event)) {
                    subscriptions[ev].delete(context);
                }
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            const events = getEvents(event);
            events.forEach(ev => subscriptions[ev]
                ? handle(subscriptions[ev])
                : undefined
            );

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            if (!subscriptions[event]) {
                subscriptions[event] = new Map();
            }
            if (!subscriptions[event].get(context)) {
                subscriptions[event].set(context, []);
            }

            subscriptions[event].get(context).push({
                handler: handler,
                count: 0,
                times: times,
                frequency: 1
            });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            if (!subscriptions[event]) {
                subscriptions[event] = new Map();
            }
            if (!subscriptions[event].get(context)) {
                subscriptions[event].set(context, []);
            }

            subscriptions[event].get(context).push({
                handler: handler,
                count: 0,
                times: Infinity,
                frequency: frequency
            });

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
