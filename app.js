if (process.env.IS_DEV_ENVIRONMENT) {
  require('dotenv').config();
}

const express = require('express');
const serverlessExpress = require('@vendia/serverless-express');

const sequelize = require('./util/database');
const stripe = require('./util/stripe');
require('./util/mailer');
const shopRoute = require('./routes/shop');
const authRoute = require('./routes/auth');
const adminRoute = require('./routes/admin');
const webHooksRoute = require('./routes/webhooks');

const Product = require('./models/product');
const User = require('./models/user');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');
const Collection = require('./models/collection');
const PasswordReset = require('./models/password-reset');

const app = express();

//Stripe webhook controller needs body as raw binary data, not parsed to json
app.use((req, res, next) => {
  if (req.originalUrl === '/webhooks/stripe') {
    next();
  } else {
    //Retreive the express.json middleware, then call it and pass in req, res, next as express would to execute middleware
    express.json()(req, res, next);
  }
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE '
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use('/shop', shopRoute);
app.use('/admin', adminRoute);
app.use('/webhooks', webHooksRoute);

app.use('/auth', authRoute);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

Collection.hasMany(Product);
Product.belongsTo(Collection);
User.hasMany(Order);
// Order.belongsTo(User);
Order.hasMany(OrderItem, { onDelete: 'cascade' });
OrderItem.belongsTo(Order);
OrderItem.belongsTo(Product);
PasswordReset.belongsTo(User);

exports.handler = serverlessExpress({ app });

if (process.env.IS_DEV_ENVIRONMENT) {
  const main = async () => {
    // const result = await sequelize.sync({ alter: true });
    // const result = await sequelize.sync({ force: true });
    app.listen(process.env.PORT || 5001);
  };

  main();
}
