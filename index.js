const http = require('http');
const url = require('url');
var data = require('./data');
const config = require('./config');
const port = process.env.PORT || config.PORT;
const controller = require('./Controller')(data);
const { EVENTS } = require('./config');
const { parse } = require('querystring');

http.createServer((req,res) => {

    const urlObj = url.parse(req.url, true,false);
    console.log(urlObj.path);
    let header = 404, body= null, response = null;

    switch(req.method){
        case 'GET':
            if(urlObj.pathname ==='/admin/getAllReservation'){
                response = controller.getAllReservations(urlObj.query.user_id);
                if(response.status !== 0)
                    header = 403;
                else
                    header = 200;//OK
                body = JSON.stringify(response);
                res.writeHeader(header);
                res.end(body);
            }
            break;
        case 'POST':
            if(urlObj.pathname ==='/addReservation'){
                let reqBody = '';
                req.on('data',chunk => {
                    reqBody += chunk.toString();
                });
                req.on('end', () =>{
                    console.log("body before parse: "+reqBody);
                    reqBody = parse(reqBody);
                    response = controller.addReservation(reqBody.num_of_tickets, reqBody.name);
                    console.log("response: ",response);
                    if(response.status !== 0)
                        header = 200;//OK
                    else
                        header = 201;//created
                    body = JSON.stringify(response);
                    res.writeHeader(header);
                    res.end(body);
                });
            }
            break;
        case 'PUT':

            if(urlObj.pathname ==='/updateReservation/name'){
                response = controller.updateReservationName();
            }else if(urlObj.pathname ==='/updateReservation/amoutOfTickets'){
                response = controller.emit(EVENTS.RESERVATION.UPDATE.TICKET_AMOUNT);
            }
            break;
        case 'DELETE':
            if(urlObj.pathname ==='/deleteReservation'){
                response = controller.emit(EVENTS.RESERVATION.DELETE);
            }
            else if(urlObj.pathname ==='/admin/deleteAllReservations'){
                response = controller.emit(EVENTS.RESERVATION.DELETE_ALL);
            }
            break;
        default:
            console.log("header:",header,"body:",body);
            res.writeHeader(header);
            res.end(body);
            break;
    }
}).listen(port,() =>{
    console.log(`listening on port: ${port}`);
});
