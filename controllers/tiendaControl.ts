'use strict';
import crypto = require('crypto');
import { PublicKey } from '../rsa/publicKey';
const bc = require('bigint-conversion');
import { RSA  as classRSA} from "../rsa/rsa";
import * as objectSha from 'object-sha'
const got = require('got');

let rsa  = new classRSA;
let keyPair;
execrsa()   //ejecuta el generateRandomKeys() al iniciarse el program para tener las claves para todo el rato
let pubKeyBanco;  //necesito la clave pub del cliente de non repudiation
let verificame;
let bodysendserver;
let verifiedm = [];
let cantidad;


async function execrsa(){   //genera las keyPair //sigo necesitando mis claves pub y priv
    keyPair= await rsa.generateRandomKeys();
    console.log("ok generando mis claves")
  }

async function pubKeybanco(req, res) {   //el server(banco) me pasa su pubKey para verificar despues los ID de las monedas
    let response = (await got('http://localhost:3000/banco/publickeyBanco'));
    response = JSON.parse(response.body);
    pubKeyBanco = new PublicKey (bc.hexToBigint(response.e), bc.hexToBigint(response.n)) 
  }


async function postpayverify(req, res){

    try {
        verificame = req.body.verificame
        cantidad = req.body.cantidad
        let y = 0;
        while (y < verificame.length){
            verifiedm[y] = bc.bigintToText(this.pubKeyBanco.verify(verificame[y]))  //esto ,lo hara la tienda que es quien verifique la moneda
            y++;
      }
        res.status(200).send({msg: "Verificacion por parte de la tienda"})
      }
      catch(err) {
        res.status(500).send ({ message: err})
      }
}

//toca hacer un post de este servidor(tienda) al servidor(banco) de la verificacion y la cantidad parab saber cuanto tenemos que ingresarle a la tienda


module.exports = {postpayverify};