const express = require('express');
const Sequelize = require('sequelize');
const app = express();
require('dotenv').config();

const port  = process.env.PORT || 5000;
app.use(express.json());

const sequelize = new Sequelize('database', 'username', 'password', {
    host:'localhost',
    dialect: 'sqlite',
    storage: './Database/SanitarywareDB.sqlite'
});

const user = sequelize.define("user", {
    user_id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey:true
    } ,
    fname :{
        type: Sequelize.STRING
    } ,
    lname : {
        type: Sequelize.STRING
    },
    phone :{
        type: Sequelize.STRING
    },
    address :{
        type: Sequelize.STRING
    }
});
const product = sequelize.define("product",{
    product_id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    product_name:{
        type: Sequelize.STRING
    },
    category_id:{
        type: Sequelize.INTEGER
    },
    price:{
        type: Sequelize.STRING
    }
});
const order = sequelize.define("order",{
    order_id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id:{
        type: Sequelize.INTEGER
    },
    product_id:{
        type: Sequelize.JSON
    }
});
const categories = sequelize.define("categories",{
    category_id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    category_name:{
        type: Sequelize.STRING,
    }
});

sequelize.sync();

//user
app.get("/users", (req, res) => {
    user.findAll()
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  });

  app.post("/users", async (req, res) => {
    console.log(req.body);
      user.create(req.body)
        .then((user) => {
          res.send(user);
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    }
  );

app.get("/users/:id",(req,res) => {
    user.findByPk(req.params.id).then(data => {
        if (data) {
            res.json(data);
        }
        else{
            res.status(404).send("user not found");
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.put('/users/:id',(req,res) => {
    console.log(req.data)
    user.findByPk(req.params.id).then(user => {
        if (!user) {
            res.status(404).send('User not found');
        } else {
            user.update(req.body).then(() =>{
                res.send(user);
            }).catch(err => {
                res.status(500).send(err);
            });
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.delete("/users/:id",(req,res) => {
    user.findByPk(req.params.id).then(data => {
        if (data) {
            data.destroy().then(() => {
                res.json({});
            }).catch(err => {
                res.status(500).send(err);
            })
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});

//Product
app.get('/products',(req, res) =>{
    product.findAll().then(product => {
        res.json(product);
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.get('/products/:id',(req, res) =>{
    product.findByPk(req.params.id).then(product => {
        if (!product){
            res.status(404).send('Product not found');
        } else{
            res.json(product);
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.post('/products',(req, res) =>{
    product.create(req.body).then(product => {
        res.send(product);
    }).catch(err => {
            res.status(500).send(err);
    });
});

app.put('/products/:id',(req,res) => {
    product.findByPk(req.params.id).then(product => {
        if (!product) {
            res.status(404).send('Product not found');
        } else {
            product.update(req.body).then(() =>{
                res.send(product);
            }).catch(err => {
                res.status(500).send(err);
            });
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.delete('/products/:id',(req,res) => {
    product.findByPk(req.params.id).then(product=> {
        if (!product){
            res.status(404).send('Product not found');
        } else {
            product.destroy().then(() => {
                res.send({});
            }).catch(err => {
                res.status(500).send(err);
            });
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});

//Category
app.get('/categories',(req, res) => {
    categories.findAll().then(category => {
        res.json(category);
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.get('/categories/:id',(req, res) =>{
    categories.findByPk(req.params.id).then(category => {
        if(!category){
            res.status(404).send('Categories not found');
        } else {
            res.json(category);
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.post('/categories',(req, res) => {
    categories.create(req.body).then(category =>{
        res.send(category);
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.put('/categories/:id',(req,res) => {
    categories.findByPk(req.params.id).then(category => {
        if (!category) {
            res.status(404).send('Categories not found');
        } else {
            category.update(req.body).then(() =>{
                res.send(category);
            }).catch(err => {
                res.status(500).send(err);
            });
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.delete('/categories/:id',(req,res) => {
    categories.findByPk(req.params.id).then(category=> {
        if (!category){
            res.status(404).send('Categories not found');
        } else {
            category.destroy().then(() => {
                res.send({});
            }).catch(err => {
                res.status(500).send(err);
            });
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});

//Order
app.get('/orders',(req, res) =>{
    order.findAll().then(order => {
        res.json(order);
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.get('/orders/:id',(req, res) =>{
    order.findByPk(req.params.id).then(order => {
        if (!order){
            res.status(404).send('Order not found');
        } else{
            res.json(order);
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.post('/orders',(req, res) =>{
    order.create(req.body).then(order => {
        res.send(order);
    }).catch(err => {
            res.status(500).send(err);
    });
});

app.put('/order/:id',(req,res) => {
    order.findByPk(req.params.id).then(order => {
        if (!order) {
            res.status(404).send('Order not found');
        } else {
            order.update(req.body).then(() =>{
                res.send(order);
            }).catch(err => {
                res.status(500).send(err);
            });
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.delete('/orders/:id',(req,res) => {
    order.findByPk(req.params.id).then(order=> {
        if (!order){
            res.status(404).send('Order not found');
        } else {
            order.destroy().then(() => {
                res.send({});
            }).catch(err => {
                res.status(500).send(err);
            });
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});


//connect server
app.listen(port,() => {
    console.log(`http://localhost:${port}`);
});

