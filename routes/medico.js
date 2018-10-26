var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var Medico = require('../models/medico');

app.get('/', (req, res) => {
    Medico.find({}, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No se han podido obtener los médicos de la base de datos',
                error: err
            });
        }

        res.status(200).json({
            ok: true,
            medico: medico
        })
    })
})


module.exports = app;