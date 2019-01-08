const fetch = require('node-fetch');
const fs = require('fs');
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
var http = require("http");




setInterval(function() {
    http.get("https://donde-estan-mis-cupos-uniandes.herokuapp.com/");
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

        let lectura = JSON.parse(fs.readFileSync('json1.json', 'utf8'));

        let buscado = lectura.find(x => x[0] == nrc);
        if (buscado !== undefined) {
            res.send(buscado);
        }
        else {
            res.send(`
            <span style='color:#cc0000;'>Ingresa un NRC Valido
            </span>
            </p>
            <br>
            <center>
            <img src='https://media.giphy.com/media/mq5y2jHRCAqMo/giphy.gif' style='width:400px;'></center>
            <p>
            `);
        }
    }
    catch (error) {
        res.send(`
        <span style='color:#cc0000;'>Lo sentimos ocurrio un error recuperando los cupos. 
        <br>
        Intenta de nuevo porfavor!
        </span>
        </p>
        <br>
        <center>
        <img src='https://media.giphy.com/media/KlrMS4vyq5KSY/giphy.gif' style='width:400px;'></center>
        <p>
        `);
    }

});

/**
 * Realiza la escritura del json cacheado con cupos actualizados
 */
function pintarJson() {
    fs.writeFile("json1.json", JSON.stringify(arregloPrint), 'utf8',
        x => {
            if (x) {
                return console.log(err);
            }
        });
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
    refresco={};
    let misHeaders = { 'Referer': 'https://registroapps.uniandes.edu.co/oferta_cursos/index.php' };

    fetch('https://registroapps.uniandes.edu.co/oferta_cursos/api/get_courses.php?term=201910&ptrm=1&campus=&attr=&attrs=', { headers: misHeaders })
        .then(ans => ans.json())
        .then(body => {
            refresco = body;
            refresco.records.forEach(element => {

                //[nrc,capacidad,disponible]
                let objeto = [element.nrc, element.limit, element.empty];
                arregloPrint.push(objeto);
            });
            fetch('https://registroapps.uniandes.edu.co/oferta_cursos/api/get_courses.php?term=201910&ptrm=8A&campus=&attr=&attrs=', { headers: misHeaders })
                .then(ans => ans.json())
                .then(body => {
                    refresco = body;
                    refresco.records.forEach(element => {

                        //[nrc,capacidad,disponible]
                        let objeto = [element.nrc, element.limit, element.empty];
                        arregloPrint.push(objeto);
                    });
                    fetch('https://registroapps.uniandes.edu.co/oferta_cursos/api/get_courses.php?term=201910&ptrm=8B&campus=&attr=&attrs=', { headers: misHeaders })
                        .then(ans => ans.json())
                        .then(body => {
                            refresco = body;
                            refresco.records.forEach(element => {

                                //[nrc,capacidad,disponible]
                                let objeto = [element.nrc, element.limit, element.empty];
                                arregloPrint.push(objeto);
                            });
                            pintarJson();
                            llamarAPI();
                            console.log("acabé")
                        })
                        .catch(console.log());
                })
                .catch(console.log());
        })
        .catch(console.log());
}
llamarAPI();
