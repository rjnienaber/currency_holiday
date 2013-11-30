var express = require('express');
var http = require('http');
var path = require('path');

partials = require('express-partials')
var app = express();

// all environments
app.use(partials());
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layout');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/final_payment',function(req,res,next){
    res.render('final_payment.ejs')
    // -> render layout.ejs with index.ejs as `body`.
})



app.listen(3000);
console.log('Listening on port 3000');