var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'inserte clave aqui', 
  resave: false,
  saveUninitialized: true
}));

app.get('/escribir-sesion/:valor', (req, res) => {
  const { valor } = req.params;
  req.session.miVariable = valor;
  res.send('Variable de sesión escrita.');
});

app.get('/escribir-sesion/:valor', (req, res) => {
  const { valor } = req.params;
  req.session.miVariable = valor;
  res.send('Variable de sesión escrita.');
});

app.get('/mostrar-sesion', (req, res) => {
  const miVariable = req.session.miVariable || 'Variable de sesión no definida.';
  res.send(`Valor de la variable de sesión: ${miVariable}`);
});



// app.use('/', indexRouter);
// app.use('/users', usersRouter); 


app.get('/', (req, res) => {
  res.render('index');
});

app.post('/iniciar-sesion', (req, res) => {
  const { usuario, contrasena } = req.body;
  req.session.usuario = usuario;
  res.redirect('/perfil');
});

app.get('/perfil', (req, res) => {
  const usuario = req.session.usuario;
  if (usuario) {
    res.send(`Bienvenido, ${usuario}! <a href="/cerrar-sesion">Cerrar Sesión</a>`);
  } else {
    res.redirect('/');
  }
});

app.get('/cerrar-sesion', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
