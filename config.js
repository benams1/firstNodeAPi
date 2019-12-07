module.exports = {
    PORT: 3000,
    EVENTS:{
        DATA :{
            UPDATED: 'dataUpdatedEvent'
        },
        LOGS: "log",
    },
    LOG_MESSAGES:{
        CONTROLLER_MESSAGES:{
            ADD_RESERVATION: "Controller: add reservation request",
            DELETE_RESERVATION: "Controller: delete reservation request",
            GET_ALL_RESERVATIONS: "Controller: get all reservations request",
            UPDATE_RESERVATION: "Controller: update reservation request",
            DELETE_ALL_RESERVATIONS: "Controller: delete all reservations request",
        },
    },
    MAX_TICKETS: 10,
    RESPONSES:{
        CANT_ADD_RESERVATION: {
            status: -1,
            message:"your reservation can't be placed because there is not enough tickets"
        },
        RESERVATION_ADDED_SUCCESSFULLY: {
            status: 0,
            message: "your reservation have been placed successfully",
            reservationId: undefined
        },
        RESERVATION_ALREADY_REMOVED: {
            status: -1,
            message: "reservation already removed"
        },
        RESERVATION_REMOVED_SUCCESSFULLY: {
            status: 0,
            message: "reservation removed successfully"
        },
        ALL_RESERVATION_REMOVED: {
            status: 0,
            message: "all reservations removed successfully"
        },
        RESERVATION_NOT_EXIST: {
            status: -1,
            message: "reservation doesn't exist"
        },
        USER_NOT_EXIST: {
            status: -1,
            message: "user doesn't exist"
        },
        FORBIDDEN: {
            status: -1,
            message: "forbidden error"
        },
        GET_ALL_RESERVATIONS: {
            status: 0,
            message: "reservations pulled successfully",
            reservations: undefined
        },
        PARAMETERS_ERROR: {
            status: -1,
            message: "all parameters must be with the right values"
        },
        CANT_UPDATE_NUMBER_OF_TICKETS: {
            status: -1,
            message: "your reservation's amount of tickets can't be placed because there is not enough tickets"
        },
        UPDATED_SUCCESSFULLY:{
            status: 0,
            message: "reservation updated successfully"
        },
        NOT_UPDATED_SAME_AMOUNT:{
            status: -1,
            message: "your reservation's amount of tickets can't be updated because you can't update to the same amount"
        },
        CANT_UPDATE_DELETED_RESERVATION:{
            status: -1,
            message: "can't update deleted reservation"
        },
        LOGS:{
            status: 0,
            message: "OK",
            logs: undefined
        }
    },
};
