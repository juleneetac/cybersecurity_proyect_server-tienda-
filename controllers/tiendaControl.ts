'use strict';
import crypto = require('crypto');
import { PublicKey } from '../rsa/publicKey';
const bc = require('bigint-conversion');
import { RSA  as classRSA} from "../rsa/rsa";
import * as objectSha from 'object-sha'
const got = require('got');
const axios = require('axios')

let rsa  = new classRSA;
let keyPair;
execrsa()   //ejecuta el generateRandomKeys() al iniciarse el program para tener las claves para todo el rato
let pubKeyBanco;  //necesito la clave pub del cliente de non repudiation
let verificame= [];//esto es la moneda(array de 1€)
let verifiedm = [];//verificame verificado
let cantidad; //esto es la cantidad de dinero(que sera igual al length del array)
    


async function execrsa(){   //genera las keyPair //sigo necesitando mis claves pub y priv
    keyPair= await rsa.generateRandomKeys();
    await pubKeybanco()
    console.log("ok generando mis claves")
  }

async function pubKeybanco() {   //el server(banco) me pasa su pubKey para verificar despues los ID de las monedas
    let response = (await got('http://localhost:3000/banco/publickeyBanco'));
    response = JSON.parse(response.body);
    pubKeyBanco = new PublicKey (bc.hexToBigint(response.e), bc.hexToBigint(response.n)) 
  }


async function postpayverify(req, res){
    try {

      verificame = req.body.verificame //esto es la moneda(array de 1€)
      cantidad = req.body.cantidad  //esto es la cantidad de dinero(que sera igual al length del array)
      console.log(cantidad)
      let y = 0;

      while (y < verificame.length){
              verifiedm[y] = bc.bigintToText(pubKeyBanco.verify(bc.hexToBigint(verificame[y])))  //esto ,lo hara la tienda que es quien verifique la moneda
              y++;
      }
      let resultado = await postbancverify(verifiedm,cantidad)
      console.log(resultado)
      if(resultado == "zi"){
          res.status(200).send({msg: "la moneda es valida"})
      }
      else {
          res.status(501).send({msg: "estafador"})
        }
      }
      catch(err) {
        console.log(err)
        res.status(500).send ({ message: err})
      }
}


async function postbancverify(verificame,cantidad):Promise<string>{
  let resultado
  await axios
  .post('http://localhost:3000/banco/verificaridmoneda', {
    cantidad: cantidad,
    verificame: verificame
  })
  .then(res => {
    //console.log(`statusCode: ${res.statusCode.status}`)
    console.log(res.data)
    resultado= "zi"
    
  })
  .catch(error => {
    console.error(error.response)
    resultado= "no"
    
  })
return resultado



}
//toca hacer un post de este servidor(tienda) al servidor(banco) de la verificacion y la cantidad parab saber cuanto tenemos que ingresarle a la tienda


module.exports = {postpayverify};