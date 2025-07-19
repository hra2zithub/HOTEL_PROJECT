var mysql=require('mysql');
var con=mysql.createConnection({
    user:'root',
    database:'hotel_project_db',
    password:'',
    host:'localhost',
});
var util=require('util');
var execute=util.promisify(con.query).bind(con);

module.exports=execute;