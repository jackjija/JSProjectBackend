const express = require('express');
const Sequelize = require('sequelize');
const app = express();
const session = require('express-session');
require('dotenv').config();

const port  = process.env.PORT || 5000;
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(session({secret:"mysession",resave:false,saveUninitialized:true}));

const sequelize = new Sequelize('database', 'username', 'password', {
    host:'localhost',
    dialect: 'sqlite',
    storage: './Database/SanitarywareDB.sqlite'
});

const user = sequelize.define("user", {
    userid:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey:true
    } ,
    username :{
        type: Sequelize.STRING
    } ,
    password :{
        type: Sequelize.STRING
    } ,
    name :{
        type: Sequelize.STRING
    } ,
    phone :{
        type: Sequelize.STRING
    },
    address :{
        type: Sequelize.STRING
    },
    role:{
        type: Sequelize.STRING,
        defaultValue: 'user'
    }
});
const product = sequelize.define("product",{
    sanitarywareid:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    sanitarywarename:{
        type: Sequelize.STRING
    },
    sanitarywaretype:{
        type: Sequelize.STRING
    },
    sanitarywareprice:{
        type: Sequelize.STRING
    }
});
const cart = sequelize.define("cart",{
    cartid:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userid:{
        type: Sequelize.INTEGER
    },
    sanitarywareid:{
        type: Sequelize.JSON
    }
});
const order = sequelize.define("order",{
    orderid:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userid:{
        type: Sequelize.INTEGER
    },
    cartid:{
        type: Sequelize.INTEGER
    },
});

sequelize.sync();

//Register user
app.get("/users", (req, res) => {
    user.findAll() //select * from
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  });

  app.post("/register", async (req, res) => {
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

app.get("/user/:id",(req,res) => {
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

app.put('/user/:id',(req,res) => {
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

app.delete("/user/:id",(req,res) => {
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

app.get('/product/:id',(req, res) =>{
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

app.post('/product',(req, res) =>{
    product.create(req.body).then(product => {
        res.send(product);
    }).catch(err => {
            res.status(500).send(err);
    });
});

app.put('/product/:id',(req,res) => {
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

app.delete('/product/:id',(req,res) => {
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

//Cart
app.get('/carts',(req,res) => {
    cart.findAll().then(cart => {
        res.json(cart);
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.get('/cart/:id',(req, res) =>{
    cart.findByPk(req.params.id).then(cart => {
        if (!cart){
            res.status(404).send('Cart not found');
        } else{
            res.json(cart);
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.post('/cart', async (req, res) => {
    try {
        const newCart = await cart.create(req.body);
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/cart/:id', async (req, res) => {
    try {
        const cart = await cart.findByPk(req.params.id);
        if (!cart) {
            res.status(404).json({ error: 'Cart not found' });
        } else {
            await cart.update(req.body);
            res.json(cart);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/cart/:id', async (req, res) => {
    try {
        const cart = await cart.findByPk(req.params.id);
        if (!cart) {
            res.status(404).json({ error: 'Cart not found' });
        } else {
            await cart.destroy();
            res.status(204).end();
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Order
app.get('/orders',(req, res) =>{
    order.findAll().then(order => {
        res.json(order);
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.get('/order/:id',(req, res) =>{
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

app.post('/order',(req, res) =>{
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

app.delete('/order/:id',(req,res) => {
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

