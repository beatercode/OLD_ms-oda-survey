const express = require('express');
const router = express.Router();
const operation = require('../logic/operation')

router.post('/', async (req, res) => {
    let survey = req.body
    let result = await operation.execute(survey.survey_id)
    res.send(result);
});

module.exports = router;