const { render } = require('ejs');
var express=require('express');
var router=express.Router();
var execute=require('./../dbconnection');
var query=require('./../query');
var url=require('url');

function getvalidmonth(cdate)
{
    var month=cdate.getMonth()+1;
    if(month<10)
    {
        return "0"+month;
    }
    else
    {
        return month;
    }
}

// login


router.get('/',function(req,res){
    // if (req.session.admin_id) 
        res.render("admin/home.ejs");
    // else
    //     res.send(
    //         `<script>
    //             // alert("Login failed");
    //             location.assign('/admin/login')
    //         </script>`
    //     )
  });
  
  router.get('/login',function(req,res){
    if (req.session.admin_id) 
        res.redirect("/admin");
    else
        res.render("admin/login.ejs");
  });
  
  router.post('/login_process',async function(req,res){
    var sql=`SELECT * FROM admin WHERE admin_email='${req.body.admin_email}' 
     AND admin_password='${req.body.admin_password}'`;
    var data=await execute(sql);
    if(data.length>0)
    
    {
        req.session.admin_id=data[0].admin_id
        res.send(
            `<script>
                alert("Login Success");
                location.assign('/admin')
            </script>`
    )
    }
    else
    {
        res.send(
            `<script>
                alert("Login failed");
                location.assign('/admin/login')
            </script>`
        )
    };
  })


router.get("/",async function(req,res)
{
    var date=new Date();
    var today=date.getFullYear()+"-"+getvalidmonth(date)+"-"+date.getDate();
    // var thismonth=getvalidmonth()
    // today order
    var data=await execute("SELECT SUM(paid_amt) FROM order_tbl WHERE order_date='"+today+"'");
    console.log(data);
    res.render("admin/home.ejs",{'order_ttl':data});
});

// this month
// var data=await execute("SELECT SUM(paid_amt) FRO 

router.get("/add_category",async function(req,res)
{
    var data=await query.select("category");
    res.render("admin/add_category.ejs",{'cat_list':data});
});

router.post("/savecategory",async function(req,res)
{
    var data=await query.insert('category',req.body);
    res.redirect("/admin/add_category");
})

// delete category

router.get("/delete_category",async function(req,res)
{
    var urlData=url.parse(req.url,true).query;
    var id=urlData.id;
    // console.log(urlData)
    var data=await query.del('category',id);
    // console.log(data);
    res.redirect("/admin/add_category");
})


// edit category
router.get("/edit_category",async function(req,res)
{
    var data=await query.select_where("category",{'category_id':url.parse(req.url,true).query.id});

    res.render("admin/edit_category.ejs",{'cat_list':data});
});

router.post("/edit_category",async function(req,res)
{
    var urlData=url.parse(req.url,true).query;
    // console.log(urlData);
    // var id=urlData.id;
    // console.log(id);
    // console.log(req.body);
    // res.send(req.body);
  
    var data=await query.UPDATE("category",{category_id:req.body.category_id},{category_name:req.body.category_name});
    // console.log(data);
    // return data;
    // res.send(data);
    // console.log(data);
    
    res.redirect("/admin/add_category");          

})




router.get("/add_dish",async function(req,res)
{
    var cat_list=await query.select("category");
    res.render("admin/add_dish.ejs",{'cat_list':cat_list})
});

router.post("/savedish",async function(req,res) 
{
    console.log(req.files);
    req.body.dish_image=req.files.dish_image.name;
    req.files.dish_image.mv('public/uploads/'+req.files.dish_image.name);
    var data=await query.insert("dish",req.body);
    res.redirect("/admin/add_dish");
});

router.get("/dish_list",async function(req,res)
{
    var data=await execute(" SELECT * FROM dish,category WHERE dish.category_id=category.category_id");
    res.render("admin/dish_list.ejs",{dishes:data});
})

router.get("/dish_list",async function(req,res)
{
    var cat_list=await query.select("category");
    res.render("admin/add_dish.ejs",{"cat_list":cat_list});
});
// var data=await query.select_where("hotel_table",{'hotel_table_id':url.parse(req.url,true).query.id});

// edit dish
router.get("/edit_dish",async function(req,res)
{
    var data=await query.select_where("dish",{'dish_id':url.parse(req.url,true).query.id});
    res.render("admin/edit_dish.ejs",{"edit_dish":data});
});
// var urlData=url.parse(req.url,true).query;

    // var data=await query.UPDATE("category",{category_id:req.body.category_id},{category_name:req.body.category_name});

router.post("/saveEditDish",async function(req,res)
{
    var urlData=url.parse(req.url,true).query;
    var data=await query.UPDATE("dish",{dish_id:req.body.edit_dish_id},{dish_name:req.body.edit_dish_name,
                                        dish_price:req.body.edit_dish_price,dish_image:req.body.edit_dish_image,
                                        dish_details:req.body.edit_dish_detail});
    // res.send(req.body);
    res.redirect("/admin/dish_list");
    // console.log(data);
    // res.send("Done");
})

// delete dish

router.get("/delete_dish",async function(req,res)
{
    var urlData=url.parse(req.url,true).query;
    var id=urlData.id;
    var data=await query.del('dish',id);
    res.redirect("/admin/dish_list");
})


// var urlData=url.parse(req.url,true).query;
// var id=urlData.id;
// // console.log(urlData)
// var data=await query.del('category',id);
// // console.log(data);
// res.redirect("/admin/add_category");

//select from table 
router.get("/add_table",async function(req,res)
{
    var table_list=await query.select("hotel_table");
    res.render("admin/add_table.ejs",{'table_list':table_list});
});

router.post("/savetable",async function(req,res)
{
    req.body.status='free';
    var data=await query.insert("hotel_table",req.body);
    res.redirect("/admin/add_table");
});


// edit table
router.get("/edit_table",async function(req,res)
{
    var data=await query.select_where("hotel_table",{'hotel_table_id':url.parse(req.url,true).query.id});
    res.render("admin/edit_table.ejs",{'table_list':data});

    // var urlData=url.parse(req.url,true),query;
    // var id=urlData.id;
    // var data=await 
});
router.post("/save_edit_table",async function(req,res)
{
    // var urlData=url.parse(req.url,true).query;

    // var data=await query.UPDATE("category",{category_id:req.body.category_id},{category_name:req.body.category_name});
    var data=await query.UPDATE("hotel_table",{hotel_table_id:req.body.hotel_table_id},{table_name:req.body.table_name});
    // res.send(data)
    // res.send("Done");
    // console.log(data);
    // return data;
    // res.send(data);
    // console.log(data);
    res.redirect("/admin/add_table");
})


// delete table

router.get("/delete_table",async function(req,res)
{
    var urlData=url.parse(req.url,true).query;
    var id=urlData.id;
    // console.log(urlData)
    var data=await query.del('hotel_table',id);
    // console.log(data);
    res.redirect("/admin/add_table");
});





//add customer

router.get("/add_customer",function(req,res)
{
    res.render("admin/add_customer.ejs");
})

//save customer

router.post("/savecustomer",async function(req,res)
{
    var data=await query.insert("customer",req.body);
    res.redirect("/admin/add_customer");
});
// var data=await query.select_where("dish",{'dish_id':url.parse(req.url,true).query.id});

// edit customer
router.get("/edit_customer",async function(req,res)
{
    var data=await query.select_where("customer",{'customer_id':url.parse(req.url,true).query.id});
    res.render("admin/edit_customer.ejs",{"edit_customer":data});
}); 

router.post("/saveEditCustomer",async function(req,res)
{
    var urlData=url.parse(req.url,true).query;
    var data=await query.UPDATE("customer",{customer_id:req.body.customer_id},{customer_name:req.body.customer_name,
                                            customer_mobile:req.body.customer_mobile,customer_address:req.body.customer_address,
                                            due_payment:req.body.customer_due_payment});
    // res.send(data);
    res.redirect("/admin/customer_list");
})

// delete customer

router.get("/delete_customer",async function(req,res)
{
    var urlData=url.parse(req.url,true).query;
    var id=urlData.id;
    var data=await query.del('customer',id);
    res.redirect("/admin/customer_list");
})



// app.get("/edit_student",async function(req,res)
// {
//     var urlData=url.parse(req.url,true).query;
//     var data=await execute("SELECT * FROM student WHERE student_id='"+urlData.id+"'");
//     console.log(data);
//     var obj={'students':data};
//     res.render("edit_student.ejs",obj);
// });

// app.post("/SaveUpdatedStudent",async function(req,res)
// {
//     var d=req.body;
//     var sql=` UPDATE student SET 
//     student_id='${d.student_id}',
//     student_name='${d.student_name}',
//     student_mobile='${d.student_mobile}',
//     student_email='${d.student_email}' 
//     WHERE student_id='${d.student_id}'
//      `;
//      var data=await execute(sql);
//      res.redirect("/");
// });


// customer list
router.get("/customer_list",async function(req,res)
{
    var data=await query.select("customer")
    res.render("admin/customer_list.ejs",{'cust_list':data});
})

// create_order

router.get("/create_order",async function(req,res)
{
    var tables=await query.select("hotel_table");
    res.render('admin/create_order.ejs',{'tables':tables});
});

// create order2
router.get("/create_order2/:table_id",async function(req,res)
{
    var hotel_table_id=req.params.table_id;
    // console.log(hotel_table_id);
    var table_info=await query.select_where("hotel_table",
    {'hotel_table_id':hotel_table_id});
    var dish_list=await query.select("dish");

    var orderDetails=await query.select_where('order_tbl',{'hotel_table_id':hotel_table_id,'status':'processing'});

    if(orderDetails[0])
       var orderDishes=await query.select_where('order_dishes',{'order_id':orderDetails[0]['order_tbl_id']});
    else
        var orderDishes=[]

    console.log(orderDishes);

    res.render("admin/create_order2.ejs",{'table_info':table_info,'dish_list':dish_list,'orderDetails':orderDetails,'orderDishes':orderDishes});
});

router.post("/get_price_by_ajax",async function(req,res)
{
    var dish_info=await query.select_where("dish",req.body);
    res.send(dish_info);
})
router.post("/saveorder",async function(req,res)
{
    var orderDetails=await query.select_where('order_tbl',{'hotel_table_id':req.body.hotel_table_id,'status':'processing'});
    if(orderDetails[0])
    {
        var order_id= orderDetails[0].order_tbl_id;
    }
    else
    {
    var date=new Date();
    var order={
        customer_id:'',
        hotel_table_id:req.body.hotel_table_id,
        order_amt:'',
        paid_amt:'',
        pending_amt:'',
        order_date:date.getFullYear()+"-"+getvalidmonth(date)+"-"+date.getDate(),
        entry_time:date.getHours()+":"+date.getMinutes()+":"+date.getSeconds(),
        exit_time:'',
        status:'processing'
        }
    var data=await query.insert('order_tbl',order);
    var order_id=data.insertId;
    }
    
    var dish_det=await query.select_where('dish',{'dish_id':req.body.dish_id});

    var orderdishobj={
        'order_id':order_id,
        'dish_id':req.body.dish_id,
        'dish_name':dish_det[0].dish_name,
        'dish_price':req.body.dish_rate,
        'dish_qty':req.body.dish_qty,
        'dish_total':req.body.dish_total,
        'dish_image':dish_det[0].dish_image,
        'dish_details':dish_det[0].dish_details
    };

    await execute("UPDATE hotel_table SET status='allocate' WHERE hotel_table_id='"+req.body.hotel_table_id+"'")

    var data=await query.insert("order_dishes",orderdishobj);
    res.send({'status':'success'});
    // res.redirect("create_order2/"+req.body.hotel_table_id);
})

// remove dish by ajax
router.post("/removedish_by_ajax",async function(req,res)
{
    var data=await execute("DELETE FROM order_dishes WHERE order_dishes_id='"+req.body.dish_id+"'");
    res.send({'status':'success','message':'Record Deleted'})

});


//  get order dish by ajax
router.post("/getOrderDishes_by_ajax",async function(req,res)
{
    var orderDetails=await query.select_where('order_tbl',
    {'hotel_table_id':req.body.hotel_table_id,'status':'processing'});

    if(orderDetails[0])
    var orderDishes=await query.select_where('order_dishes',{'order_id':orderDetails[0]['order_tbl_id']});
    else
    var orderDishes=[];

    res.send({'status':'success','order_dishes':orderDishes});
});

router.post("/savebill",async function(req,res)
{
    var orderDetails=await query.select_where(
        'order_tbl',{'hotel_table_id':req.body.hotel_table_id,'status':'processing'});

    var date=new Date();

    var data=await execute(` UPDATE order_tbl SET 
        order_amt='${req.body.order_amt}',
        paid_amt='${req.body.paid_amt}',
        pending_amt='${req.body.pending_amt}',
        exit_time='${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}',
        status='complete'
        WHERE order_tbl_id='${orderDetails[0].order_tbl_id}'
        `);

    var updatetable=await execute(" UPDATE hotel_table SET status='free' WHERE hotel_table_id='"+req.body.hotel_table_id+"'");
        res.redirect("/admin/printbill/"+orderDetails[0].order_tbl_id);
});

router.get("/printbill/:order_id",async function(req,res)
{
    var order_id=req.params.order_id;
    var orderDetails=await query.select_where('order_tbl',{'order_tbl_id':order_id});
    var orderDishes=await query.select_where("order_dishes",{'order_id':order_id});

    res.render("admin/printbill.ejs",{'orderDetails':orderDetails,'orderDishes':orderDishes});
})


// order List
router.get("/order_list",async function(req,res)
{
    var data=await execute("SELECT * FROM order_tbl,hotel_table WHERE order_tbl.hotel_table_id=hotel_table.hotel_table_id ORDER BY order_tbl_id DESC");
    res.render("admin/order_list.ejs",{'data':data});
});

module.exports=router;