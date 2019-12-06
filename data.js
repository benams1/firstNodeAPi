const events = require('events');
const moment = require('moment')
const { EVENTS :{ DATA } } = require('./config');
const { MAX_TICKETS } = require ('./config');
const { RESPONSES } = require ('./config');

data = {
    Users: [
        {
            id: 0,
            name: 'Ben',
            isAdmin: true
        },
        {
            id: 1,
            name: 'Dina',
            isAdmin: false
        },
        {
            id: 2,
            name: 'Yossi',
            isAdmin: false
        }
    ],
    resevations: [

        {
            id: 1,
            date:moment("1/12/2019", "DD-MM-YYYY").format( "DD-MM-YYYY"),
            numOfTickets: 1,
            name: 'Nissim',
            status: true,
        }
        ,
        {
            id: 2,
            date: moment("1/12/2019", "DD-MM-YYYY").format( "DD-MM-YYYY"),
            numOfTickets: 2,
            name: 'Max',
            status: false,
        },
        {
            id: 3,
            date: moment("1/12/2019", "DD-MM-YYYY").format( "DD-MM-YYYY"),
            numOfTickets: 2,
            name: 'Yoni',
            status: true,
        }
    ],
    LastReservationId: 3,

};
function dataEvent(event){
    console.log('data access event: '+event);

}
class dataObj extends events{
    constructor(){
        super();
        this.data = data;
        this.on(DATA.UPDATED, dataEvent)
    }

    isUserAdmin(userId){
        let user = this.getUser(userId);
        if(user === null){
            return null;
        }
        return user.isAdmin;
    }

    getUser(userId){
        let user = undefined;
        this.data.Users.forEach((item,index,arr) => {
            if (arr[index].id == userId){
                user = arr[index];
            }
        });
        if(user !== undefined){
            return user;
        }
        return RESPONSES.USER_NOT_EXIST;
    }

    updateReservationName(reservationId, name){
        let resIndex = this.getReservationIndex(reservationId);
        if(resIndex === null){
            return RESPONSES.RESERVATION_NOT_EXIST;
        }
        this.data.resevations[resIndex].name = name;
        return RESPONSES.UPDATED_SUCCESSFULLY;
    }

    updateReservationAmountOfTickets(reservationId, numberOfTickets){
        let resIndex = this.getReservationIndex(reservationId);
        if(resIndex === null)
            return RESPONSES.RESERVATION_NOT_EXIST;

        let numOfTicksAfterChange = this.getNumOfTickets() - this.data.resevations[resIndex].numOfTickets + numberOfTickets;
        if(numberOfTickets > MAX_TICKETS)
            return RESPONSES.CANT_UPDATE_NUMBER_OF_TICKETS;
        this.data.resevations[resIndex].numOfTickets = numberOfTickets;
        return RESPONSES.UPDATED_SUCCESSFULLY;
    }

    addReservation(numOfTickets, name) {
        if (numOfTickets + this.getNumOfTickets() > MAX_TICKETS) {
            return RESPONSES.CANT_ADD_RESERVATION;
        }
        let reservation = {
            id: ++this.data.LastReservationId,
            date: moment().format("DD-MM-YYYY"),
            name: name,
            status: true
        };
        this.data.resevations.push(reservation);
        let respone = RESPONSES.RESERVATION_ADDED_SUCCESSFULLY;
        respone.reservationId = this.data.LastReservationId;
        return respone;
    }

    deleteReservation(reservationId){
        let reservationIndex = this.getReservationIndex(reservationId);
        if(this.data.resevations[reservationIndex] === null){
            return RESPONSES.RESERVATION_NOT_EXIST;
        }
        if(this.data.resevations[reservationIndex].status === false){
            return RESPONSES.RESERVATION_ALREADY_REMOVED;
        }
        this.data.resevations[reservationIndex].status = false;
        return RESPONSES.RESERVATION_REMOVED_SUCCESSFULLY;
    }

    getReservationIndex(reservationId){
        this.data.resevations.forEach((item,index,arr) =>{
            if (arr[index].id == reservationId){
                return index;
            }
        });
        return null;
    }
    deleteAllReservations(){
        this.data.resevations.forEach((item,index,arr) => arr[index].status = false);
        return RESPONSES.ALL_RESERVATION_REMOVED;
    }
    getReservation(reservationId){
        this.data.resevations.forEach((item,index,arr) =>{
            if(arr[index].id == reservationId){
                return arr[index];
            }
        });
        return RESPONSES.RESERVATION_NOT_EXIST;
    }
    getAllReservations(){
        return this.data.resevations;
    }
    getNumOfTickets(){
        let numOfTickets = 0;
        this.data.resevations.forEach((item,index,arr) =>{
            if (arr[index].status === true){
                numOfTickets += arr[index].numOfTickets
            }
        });
        return numOfTickets;
    }
}
module.exports = new dataObj();

