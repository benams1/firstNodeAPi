const events = require('events');
const { EVENTS } = require('./config');
const { LOG_MESSAGES :{ CONTROLLER_MESSAGES } } = require('./config');
const { RESPONSES } = require('./config');


class Controller extends events{
    constructor(appData){
        super();
        this.data = appData;
        this.on(EVENTS.LOGS,this.data.printLog);
    }
    addReservation(numOfTickets, name){
        this.emit(EVENTS.LOGS,CONTROLLER_MESSAGES.ADD_RESERVATION);
        numOfTickets = parseInt(numOfTickets, 10);
        if((isNaN(numOfTickets)) || (name === undefined) || (typeof numOfTickets !== "number") || (typeof name !== "string")){
            let error = RESPONSES.PARAMETERS_ERROR;
            this.emit(EVENTS.LOGS,"addReservation@Controller - error: " + error.message);
            return error;
        }
        let response = this.data.addReservation(numOfTickets, name);
        if(response.status !== 0)
            this.emit(EVENTS.LOGS,"addReservation@Controller - error: " + response.message);
        else
            this.emit(EVENTS.LOGS,"addReservation@Controller : reservation id " + response.reservationId + " placed successfully");
        return response;
    }

    deleteReservation(reservationId) {
        this.emit(EVENTS.LOGS,CONTROLLER_MESSAGES.DELETE_RESERVATION);
        reservationId = parseInt(reservationId);
        if(reservationId === undefined ||  isNaN(reservationId)){
            const error = RESPONSES.PARAMETERS_ERROR;
            this.emit(EVENTS.LOGS,"deleteReservation@Controller error: " + error.message);
            return error;
        }
        let response = this.data.deleteReservation(reservationId);
        if (response.status !== 0)
            this.emit(EVENTS.LOGS,"deleteReservation@Controller - reservation with id: "+ reservationId + " error: " + response.message);
        else
            this.emit(EVENTS.LOGS,"deleteReservation@Controller reservation id: " + reservationId + ": " + response.message);
        return response;
    }

    getAllReservations(userId, apiToken){
        this.emit(EVENTS.LOGS,CONTROLLER_MESSAGES.GET_ALL_RESERVATIONS);
        userId = parseInt(userId, 10);
        if((isNaN(userId)) || (userId < 0)){
            const error = RESPONSES.PARAMETERS_ERROR;
            this.emit(EVENTS.LOGS,"getAllReservations@Controller error: " + error.message);
            return error;
        }
        if(true !== this.data.isUserAdmin(userId, apiToken)){
            let response = RESPONSES.FORBIDDEN;
            this.emit(EVENTS.LOGS,"getAllReservations@Controller - error: " + response.message);
            return response;
        }
        let response = RESPONSES.GET_ALL_RESERVATIONS;
        response.reservations = this.data.getAllReservations();
        this.emit(EVENTS.LOGS,"getAllReservations@Controller : " + response.message);
        return response;
    }

    updateReservationTicketsAmount(reservationId, numberOfTickets){
        this.emit(EVENTS.LOGS,CONTROLLER_MESSAGES.UPDATE_RESERVATION);
        numberOfTickets = parseInt(numberOfTickets, 10);
        if((isNaN(numberOfTickets)) || (numberOfTickets <= 0) || (reservationId === undefined)){
            let response = RESPONSES.PARAMETERS_ERROR;
            this.emit(EVENTS.LOGS,"updateReservationTicketsAmount@Controller - error: " + response.message);
            return response;
        }
        let response = this.data.updateReservationAmountOfTickets (reservationId, numberOfTickets);
        this.emit(EVENTS.LOGS,"updateReservationTicketsAmount@Controller: " + response.message);
        return response;
    }

    updateReservationName(reservationId, name){
        if(typeof name !== "string"){
            let response = RESPONSES.PARAMETERS_ERROR;
            this.emit(EVENTS.LOGS,"updateReservationName@Controller - error: " + response.message);
            return response;
        }
        let response = this.data.updateReservationName(reservationId, name);
        this.emit(EVENTS.LOGS,"updateReservationName@Controller - error: " + response.message);
        return response;
    }

    deleteAllReservations(userId, apiToken){
        this.emit(EVENTS.LOGS,CONTROLLER_MESSAGES.DELETE_ALL_RESERVATIONS);
        userId = parseInt(userId, 10);
        if((isNaN(userId)) || (userId < 0)){
            const error = RESPONSES.PARAMETERS_ERROR;
            this.emit(EVENTS.LOGS,"deleteAllReservations@Controller error: " + error.message);
            return error;
        }
        if(true !== this.data.isUserAdmin(userId, apiToken)){
            let response = RESPONSES.FORBIDDEN;
            this.emit(EVENTS.LOGS,"deleteAllReservations@Controller - error: " + response.message);
            return response;
        }
        let response = this.data.deleteAllReservations();
        this.emit(EVENTS.LOGS,"deleteAllReservations@Controller :" + response.message);
        return response;
    }

    getAllLogs(userId, apiToken){
        this.emit(EVENTS.LOGS,CONTROLLER_MESSAGES.GET_ALL_RESERVATIONS);
        userId = parseInt(userId, 10);
        if((isNaN(userId)) || (userId < 0)){
            const error = RESPONSES.PARAMETERS_ERROR;
            this.emit(EVENTS.LOGS,"getAllLogs@Controller error: " + error.message);
            return error;
        }
        if(true !== this.data.isUserAdmin(userId, apiToken)){
            let response = RESPONSES.FORBIDDEN;
            this.emit(EVENTS.LOGS,"getAllLogs@Controller - error: " + response.message);
            return response;
        }
        let response = RESPONSES.LOGS;
        response.logs = this.data.getAllLogs();
        return response;
    }

}
module.exports = (appData) => {
    return new Controller(appData);
};
