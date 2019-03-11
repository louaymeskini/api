var express = require("express")
var mongoose = require('mongoose')
var Router = express.Router()
var benevoleModel = require('../Models/benevoleModel')
var associationModel = require('../Models/associationModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//test
Router.get("/", function (req, res) {
    res.send("c bn")
})

//liste benevole + associations + evenements + annonces
Router.get("/all", function (req, res) {
    benevoleModel.find({}).populate('associations').populate('evenements').populate('annonces').populate('dons').exec(function (errr, result) {
        res.send(result)
        //.populate({ path: 'associations', populate: { path: 'associations' }})
    })
})
//validateUser

// un seul benevole
Router.get("/:id", function (req,res) {
    benevoleModel.findOne({_id:req.params.id}, function (err,result) {
        if(err)
            res.send({"state":"not ok","msg":"err:"+err});
        else
            res.send(result);
    })
})

//inscription benevole +
Router.post("/ajouter", function (req, res) {
    benevole = new benevoleModel({
        nom: req.body.nom, prenom: req.body.prenom,
        sexe: req.body.sexe, ville: req.body.ville, adresse: req.body.adresse,
        codePostale: req.body.codePostale, tel: req.body.tel,
        email: req.body.email, username: req.body.username, password: req.body.password,
        associations: req.body.associations, evenements: req.body.evenements,
        annonces: req.body.annonces ,dons: req.body.dons
    });
    /*associationModel.findOne({_id: this.benevole.association}).exec((error, associationModel) => {
        associationModel.benevole.push(benevole);
        item.save(()=>{next();});
    associationModel.save();
        });*/
    benevole.save(function (err) {
        if (err) {
            res.send({"state": "not ok", "msg": "err:" + err});
        }
        else {
            res.send({"state": "ok", "msg": "Ajout benevole"});
        }
    })
})

//modification benevole + associations + evenements + annonces
Router.put("/modifier/:id", function (req, res) {
    benevole = benevoleModel.updateOne({_id: req.params.id}, {
        nom: req.body.nom, prenom: req.body.prenom,
        sexe: req.body.sexe, ville: req.body.ville, adresse: req.body.adresse,
        codePostale: req.body.codePostale, tel: req.body.tel,
        email: req.body.email, username: req.body.username, password: req.body.password,
        associations: req.body.associations, evenements: req.body.evenements,
        annonces: req.body.annonces}, function (err) {
        if (err)
            res.send({"state": "not ok", "msg": "err:" + err});
        else
            res.send({"state": "ok", "msg": "update:"});
    })

    /*associationModel.findOne({_id: this.benevole.association}).exec((error, associationModel) => {
        associationModel.benevole.push(benevole);
    //item.save(()=>{next();});
    associationModel.save();
});*/

})

//mise a jour de l'association du benevole GRRRRR
Router.patch("/modifier/association/:id", function (req,res) {
      benevoleModel.updateOne({_id: req.params.id}, {
        nom: req.body.nom, prenom: req.body.prenom,
        sexe: req.body.sexe, ville: req.body.ville, adresse: req.body.adresse,
        codePostale: req.body.codePostale, tel: req.body.tel,
        email: req.body.email, username: req.body.username, password: req.body.password,
        associations: req.body.associations, evenements: req.body.evenements,
        annonces: req.body.annonces}, function (err) {
        if(err)
            res.send({"state":"not ok","msg":"err:"+err});
        else
            res.send({"state":"ok","msg":"update association du benevole:"});
    })

})

//supprimer benevole
Router.delete("/supprimer/:id", function (req, res) {
    benevoleModel.deleteOne({_id: req.params.id}, function (err) {
        if (err) {
            res.send({"state": "non", "msg": "err:" + err});
        }
        else {
            res.send({"state": "ok", "msg": "supprimer association:"});
        }
    })
})

//authentification benevole
Router.post("/auth", function (req, res) {
    benevoleModel.findOne({$or: [{email: req.body.email}, {username: req.body.username}]}, function (err, userInfo) {
        try {
            if (err) {
                next(err);
            }
            else {
                if (bcrypt.compareSync(req.body.password, userInfo.password)) {
                    const token = jwt.sign({id: userInfo._id}, req.app.get('secretKey'), {expiresIn: '1h'});
                    res.json({status: "success", message: "user found!!!", data: {user: userInfo, token: token}});
                }
                else {
                    res.json({status: "error", message: "Invalid email/password!!!", data: null});
                }
            }
        }
        catch (err) {
            res.json({status: "error", message: "Invalid email/password!!!", data: null});
        }
    })
})

//valider l'accées pour certain interfaces
function validateUser(req, res, next) {
    jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function (err, decoded) {
        if (err) {
            res.json({status: "error", message: err.message, data: null});
        } else {
            // add user id to request
            req.body.userId = decoded.id;
            next();
        }
    });
}


module.exports = Router;