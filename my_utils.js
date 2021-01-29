const _ = require('lodash')

const json_response = ({message = null, status = null, data = null}) => {
  return {
    "message": message,
    "status": status,
    "data": data
  };
};


const errorMessages = {
  invalidField: "Invalid field",
  invalidType: "Invalid type",
  fieldAbsent: "Field absent",
  invalidRuleType: "Invalid rule type",
  invalidDataField: "Invalid data type",
  invalidRuleField: "Invalid rule field",
  absentSpecifiedField: "Absent specified field"
};


const checkPayload = (dataBody) => {

  // ENSURE REQUIRED FIELDS IN PAYLOAD ARE PRESENT;
  const required = ["rule", "data"];
  const keys = Object.keys(dataBody);
  const diff = _.difference(required, keys);
  if (diff.length !== 0){
    return json_response({status:false, data:diff[0], message:errorMessages.fieldAbsent});
  };


  // ENSURE RULE FIELD IS AN OBJECT
  if (typeof(dataBody.rule) !== 'object'){
    return json_response({status:false, message:errorMessages.invalidRuleType});
  };


  // ENSURE REQUIRED FIELDS IN RULE ARE PRESENT;
  const _required = ["field", "condition", "condition_value"];
  const _keys = Object.keys(dataBody.rule);
  const _diff = _.difference(_required, _keys);
  if (_diff.length !== 0){
    return json_response({status:false, data:_diff[0], message:errorMessages.invalidRuleField});
  };


  // ENSURE DATA FIELD IS AN OBJECT, ARRAY OR STRING
  if (typeof(dataBody.data) !== "object" && Array.isArray(dataBody.data) && typeof(dataBody.data) !== "string"){
    return json_response({status:false, message:errorMessages.invalidDataType});
  }


  // ENSURE FIELD STATED IN RULE IS IN THE SENT DATA;
  const specifiedField = dataBody.rule.field;


  const list = specifiedField.split('.')
  if (list.length === 2){
    if (!dataBody.data[list[0]][list[1]]){
      return json_response({status:false, data:specifiedField, message:errorMessages.absentSpecifiedField});
    };
  }else if (list.length === 1) {
    if (!dataBody.data[specifiedField]){
    return json_response({status:false, data:specifiedField, message:errorMessages.absentSpecifiedField});
  }
 };

  // PAYLOAD VALIDATION SUCCESSFUL;
  return json_response({status:true});
};





const ruleValidator = (dataBody) => {

  const checkForPair = (x) => {
    const splitReturn = x.split(".")
    if (splitReturn.length === 2) {
      return splitReturn
    }
  }

  const rule = dataBody.rule;
  const data = dataBody.data;
  let field = rule.field;

  
  let fieldValue = data[field];
  // ALTERS THE FIELD VALUE IF FIELD IS A KEY-VALUE PAIR
  let isPair = checkForPair(field)
  if (isPair) {
    fieldValue = data[isPair[0]][isPair[1]];
    console.log("Detected a string wrapping a key-value pair. Taken care of :)")
  }

  let condition = rule.condition;
  let conditionValue = rule.condition_value;

  let successData = {
    "validation": {
    "error": false,
    "field": field,
    "field_value": fieldValue,
    "condition": condition,
    "condition_value": conditionValue
   }
  };

  let failedData = {
    "validation": {
    "error": true,
    "field": field,
    "field_value": fieldValue,
    "condition": condition,
    "condition_value": conditionValue
   }
 };

  // Initialise the rules
  const eq = "eq"   //eq: Means the field value should be equal to the condition value
  const neq = "neq" //neq: Means the field value should not be equal to the condition value
  const gt = "gt"   //gt: Means the field value should be greater than the condition value
  const gte = "gte" //gte: Means the field value should be greater than or equal to the condition value
  const contains = "contains" //contains: Means the field value should contain the condition value

  if (condition === eq){
    if (fieldValue === conditionValue){
      return json_response({status:true, data: successData});
    }else{
      return json_response({status:false, data: failedData});
    }
  }else if (condition === neq) {
    if (fieldValue !== conditionValue){
      return json_response({status:true, data: successData});
    }else{
      return json_response({status:false, data: failedData});
    }
  }else if (condition === gt) {
    if (fieldValue > conditionValue){
      return json_response({status:true, data: successData});
    } else {
      return json_response({status:false, data: failedData});
    }
  }else if (condition === gte) {
    if (fieldValue >= conditionValue){

      return json_response({status:true, data: successData});
    } else {
      return json_response({status:false, data: failedData});
    }
  }else if (condition === contains) {
    //  || Object.keys(fieldValue).includes(conditionValue) || Object.values(fieldValue).includes(conditionValue)
    if (fieldValue.includes(conditionValue) || fieldValue[conditionValue]){
      return json_response({status:true, data: successData});
    } else{
      return json_response({status:false, data: failedData});
    }
  }


};





// MIDDLEWARE TO HANDLE INVALID JSON POST REQUEST
const ensureJson = (error, req, res, next) => {
  if (error instanceof SyntaxError){
    console.log("An invalid json was just sent. Taken care of :)")
    res.status(400).send({"message": "Invalid JSON payload passed.","status": "error","data": null});
  } else {
    next();
  };
};

module.exports = {json_response, checkPayload, ensureJson, errorMessages, ruleValidator};
