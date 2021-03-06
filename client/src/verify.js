/**
 * Type and Format Checking Function
 */
 function isString(str, varName) {
    if (!str) throw `${varName} must be provided`;
    if (typeof str != 'string') throw `${varName} must be a string`;
    if (str.trim().length == 0) throw `${varName} cannot just be empty spaces`;
}
function checkUsername(str) {
    if (str.toLowerCase().trim() != str.toLowerCase().trim().replace(/\s+/g, ''))
        throw 'Username cannot have spaces';
    if (str.length < 4) throw 'Username at least 4 characters';
}
function checkEmail(str) {
    //check space
    if (!str) throw 'Email must be provided';
    if (str.toLowerCase().trim() != str.toLowerCase().trim().replace(/\s+/g, ''))
        throw 'Email cannot have spaces';
    //check format XX@XX.com
    if (
        /([a-zA-Z0-9]+)([\_\.\-{1}])?([a-zA-Z0-9]+)\@([a-zA-Z0-9]+)([\.])com/.test(
            str.trim()
        ) == false
    )
        throw 'You must provide a valid email address \n - Start and end with an alphanumeric character \n - Can contain an underscores (_), dashes (-), or periods (.) \n - Domain name follows after at symbol (@) \n - Domain name is any alphanermic character(s) followed by .com';
    str = str.trim().split('@');
    if (str[0].length < 6 || str[1].length < 7)
        throw 'You must provide email prefix with at least 6 digits and domain at least 3 digits';
}
function checkPassword(str) {
    if (!str) throw 'Password must be provided!';
    if (str.toLowerCase().trim() != str.toLowerCase().trim().replace(/\s+/g, ''))
        throw 'Password cannot have spaces';
    if (str.length < 6) throw 'Password must be at least 6 characters';
}
function checkSpace(str, varName) {
    if (str.trim() != str.trim().replace(/\s+/g, ''))
        throw `${varName} cannot have spaces`;
}

function checkAvatarSuffix(avatar) {
    if (!avatar) throw `Please check your file.`;
    let availableSuffix = [
        'jpeg',
        'jfif',
        'exif',
        'gif',
        'bmp',
        'png',
        'ppm',
        'pgm',
        'pbm',
        'pnm',
        'webp',
        'tiff',
        'helf',
        'svg',
        'eps',
        'bat',
        'cgm',
        'jpg',
    ];
    let index = avatar.lastIndexOf('.');
    let avatarSuffix = avatar.substring(index + 1);
    avatarSuffix = avatarSuffix.toLowerCase();
    if (availableSuffix.indexOf(avatarSuffix) === -1) {
        throw `You should upload a image format file.`;
    }
}

let checkTags = (arr) => {
    const validTags = ['action', 'love', 'thriller', 'comedy', 'documentary']; //tbd
    for (let tag of arr) {
        if (validTags.indexOf(tag) === -1) throw `${tag} is not a valid tag`;
    }
    if (new Set(arr).size !== arr.length) throw `Tags cannot have duplicate`;
};

function checkTag(tag) {
    if (!tag) throw `Tag must be provided`;
    if (tag.toLowerCase().trim() != tag.toLowerCase().trim().replace(/\s+/g, ''))
        throw `Tag cannot have spaces`;
    // tag if in 'action', 'love', 'thriller', 'comedy', 'documentary' this 5 types
    const validTags = ['action', 'love', 'thriller', 'comedy', 'documentary'];
    if (validTags.indexOf(tag) === -1) throw `${tag} is not a valid tag`;
}

function checkVideoSuffix(videoPath) {
    if (!videoPath) throw `Please check your file.`;
    let availableSuffix = [
        'avi',
        'wmv',
        'mpg',
        'mpeg',
        'mov',
        'rm',
        'ram',
        'swf',
        'flv',
        'mp4',
        'mp3',
        'wma',
        'avi',
        'rm',
        'rmvb',
        'flv',
        'mpg',
        'mkv',
    ];
    let index = videoPath.lastIndexOf('.');
    let videoSuffix = videoPath.substring(index + 1);
    videoSuffix = videoSuffix.toLowerCase();
    if (availableSuffix.indexOf(videoSuffix) === -1) {
        throw `You should upload a video format file.`;
    }
}

module.exports = {
    isString,
    checkPassword,
    checkEmail,
    checkUsername,
    checkSpace,
    checkTags,
    checkAvatarSuffix,
    checkVideoSuffix,
    checkTag,
};
