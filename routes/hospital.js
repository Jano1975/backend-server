var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var Hospital = require('../models/hospital');


// ====================================
// Obtener todos los hospitales
// ====================================
app.get('/', (req, res) => {
    Hospital.find({}, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No se han podido obtener los hospitales de la base de datos',
                error: err
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospital
        })
    })
})


// ====================================
// Crear nuevo hospital
// ====================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
        var body = req.body;

        var hospital = new Hospital({
            nombre: body.nombre,
            img: body.img,
            usuario: body.usuario
        });

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error guardando el hospital',
                    error: err
                });
            }

            res.status(201).json({
                ok: true,
                hospital: hospitalGuardado,
                usuarioToken: req.usuario
            });
        });
    })
    // ====================================
    // Actualizar hospital
    // ====================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Hospital.findById(id, (err, hospitalEncontrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error buscando hospital',
                error: err
            });
        }
        if (!hospitalEncontrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe',
                error: { message: 'No existe un hospital con ese ID' }
            })
        }
        hospitalEncontrado.nombre = body.nombre;
        hospitalEncontrado.usuario = body.usuario;
        hospitalEncontrado.save((err, hospitalGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el hospital',
                    error: err
                });
            }
            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });

        })


    });
})

// ====================================
// Borrar hospital
// ====================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al actualizar hospital',
                error: err
            });
        }
        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe',
                error: { message: 'No existe un hospital con ese ID' }
            })
        }
        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });
    })

})
module.exports = app;