var execute=require('./dbconnection');

async function create(table_name,obj)
{
    //CREATE TABLE TaBLE_NAME (idcolumn INT PRIMARY KEY AUTO INCREAMENT,column1 TEXT,column2 TEXT)
    var sql=` CREATE TABLE ${table_name} (${table_name}_id INT PRIMARY KEY AUTO_INCREMENT`;
    var colums=Object.keys(obj);
     for(var i=0;i<colums.length;i++)
    {
        sql+=","+colums[i]+" TEXT";
    }
    sql+=")";

    var data=await execute(sql);
    return data;
}

//insert table dynamic query
async function insert(table_name,obj)
{
    var sql=` INSERT INTO ${table_name} (`;
    var colums=Object.keys(obj);
    for(var i=0;i<colums.length;i++)
    {
        if(i==0)
            sql+=""+colums[i]+"";
        else
            sql+=","+colums[i]+"";
    }
    sql+=') VALUES (';

    var values=Object.values(obj)
    for(var i=0;i<values.length;i++)
    {
        if(i==0)
            sql+="'"+values[i]+"'";
        else
            sql+=",'"+values[i]+"'";
    }
    sql+=')';

    var data=await execute(sql);
    
    //console.log(sql);
    return data;
}

async function select(table_name)
{
    var sql=`SELECT * FROM ${table_name}`;
    var data=await execute(sql);
    return data;
}



// select query

async function select_where(table_name,cond)
{
    var sql=` SELECT * FROM ${table_name} WHERE `;
    var colums=Object.keys(cond);
    var values=Object.values(cond);
    for(i=0;i<colums.length;i++)
    {
        if(i==0)
        sql+=`${colums[i]}='${values[i]}'`;
        else
        sql+=`AND ${colums[i]}='${values[i]}'`;
    }

    var data=await execute(sql);
    return data;
    // return sql;
}



// update query

async function UPDATE(table_name,cond,data)
{
	var sql=` UPDATE ${table_name} SET `;

	var colums=Object.keys(data);
    var values=Object.values(data);
    for(i=0;i<colums.length;i++)
    {
        if(i==0)
        sql+=` ${colums[i]}='${values[i]} '`;
        else
        sql+=`, ${colums[i]}='${values[i]} '`;
    }

    sql+=` WHERE `;
 	var colums=Object.keys(cond);
    var values=Object.values(cond);
    for(i=0;i<colums.length;i++)
    {
        if(i==0)
        sql+=`${colums[i]}='${values[i]}'`;
        else
        sql+=`AND ${colums[i]}='${values[i]}'`;
    }
    
	var data=await execute(sql);
}



// DELETE query

async function del(table_name,id)
{
    var sql=` DELETE FROM ${table_name} WHERE ${table_name}_id='${id}' `;
    var data=await execute(sql);
}




module.exports={create,insert,select,select_where,UPDATE,del}