var scopedClient = require('scoped-http-client');
var util = require('util');

module.exports = MangoPay;

function MangoPay(login, api_key){

    self = this;
    self.login = login;

    self.authorizationEncoded = 'Basic ' + new Buffer(login+ ":" +api_key).toString('base64');

    self.api_url = 'https://api.sandbox.mangopay.com/';

    self.encode = function(data){
        return JSON.stringify(data);
    }

    self.post = function(url, data, callback) {
        util.puts(self.api_url)
        util.puts(url)
        util.puts(self.authorizationEncoded)
        post_data = self.encode(data);
        scopedClient
            .create(self.api_url)
            .header('Content-Type', 'application/json')
            .header('Authorization', self.authorizationEncoded )
            .path(url)
            .post(post_data)(function(err, resp, body) {
            util.puts(body)
            callback(err, resp, JSON.parse(body));
        });
    }


    self.put = function(url, data, callback) {
        util.puts(self.api_url)
        util.puts(url)
        util.puts(self.authorizationEncoded)
        post_data = self.encode(data);
        scopedClient
            .create(self.api_url)
            .header('Content-Type', 'application/json')
            .header('Authorization', self.authorizationEncoded )
            .path(url)
            .put(post_data)(function(err, resp, body) {
            util.puts(body)
            callback(err, resp, JSON.parse(body));
        });
    }

    self.create_user = function(user, callback){
        url = "/v2/" + self.login + "/users/natural";
        self.post(url, user, function(err, resp, body) {
            callback(body);
        });
    }

    self.update_cardregistration = function(cardRegistrationId, registrationData, callback){
        var update_CardRegistration =  {
            RegistrationData : registrationData
        }

        url = "/v2/" + self.login + "/cardregistrations/" + cardRegistrationId;
        self.put(url, update_CardRegistration, function(err, resp, body) {
            callback(body);
        });
    }

    self.build_wallet = function(userId, currency, description){
        var wallet =  {
            Owners : [userId],
            Description : description,
            Currency : currency
        }
        return wallet;
    }

    self.build_cardRegistration = function(userId, currency){
        var cardregistration =  {
            UserId: userId.toString(),
            Currency: currency
        }

        util.puts(cardregistration)
        return cardregistration;
    }

    self.create_wallet = function(wallet, callback){
        url = "/v2/" + self.login + "/wallets";
        self.post(url,wallet, function(err,resp, body){
            callback(body)
        })
    }

    self.create_registrationcard = function(cardregistration, callback){
        url = "/v2/" + self.login + "/cardregistrations";
        self.post(url,cardregistration, function(err,resp, body){
            util.puts(body)
            callback(body)
        })
    }

}

var main = function(){
    var user = {
        FirstName: "Victor",
        LastName: "Hugo",
        Email:"etienne@leetchi.com",
        CountryOfResidence: "FR",
        Birthday : 1300186358,
        Nationality: "FR"
    };

    mangopay_api = new MangoPay("currencyholiday", "HNFz3i3eNyvQ7pqp0Wp33qaWmtoajKqZFxsfA95U3xMJ3C87EX")
    mangopay_api.create_user(user, function(data){
        var userId = data.Id;
        var wallet = self.build_wallet(data.Id, "EUR", "go to holiday!!")
        self.create_wallet(wallet, function(data){
            var cardregistration = self.build_cardRegistration(userId, "EUR")
            mangopay_api.create_registrationcard(cardregistration, function(registrationReturn){
                util.puts(registrationReturn.PreregistrationData)
            })
        })
    })

}

if (require.main === module) {
    main();
}





