const express = require('express');
const router = express.Router();
const operation = require('../logic/operation')

router.post('/', async (req, res) => {
    let survey = req.body
    let result = operation.execute(survey.sruvey_id)
    res.send(result);
});

/*

simple post request:

{
    "sruvey_id": Q1
}

example response: 

{
    "embed": {},
    "rows": [{}, {}]
}

*/

module.exports = router;