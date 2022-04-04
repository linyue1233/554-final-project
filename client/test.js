console.log('hello world');

function isString(str, varName) {
    if (!str) throw `${varName} must be provided`;
    if (typeof str != 'string') throw `${varName} must be a string`;
    if (str.trim().length == 0) throw `${varName} cannot just be empty spaces`;
    return true;
}
let a = '03a4cf90-bcb5-421c-a45f-24ccdc18340e';
console.log(isString(a, 'a'));
