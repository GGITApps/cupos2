const fetch = require('node-fetch');
const fs = require('fs');
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
var http = require("http");


setInterval(function() {
    http.get("http://donde-estan-mis-cupos-uniandes.herokuapp.com/");
}, 300000);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var refresco = {};
var arregloPrint = [];


app.get('/', function (req, res) {
    let nrc = req.query.nrc;
    try {

        let lectura = JSON.parse(fs.readFileSync('cache.json', 'utf8'));

        let buscado = lectura.find(x => x[0] == nrc);
        if (buscado !== undefined) {
            res.send(buscado);
        }
        else {
            res.send(`
            <span style='color:#cc0000;'>Ingresa un NRC válido. (Estamos caídos por un cambio en registro, estamos trabajando para resolverlo)
            </span>
            <p>
            <br>
            <center>
            <img src='https://media.giphy.com/media/mq5y2jHRCAqMo/giphy.gif' style='width:180px;'></center>
            </p>
            `);
        }
    }
    catch (error) {
        res.send(`
        <span style='color:#cc0000;'>Lo sentimos, ocurrió un error recuperando los cupos. 
        <br>
        Intenta de nuevo porfavor!
        </span>
        <p>
        <br>
        <center>
        <img src='https://media.giphy.com/media/KlrMS4vyq5KSY/giphy.gif' style='width:180px;'></center>
        </p>
        `);
    }

});

/**
 * Realiza la escritura del json cacheado con cupos actualizados
 */
function pintarJson() {
    fs.writeFile('cache.json', JSON.stringify(arregloPrint), 'utf8',
        x => {
            if (x) {
                return console.log(err);
            }
        });
    console.log('PINTADO');
}


app.listen(port, function () {
    console.log('App listening on port ' + port);
});

/**
 * llama el API :v
 */
function llamarAPI()
{
    arregloPrint = [];
    refresco = {};

    fetch('https://senecacupos.herokuapp.com/')
        .then(ans => ans.text())
        .then(body => {
            refresco = JSON.parse(body.trim());
            if (refresco === undefined || refresco.records.length == 0 ) {
                console.log("SOMETHING'S WRONG...");
            }
            else{
                refresco.records.forEach(element => {
                    //[nrc,capacidad,disponible]
                    let objeto = [element.nrc, element.limit, element.cupos];
                    arregloPrint.push(objeto);
                });
                pintarJson();
                console.log('DONE');
            }
        })
        .catch(x => console.log(x));
}

llamarAPI();
setInterval(()=>{
    llamarAPI();
}, 80000)
