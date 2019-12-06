const events = require('events');
const { EVENTS } = require('./config');
const { LOG_MESSAGES :{ CONTROLLER_MESSAGES } } = require('./config');
const { RESPONSES } = require('./config');


class Controller extends events{
    constructor(appData){
        super();
        this.data = appData;
        //todo ben remove all
        this.on(EVENTS.RESERVATION.CREATE, this.addReservation);
        this.on(EVENTS.RESERVATION.DELETE, this.deleteReservation);
        this.on(EVENTS.RESERVATION.UPDATE.TICKET_AMOUNT, this.updateReservationTicketsAmount);
        this.on(EVENTS.RESERVATION.UPDATE.NAME, this.updateReservationName);
        this.on(EVENTS.RESERVATION.READ, this.getAllReservations);
        this.on(EVENTS.RESERVATION.DELETE_ALL, this.deleteAllReservations);
    }
    addReservation(numOfTickets, name){
        console.log(CONTROLLER_MESSAGES.ADD_RESERVATION);
        numOfTickets = parseInt(numOfTickets, 10);
        if((typeof numOfTickets !== "number") || (typeof name !== "string")){
            let error = RESPONSES.PARAMETERS_ERROR;
            console.log("addReservation@Controller - error: " + error.message);
            return error;
        }
        let response = this.data.addReservation(numOfTickets, name);
        if(response.status !== 0)
            console.log("addReservation@Controller - error: " + response.message);
        else
            console.log("addReservation@Controller : reservation id " + response.reservationId + " placed successfully");
        return response;
    }

    deleteReservation(reservationId) {
        console.log(CONTROLLER_MESSAGES.DELETE_RESERVATION);
        if(typeof reservationId === "undefined"){
            const error = RESPONSES.PARAMETERS_ERROR;
            console.log("deleteReservation@Controller error: " + error.message);
            return error;
        }
        let response = this.data.deleteReservation(reservationId);
        if (response.status !== 0)
            console.log("deleteReservation@Controller - reservation with id: "+ reservationId + " error: " + response.message);
        else
            console.log("deleteReservation@Controller reservation id: " + reservationId + ": " + response.message);
        return response;
    }

    getAllReservations(userId){
        console.log(CONTROLLER_MESSAGES.GET_ALL_RESERVATIONS);
        userId = parseInt(userId, 10);
        if((typeof userId !== "number") || (userId < 0)){
            const error = RESPONSES.PARAMETERS_ERROR;
            console.log("getAllReservations@Controller error: " + error.message);
            return error;
        }
        if(true !== this.data.isUserAdmin(userId)){
            let response = RESPONSES.FORBIDDEN;
            console.log("getAllReservations@Controller - error: " + response.message);
            return response;
        }
        let response = RESPONSES.GET_ALL_RESERVATIONS;
        response.reservations = this.data.getAllReservations();
        console.log("getAllReservations@Controller : " + response.message);
        return response;
    }

    updateReservationTicketsAmount(reservationId, numberOfTickets){
        console.log(CONTROLLER_MESSAGES.UPDATE_RESERVATION);
        numberOfTickets = parseInt(numberOfTickets, 10);
        if((typeof numberOfTickets !== "number") || (numberOfTickets <= 0)){
            let response = RESPONSES.PARAMETERS_ERROR;
            console.log("updateReservationTicketsAmount@Controller - error: " + response.message);
            return response;
        }
        let response = this.data.updateReservationAmountOfTickets (reservationId, numberOfTickets);
        console.log("updateReservationTicketsAmount@Controller: " + response.message);
        return response;
    }

    updateReservationName(reservationId, name){
        if(typeof name !== "string"){
            let response = RESPONSES.PARAMETERS_ERROR;
            console.log("updateReservationName@Controller - error: " + response.message);
            return response;
        }
        let response = this.data.updateReservationName(reservationId, name);
        console.log("updateReservationName@Controller - error: " + response.message);
        return response
    }

    deleteAllReservations(userId){
        console.log(CONTROLLER_MESSAGES.DELETE_ALL_RESERVATIONS);
        userId = parseInt(userId, 10);
        if((typeof userId !== "number") || (userId < 0)){
            const error = RESPONSES.PARAMETERS_ERROR;
            console.log("deleteAllReservations@Controller error: " + error.message);
            return error;
        }
        if(true !== this.data.isUserAdmin(userId)){
            let response = RESPONSES.FORBIDDEN;
            console.log("deleteAllReservations@Controller - error: " + response.message);
            return response;
        }
        let response = this.data.deleteAllReservations();
        console.log("deleteAllReservations@Controller :" + response.message);
        return response;
    }


}
module.exports = (appData) => {
    return new Controller(appData);
};
