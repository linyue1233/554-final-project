const redis = require('redis');
client = redis.createClient();
client.connect();

let setKey = (key,value)=>{
    return new Promise((resolve, reject) => {
        client.set(key,value,(err,replay)=>{
            if(err){
                reject(err);
            }else{
                resolve(replay);
            }
        })
    })
};

let getKey = (key)=>{
    return new Promise((resolve, reject) => {
        client.get(key,(err,replay)=>{
            if(err){
                reject(err);
            }else{
                resolve(replay);
            }
        })
    })
};

let setExpire = function(key, value, timeout) {
    client.set(key,value);
    console.log(key,value,timeout);
    client.expire(key,timeout);
};

module.exports = {
    setKey,getKey,setExpire
};