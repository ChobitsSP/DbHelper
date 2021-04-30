import _ from "lodash";

function detectMultiArrayTypes(value, valueType = []) {
  if (_.isArray(value)) {
    if (value.length === 0) {
      valueType.push("any[];");
    }
    else if (_.isArray(value[0])) {
      for (var index = 0, length_1 = value.length; index < length_1; index++) {
        var element = value[index];
        var valueTypeResult = detectMultiArrayTypes(element, valueType);
        valueType.concat(valueTypeResult);
      }
    }
    else if (_.every(value, _.isString)) {
      valueType.push("string[];");
    }
    else if (_.every(value, _.isNumber)) {
      valueType.push("number[];");
    }
    else if (_.every(value, _.isBoolean)) {
      valueType.push("boolean[];");
    }
    else {
      valueType.push("any[];");
    }
  }
  return valueType;
};
function isMultiArray(arrayTypes) {
  return arrayTypes.length > 1;
}

function isAllEqual(array) {
  return _.every(array.slice(1), _.partial(_.isEqual, array[0]));
}

function getMultiArrayBrackets(content) {
  var jsonString = JSON.stringify(content);
  var brackets = "";
  for (var index = 0, length_2 = jsonString.length; index < length_2; index++) {
    var element = jsonString[index];
    if (element === "[") {
      brackets = brackets + "[]";
    }
    else {
      index = length_2;
    }
  }
  return brackets;
};

function formatCharsToTypeScript(jsonContent, objectName: string, optionalKeys: string[]) {
  var result = JSON.stringify(jsonContent, null, "\t")
    .replace(new RegExp("\"", "g"), "")
    .replace(new RegExp(",", "g"), "");
  var allKeys = _.keys(jsonContent);
  for (var index = 0, length_3 = allKeys.length; index < length_3; index++) {
    var key = allKeys[index];
    if (_.some(optionalKeys, t => t === key)) {
      result = result.replace(new RegExp(key + ":", "g"), key + "?:");
    }
    else {
      result = result.replace(new RegExp(key + ":", "g"), key + ":");
    }
  }
  objectName = removeMajority(objectName);
  return "export interface " + objectName + " " + result;
};

function removeMajority(objectName: string) {
  if (objectName.toUpperCase().endsWith("IES")) {
    return objectName.substring(0, objectName.length - 3) + "y";
  }
  else if (objectName.toUpperCase().endsWith("S")) {
    return objectName.substring(0, objectName.length - 1);
  }
  return objectName;
};

function toUpperFirstLetter(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function toLowerFirstLetter(text) {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function isJson(stringContent) {
  try {
    JSON.parse(stringContent);
  }
  catch (e) {
    return false;
  }
  return true;
}

function convertObjectToTsInterfaces(jsonContent, objectName = "RootObject") {
  var optionalKeys: string[] = [];
  var objectResult = [];
  for (var key in jsonContent) {
    var value = jsonContent[key];
    if (_.isObject(value) && !_.isArray(value)) {
      var childObjectName = toUpperFirstLetter(key);
      objectResult.push(convertObjectToTsInterfaces(value, childObjectName));
      jsonContent[key] = removeMajority(childObjectName) + ";";
    }
    else if (_.isArray(value)) {
      var arrayTypes = detectMultiArrayTypes(value);
      if (isMultiArray(arrayTypes)) {
        var multiArrayBrackets = getMultiArrayBrackets(value);
        if (isAllEqual(arrayTypes)) {
          jsonContent[key] = arrayTypes[0].replace("[]", multiArrayBrackets);
        }
        else {
          jsonContent[key] = "any" + multiArrayBrackets + ";";
        }
      }
      else if (value.length > 0 && _.isObject(value[0])) {
        var childObjectName = toUpperFirstLetter(key);
        objectResult.push(convertObjectToTsInterfaces(value[0], childObjectName));
        jsonContent[key] = removeMajority(childObjectName) + "[];";
      }
      else {
        jsonContent[key] = arrayTypes[0];
      }
    }
    else if (_.isDate(value)) {
      jsonContent[key] = "Date;";
    }
    else if (_.isString(value)) {
      jsonContent[key] = "string;";
    }
    else if (_.isBoolean(value)) {
      jsonContent[key] = "boolean;";
    }
    else if (_.isNumber(value)) {
      jsonContent[key] = "number;";
    }
    else {
      jsonContent[key] = "any;";
      optionalKeys.push(key);
    }
  }
  var result = formatCharsToTypeScript(jsonContent, objectName, optionalKeys);
  objectResult.push(result);
  return objectResult.join("\n\n");
}

export function convert(content: string) {
  var jsonContent = JSON.parse(content);
  if (_.isArray(jsonContent)) {
    return convertObjectToTsInterfaces(jsonContent[0]);
  }
  return convertObjectToTsInterfaces(jsonContent);
}
