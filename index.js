const http = require('http');
const url = require('url');
var data = require('./data');
const config = require('./config');
const port = process.env.PORT || config.PORT;
const controller = require('./Controller')(data);
const { parse } = require('querystring');

http.createServer((req,res) => {
    let reqBody = '';
    const urlObj = url.parse(req.url, true,false);
    controller.data.printLog(urlObj.path);
    let header = 404, body= null, response = null;
    req.on('data',chunk => {
        reqBody += chunk.toString();
    });
    req.on('end', () =>{
        reqBody = parse(reqBody);
        switch(req.method){
            case 'GET':
                if(urlObj.pathname ==='/admin/getAllReservation'){
                    response = controller.getAllReservations(urlObj.query.user_id,reqBody.apiToken);

                } else if(urlObj.pathname ==='/admin/getLogs'){
                    response = controller.getAllLogs(urlObj.query.user_id,reqBody.apiToken)
                }
                if(response.status !== 0)
                    header = 403;
                else
                    header = 200;//OK
                body = JSON.stringify(response);
                res.writeHeader(header);
                res.end(body);
                break;
            case 'POST':
                if(urlObj.pathname ==='/addReservation'){
                    response = controller.addReservation(reqBody.num_of_tickets, reqBody.name);
                    if(response.status !== 0)
                        header = 404;
                    else
                        header = 201;//created
                }
                body = JSON.stringify(response);
                res.writeHeader(header);
                res.end(body);
                break;
            case 'PUT':
                if(urlObj.pathname ==='/updateReservation/name'){
                    response = controller.updateReservationName(reqBody.reservation_id, reqBody.name);
                }else if(urlObj.pathname ==='/updateReservation/amountOfTickets'){
                    response = controller.updateReservationTicketsAmount(reqBody.reservation_id, reqBody.num_of_tickets);

                }
                if (response.status !== 0)
                    header = 404;
                else
                    header = 200;
                body = JSON.stringify(response);
                res.writeHeader(header);
                res.end(body);
                break;
            case 'DELETE':
                if(urlObj.pathname ==='/deleteReservation'){
                    response = controller.deleteReservation(reqBody.reservation_id);
                }
                else if(urlObj.pathname ==='/admin/deleteAllReservations'){
                    response = controller.deleteAllReservations(reqBody.user_id, reqBody.apiToken);
                }
                if(response.status !== 0)
                    header = 404;
                else
                    header = 200;
                body = JSON.stringify(response);
                res.writeHeader(header);
                res.end(body);
                break;
            default:
                console.log("header:",header,"body:",body);
                res.writeHeader(header);
                res.end(body);
                break;
        }
    });
}).listen(port,() =>{
    controller.data.printLog(`listening on port: ${port}`);
});
