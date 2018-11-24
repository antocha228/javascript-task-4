'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;


/**
 * Применяет handlers к студентам, подписавшимся на событие
 * @param {Map} context
 */
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

/**
 * Возвращает список ивентов (на случай, если ивент содержит точку)
 * @param {String} event
 * @returns {[String]}
 */

function getEvents(event) {
    let events = [];
    while (event !== '') {
        events.push(event);
        event = event.substring(0, event.lastIndexOf('.'));
    }

    return events;
}

/**
 * Проверяет, имеет ли ивент из подписок поданный ивент
 * @param {String} eventFromSubscriptions
 * @param {String} eventToFind
 * @returns {Boolean}
 */

function eventMatches(eventFromSubscriptions, eventToFind) {
    const hasDot = eventToFind.includes('.');
    const eventHasNoDots = eventFromSubscriptions === eventToFind ||
        eventFromSubscriptions.startsWith(`${eventToFind}.`) &&
        !hasDot;
    const nameHasDot = eventFromSubscriptions === eventToFind && hasDot;

    return eventHasNoDots || nameHasDot;
}

/**
 * Выставляет начальные значения для ивента в подписках
 * @param {Map} subscriptions
 * @param {String} event
 * @param {Object} context
 */
function setInitialValues(subscriptions, event, context) {
    if (!subscriptions[event]) {
        subscriptions[event] = new Map();
    }
    if (!subscriptions[event].get(context)) {
        subscriptions[event].set(context, []);
    }
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
            setInitialValues(subscriptions, event, context);

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
            for (const eventFromSubscriptions in subscriptions) {
                if (eventMatches(eventFromSubscriptions, event)) {
                    subscriptions[eventFromSubscriptions].delete(context);
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
            events.filter(ev => subscriptions[ev])
                .forEach(ev => handle(subscriptions[ev]));

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
            setInitialValues(subscriptions, event, context);

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
            setInitialValues(subscriptions, event, context);

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
