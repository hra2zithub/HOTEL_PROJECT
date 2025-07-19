var mysql=require('mysql');
var con=mysql.createConnection({
    user:'ujpgizs910fqdttl',
    database:'bckqmpgxvznbln6tps13',
    password:'e5ZGvhL5TrrTjEvZ1Lzs',
    host:'bckqmpgxvznbln6tps13-mysql.services.clever-cloud.com',
});
var util=require('util');
var execute=util.promisify(con.query).bind(con);

module.exports=execute;
