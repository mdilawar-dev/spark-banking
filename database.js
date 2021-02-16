var sqlite3 = require('sqlite3').verbose()


const DBSOURCE = "db.sqlite" 


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQlite database.')
        db.run(`CREATE TABLE accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            email text UNIQUE, 
            balance DECIMAL NOT NULL DEFAULT 0, 
            CONSTRAINT email_unique UNIQUE (email)
            CHECK(balance >= 0)
            )`,(err) => {
        if (err) {
            // Table already created
        }else{
            // Table just created, creating some rows
            var insert = 'INSERT INTO accounts (name, email ,balance) VALUES (?,?,?)'
            db.run(insert, ["admin","admin@example.com","500"])
            db.run(insert, ["user","user@example.com","400"])

          
        }
    }) 
    
    

    db.run(`
        CREATE TABLE account_changes (
            change_no INTEGER PRIMARY KEY AUTOINCREMENT,
            Debited TEXT NOT NULL, 
            flag TEXT NOT NULL,
            Credited TEXT NOT NULL,
            amount DECIMAL NOT NULL, 
            transfered_at TEXT NOT NULL 
        )`,(err) => {
    if (err) {
        // Table already created
    }else{
        // Table just created, creating some rows
    
        var submit = 'INSERT INTO account_changes( Debited,flag,Credited,amount,transfered_at) VALUES(?,?,?,?,?)'
         db.run(submit, ['james@gmail.com','-/+','jhon@gmail.com',1000,"2021-02-10 12:41:45"])
         db.run(submit, ['jhon@gmail.com','-/+','james@gmail.com',500,"2021-02-10 12:41:45"])
    }
}) 










    }
})


module.exports = db