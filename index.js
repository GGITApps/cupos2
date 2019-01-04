const fetch = require('node-fetch');
const fs = require('fs');
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
var date = new Date();
fs.writeFile("time.json", JSON.stringify(date), 'utf8',
    x => {
        if (x) {
            return console.log(err);
        }
    })
var materiasTemp = {};
var arregloPrint = [];






app.get('/', function (req, res) {
    var nrc = req.query.nrc;
    date = new Date(
        JSON.parse(fs.readFileSync('time.json', 'utf8'))
    )

    var dateNow = new Date();
    var respuesta;
    if (dateNow.getMinutes() - date.getMinutes() >= 3) {
        fetch('https://senecacupos.herokuapp.com/')
            .then(res => res.json())
            .then(body => {
                materiasTemp = body
                let lectura = JSON.parse(fs.readFileSync('json1.json', 'utf8'));
                materiasTemp.records.forEach(element => {
                    //[nrc,capacidad,disponible]
                    let objectoAnterior = lectura.filter(x => {
                        return element.nrc == x[0]
                    })
                    let objeto = [
                        element.nrc, objectoAnterior[0][1], element.cupos
                    ]
                    arregloPrint.push(objeto);
                })
                pintarJson()
                let cupos = arregloPrint.filter(x => {
                    return x[0] == nrc
                })
                respuesta = cupos[0];
                res.send(respuesta)
            })
            .catch(x => {
                console.log(x)
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
`)
            })

    } else {
        let cupos = JSON.parse(fs.readFileSync('json1.json', 'utf8'));
        
        respuesta = cupos.filter(x => {
            return x[0] == req.query.nrc
        })
        
        if (respuesta == "") {
            res.send(`
            <span style='color:#cc0000;'>Ingresa un NRC Valido
            </span>
            </p>
            <br>
            <center>
            <img src='https://media.giphy.com/media/mq5y2jHRCAqMo/giphy.gif' style='width:400px;'></center>
            <p>
            `)
        } else {
            res.send(respuesta[0])
        }



    }

    //errorHandling


})



function pintarJson() {
    fs.writeFile("json1.json", JSON.stringify(arregloPrint), 'utf8',
        x => {
            if (x) {
                return console.log(err);
            }


        })
}
//cambios
app.listen(port, function () {
    console.log('App listening on port ' + port)
})