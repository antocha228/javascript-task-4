'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = false;

function handle(context) {
    for (let [student, handlers] of context) {
        handlers.forEach(handler => handler.call(student));
    }
}

function getEvents(event) {
    let events = event.split('.');

    if (events[1]) {
        events[1] = `${events[0]}.${events[1]}`;
        events.reverse();
    }

    return events;
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let subscriptions = new Map();

    function nameCheck(ev, event) {
        const dotCheck = event.includes('.');
        const nameDoesntHaveDotCase = (ev === event || ev.startsWith(`${event}.`)) && !dotCheck;
        const nameHaveDotCase = ev === event && dotCheck;

        return nameDoesntHaveDotCase || nameHaveDotCase;
    }


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
            subscriptions[event].get(context).push(handler);

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
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
