var express = require('express');
var http = require('http');
var path = require('path');
var CurrencyCloud = require('./lib/currency_cloud');

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
})

app.post('/make_payment', function(request, response){
	
	payment_details = request.body.payment_details;
	account_details = request.body.account_details;
	account_details.acct_ccy = payment_details.buy_currency;
	
    cc_api = new CurrencyCloud('rachel.nienaber@thecurrencycloud.com', '1096bf354cd7396c33cde2f6393843ffd333be310242a2b972b1cabc978036ab')
 	cc_api.make_payment(account_details, payment_details, function(beneficiary, execution) {
        response.render('final_payment_confirmation.ejs', {reference: execution.trade_id})
 	});
});

app.get('/friend_payment',function(req,res,next){
    res.render('friend_payment.ejs')
})

app.get('/list',function(req,res,next){
    res.render('list.ejs');
})

app.get('/view',function(req,res,next){
    res.render('view.ejs');
})

app.listen(3000);
console.log('Listening on port 3000');
