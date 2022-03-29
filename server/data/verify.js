/**
 * Type and Format Checking Function
 */
function isString(str, varName) {
    if (!str) throw `${varName} must be provided`;
    if (typeof str != 'string') throw `${varName} must be a string`;
    if (str.trim().length == 0) throw `${varName} cannot just be empty spaces`;
}
function checkUsername(str) {
    if (str.toLowerCase().trim() != str.toLowerCase().trim().replace(/\s+/g, '')) throw 'Username cannot have spaces';
    if (str.length < 4) throw 'Username at least 4 characters';
}
function checkEmail(str) {
    //check space
    if (!str) throw 'Email must be provided';
    if (str.toLowerCase().trim() != str.toLowerCase().trim().replace(/\s+/g, '')) throw 'Email cannot have spaces';
    //check format XX@XX.com
    if (/([a-zA-Z0-9]+)([\_\.\-{1}])?([a-zA-Z0-9]+)\@([a-zA-Z0-9]+)([\.])com/.test(email.trim()) == false)
        throw 'You must provide a valid email address \n - Start and end with an alphanumeric character \n - Can contain an underscores (_), dashes (-), or periods (.) \n - Domain name follows after at symbol (@) \n - Domain name is any alphanermic character(s) followed by .com';
    email = email.trim().split('@');
    if (email[0].length < 6 || email[1].length < 7)
        throw 'You must provide email prefix with at least 6 digits and domain at least 3 digits';
}
function checkPassword(str) {
    if (!str) throw 'Password must be provided!';
    if (str.toLowerCase().trim() != str.toLowerCase().trim().replace(/\s+/g, '')) throw 'Password cannot have spaces';
    if (str.length < 6) throw 'Password must be at least 6 characters';
}

module.exports = {
    isString,
    checkPassword,
    checkEmail,
    checkUsername,
};
