var express = require('express');
var router = express.Router();
let cors = require('cors')

router.use(cors());

/* GET users listing. */
router.get('/test', function(req, res, next) {
    res.send('index-test');
});

module.exports = router;
