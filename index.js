const express=require("express");
const app=express();
const dotenv = require("dotenv");
dotenv.config();
app.set("view engine", "ejs");

var bodyParser=require("body-parser");
const connection=require("./config/db");
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


app.get("/",(req,res)=>
{
    res.redirect("/index.html");
});

app.get("/delete-data",(req,res)=>
{
    const deleteQuery="delete from crud where id=?";
    connection.query(deleteQuery,[req.query.id],(err,rows)=>
    {
        if(err)
        {
         console.log(err);
        }
        else
        {
            res.redirect("/data");
        }
    })
})
app.get("/data",(req,res)=>
{
    connection.query("SELECT * FROM crud ",(err,rows)=>
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("read.ejs",{rows});
        }
    })
})
app.get("/update-data",(req,res)=>
{
    connection.query("select * from crud where id=?",req.query.id,(err,eachRow)=>
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            result=JSON.parse(JSON.stringify(eachRow[0]));
            console.log(result);
            res.render("edit.ejs",result)
        }
    })
});

app.post("/final-update",(req,res)=>
{
       console.log(req.body)
       const id=req.body.hidden_id;
       const name=req.body.name;
       const email=req.body.email;

       console.log("id...",id);
       const updateQuery = "update crud set name = ?,email = ? where id = ?";
    
    try {
        connection.query(updateQuery,[name,email,id],(err,rows)=>
        {
            if(err)
            {
                console.log(err);
            }else
            {
                res.redirect("/data");
            }
        }
        );
    } catch (err) {
         console.log(err);
    }
})


app.post("/index",(req,res)=>
{
       console.log(req.body)
       const name=req.body.name;
       const email=req.body.email;
    
    try {
        connection.query("INSERT INTO crud (name,email) values(?,?)",[name,email],(err,rows)=>
        {
            if(err)
            {
                console.log(err);
            }else
            {
                res.redirect("/data");
            }
        }
        );
    } catch (err) {
         console.log(err);
    }
})

app.listen(process.env.PORT || 4000,(error)=>
{
      if(error)
      {
        throw error;
      }
      console.log(`server running on ${process.env.PORT}`);
});


