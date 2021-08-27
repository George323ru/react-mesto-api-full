const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const usersRoutes = require('./routes/users')
const cardsRoutes = require('./routes/cards')
const {
  createUser,
  login,
} = require('./controllers/users')
const auth = require('./middlewares/auth')
const NotFoundError = require('./errors/not-found-err')
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors')

const { PORT = 3000 } = process.env

const app = express()
app.use(helmet())
app.disable('x-powered-by')

app.use(cookieParser())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})

// // Массив доменов, с которых разрешены кросс-доменные запросы
// const allowedCors = [
//   'api.gusevgeorgiy.students.nomoredomains.monster',
//   'gusevgeorgy.students.nomoredomains.club',
// ];

app.use(cors());
// app.use(function (req, res, next) {
//   const { origin } = req.headers;
//   const requestHeaders = req.headers['access-control-request-headers'];
//   if (allowedCors.includes(origin)) {
//     const { method } = req;
//     const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";

//     if (method === 'OPTIONS') {
//       res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
//       res.header('Access-Control-Allow-Headers', requestHeaders);
//     }

//     res.header('Access-Control-Allow-Origin', "*");
//   }

//   next();
// });

app.post('/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }), createUser)
app.post('/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }), login)

app.use('/users', auth, usersRoutes)
app.use('/cards', auth, cardsRoutes)

app.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден')
})

app.use(errors());

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    })
  next()
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})