const express = require('express')
const errorhandler = require('errorhandler')
const logger= require('morgan')
const bodyparser =require('body-parser')
var db = require("./database.js")




let app = express();
app.use(bodyparser.json())
app.use(logger('dev'))
app.use(errorhandler())









// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));


app.get("/users", (req, res, next) => {
    var sql = "select * from accounts"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })


        
      });
});



app.get("/history", (req, res, next) => {
    var sql = "select * from account_changes"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});








app.get("/users/userID/:id", (req, res, next) => {
    var sql = "select * from accounts where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});



app.post("/users/", (req, res, next) => {
    var errors=[]
    if (!req.body.name){
        errors.push("No password specified");
    }
    if (!req.body.email){
        errors.push("No email specified");
    } 
    if(!req.body.balance){
        errors.push("no money specified")
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = req.body
    var sql ='INSERT INTO accounts (name, email, balance) VALUES (?,?,?)'
    var params =[data.name, data.email, data.balance]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})



app.put("/users/:id1/:id2/:amount1", (req, res, next) => {
    var errors=[]

   
    if (!req.params.id1){
        errors.push("No user specified");
    }
    if (!req.params.id2){
        errors.push("No second_user specified");
        
    }
    if (req.params.id1 === req.params.id2){
        errors.push(" same user  specified");
    }

    if (!req.params.amount1){
        errors.push("No amount specified");
    }


    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    db.serialize(() => {

       
        // queries will execute in serialized mode
        db.run("BEGIN")
           
          .run( `UPDATE accounts
            SET balance = balance - ?
          WHERE email = ?;`,
          [ req.params.amount1,req.params.id1])
          .run(`UPDATE accounts
            SET balance = balance + ?
          WHERE email = ?;`,[ req.params.amount1,req.params.id2])
          .run(` INSERT INTO account_changes(Debited,flag,Credited,amount,transfered_at) 
          VALUES(?,'-/+',?,?,datetime('now'));`,
          [ req.params.id1,req.params.id2,req.params.amount1])
          .run("END",(err, result) => {
            if (err){
                res.status(400).json({"error": res.message})
               
                console.log(err);
                return;
            }
            res.json({
                message: "success transcation",
                //data: data
            })
    })



      });
    
})


// Root path
app.get("/", (req, res, next) => {

    res.sendFile(`${__dirname}/views/index.html`);
     //res.json({"message":"Ok"});
});

app.listen(process.env.PORT || 3000);
