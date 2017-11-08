
var db = require('../../db.js');
var gasolinera = require('../models/gasolinera');

exports.getAll = function (req,res){

    query = 'select * from Gasolineras'

    console.log(query)

    db.get().query(query, function (err, rows) {
        var response = {};
        var data = [];

        if(err){
            response.status = 'ERROR';
            response.message = err;
        }
        else if (rows && rows.length > 0){
            for (var i = 0; i < rows.length; i++) {
                var gasItem = new gasolinera(rows[i].id,
                    rows[i].nombre,
                    rows[i].direccion,
                    rows[i].latitud,
                    rows[i].longitud,
                    rows[i].precio1,
                    rows[i].precio2,
                    rows[i].calidad,
                    rows[i].servicio,
                    rows[i].visitas
                );
                data.push(gasItem);
            }
            response.status = 'SUCCESS';
            response.message = '';
            response.data = data;
        }
        else{
            response.status = 'ERROR';
            response.message = 'No hay registros!';
        }
        res.send(response);
    });
};