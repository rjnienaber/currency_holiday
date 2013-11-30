var scopedClient = require('scoped-http-client');
var util = require('util');

module.exports = CurrencyCloud

function CurrencyCloud(login, api_key) {
	self = this;
	self.login = login;
	self.api_key = api_key;
	self.api_url = 'https://devapi.thecurrencycloud.com';
	self.client = 

	self.encode = function(data) {
		return Object.keys(data).map(function(k) {
		    return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
		}).join('&')
	}

	self.post = function(url, data, callback) {
		post_data = self.encode(data);
		scopedClient
     		.create(self.api_url)
     		.path(url)
     	    .post(post_data)(function(err, resp, body) {
     	   	  callback(err, resp, JSON.parse(body));
     	    });		
	}

	self.authenticate = function(callback) {
		var data = {login_id: self.login, api_key: self.api_key};

		self.post('/api/en/v1.0/authentication/token/new', data, function(err, resp, body) {
 	   	  self.current_token = body['data'];
 	   	  callback(self.current_token);
 	    });
	}

	self.create_beneficiary = function(account_details, callback) {
		url = '/api/en/v1.0/' + self.current_token + '/beneficiary/new';
		self.post(url, account_details, function(err, resp, body) {
 	   	  callback(body['data']);
 	    });
	}

	self.execute_trade = function(trade_details, callback) {
		url = '/api/en/v1.0/' + self.current_token + '/trade/execute';
		self.post(url, trade_details, function(err, resp, body) {
 	   	  callback(body['data']);
 	    });	
	}

	self.make_payment = function(account_details, payment_details, callback) {
		self.authenticate(function (token) {
			self.create_beneficiary(account_details, function(beneficiary_details) {
				beneficiary_id = beneficiary_details['beneficiary_id'];
				payment_details['beneficiary_id'] = beneficiary_id;
				payment_details['return_details'] = true;
				payment_details['term_agreement'] = true;

				self.execute_trade(payment_details, function(execution) {
					callback(beneficiary_details, execution);
				});
			})
		});
	}
}

var main = function(){
 	account_details = {nickname: 'TCC EUR', 
 					   iban: 'GB05 BARC 2006 0574 7412 77', 
 					   bic_swift: 'BARCGB22', 
 					   acct_number: '74741277', 
 					   sort_code: '200605', 
 					   acct_ccy: 'EUR', 
 					   beneficiary_name: 'The Currency Cloud',
 					   destination_country_code: 'GB'};

	payment_details = {buy_currency: 'EUR', 
                       sell_currency: 'GBP', 
                       side: '1', 
                       amount: '2000'}

    cc_api = new CurrencyCloud('rachel.nienaber@thecurrencycloud.com', '1096bf354cd7396c33cde2f6393843ffd333be310242a2b972b1cabc978036ab')
 	cc_api.make_payment(account_details, payment_details, function(beneficiary, execution) {
 		console.log('BENEFICIARY ID: ' + beneficiary.beneficiary_id);
 		console.log('CLIENT RATE: ' + execution.client_rate);
 	});
}

if (require.main === module) {
    main();
}

