var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var materiasRouter = require('./routes/materias');
var carrerasRouter = require('./routes/carreras');
var departamentosRouter = require('./routes/departamentos');
var alumnosRouter = require('./routes/alumnos');
var profesoresRouter = require('./routes/profesores');
var inscripcionesRouter = require('./routes/inscripciones');

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/car', carrerasRouter);
app.use('/mat', materiasRouter);
app.use('/alu', alumnosRouter);
app.use('/pro', profesoresRouter);
app.use('/dep', departamentosRouter);
app.use('/ins', inscripcionesRouter);


// Json Web Token
var jwt = require('jsonwebtoken');
var keys = require('./settings/keys');
var loginRouter = require('./routes/logins');
app.set('key', keys.key);
app.use('/login', loginRouter);
// app.use('/token', loginRouter);


//app.listen(3001, () => {console.log('Servidor arriba en http://localhost:3001')});


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
