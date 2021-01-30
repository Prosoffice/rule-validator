const https = require("https")
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const my_utils = require('./my_utils');
const json_response = my_utils.json_response; // args - (message, status, data)
const checkPayload = my_utils.checkPayload;
const ensureJson = my_utils.ensureJson;
const errorMessages = my_utils.errorMessages;
const ruleValidator = my_utils.ruleValidator;

app.set('json spaces', 3);
app.use(bodyParser.json({strict: false}))
app.use(ensureJson)
app.listen(3000);

const success = "success";
const error = "error";


app.get('/', (req, res) => {
  const data = {
    name: "Prosper Ogbonnaya",
    github: "@prosoffice",
    email: "ogbonnayaprosper1@gmail.com",
    mobile: "08147184953",
    twitter: "@proskelito"
  };
  const message = "My Rule-Validation API";
  console.log(Date.now() + " Ping Received");
  res.status(200).send(json_response({message:message, status:success, data:data}));
});


app.post('/validate-rule', (req, res) => {

  const payload = req.body;
  const payloadValidate = checkPayload(payload);

  //CHECKS FOR REQUIRED FIELDS
  if (payloadValidate.status === false){

    if(payloadValidate.message === errorMessages.fieldAbsent){
      res.status(400).send(json_response({
        message:`${payloadValidate.data} is required.`,
        status: error
      }));
    };


    if (payloadValidate.message === errorMessages.invalidRuleType){
      res.status(400).send(json_response({
        message:'rule should be an object.',
        status: error
      }));
    };


    if(payloadValidate.message === errorMessages.invalidRuleField){
      res.status(400).send(json_response({
        message:`Invalid/absent ${payloadValidate.data}.`,
        status: error
      }));
    };


    if (payloadValidate.message === errorMessages.invalidDataType){
      res.status(400).send(json_response({
        message:'data should be an object/array/string.',
        status: error
      }));
    };

    if (payloadValidate.message === errorMessages.absentSpecifiedField){
      res.status(400).send(json_response({
        message:`field ${payloadValidate.data} is missing from data.`,
        status: error
      }));
    }
  };


  if (payloadValidate.status){

    // RUN THE CORE RULE VALIDATE FUNCTION
    const _validate = ruleValidator(payload);

    if (_validate.status){
      res.status(200).send(json_response({
        message:`field ${payload.rule.field} successfully validated.`,
        status: success,
        data: _validate.data
      }));
    }else if (!_validate.status) {
      res.status(400).send(json_response({
        message:`field ${payload.rule.field} failed validation.`,
        status: error,
        data: _validate.data
      }));
    };

  };

});


setInterval(() => {
console.log("done");
https.get(`https://prosvalidator.glitch.me`);
console.log("request sent")
}, 2800);





















































// give me space
