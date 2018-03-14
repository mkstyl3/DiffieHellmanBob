let express = require('express');
let router = express.Router();
let bignum = require('bignum');
const crypto = require('crypto');
const request = require('request');
let cors = require('cors');

router.use(cors());

let p;
let g;
let b;
let gb;
let ga;
let kbah;
const four = bignum('4');

/*
 *
 * DiffieHellman Server
 *
 */

/* GET home page. */
router.get('/bob/test', function (req, res, next) {
    res.send('api-test');
});

router.post('/bob/msg', function (req, res, next) {
    decryptMessage(req, res);
});
router.post('/bob/pg', function (req, res, next) {
    buildKbaParams(req, res);
});

function decryptMessage(req, res) {
    try {
        let encryptedMessage = req.body.encryptedMessage;
        let iv = req.body.iv;
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(kbah, 'hex'), Buffer.from(iv, 'hex'));
        let decrypted = decipher.update(encryptedMessage, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        console.log("Decrypted: " + decrypted);
        console.log("Encrypted: " + encryptedMessage);
        res.send("SENT");
    } catch (e) {
        console.log(e);
    }
}

function buildKbaParams(req, res) {
    try {
        p = bignum(req.body.p);
        g = bignum(req.body.g);
        b = four.rand(p); // Rand between 4 and p mod p
        gb = g.powm(b, p);
        res.send("ACK");
    } catch (e) {
        console.log(e);
    }
}

function buildKba(req, res) {
    try {
        ga = bignum(req.body.ga);
        let kba = bignum(ga).powm(b, p);
        kbah = crypto.createHash('sha256').update(kba.toString(16), 'hex').digest('hex');
    } catch (e) {
        console.log(e);
    }
}

router.post('/bob/ga', function (req, res, next) {
    kba = buildKba(req, res);
    res.send({
        gb: gb.toString()
    });
});
module.exports = router;
