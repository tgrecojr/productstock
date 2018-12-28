var config = require('config');
var request = require('request');
var cheerio = require('cheerio');
var MY_SLACK_WEBHOOK_URL = config.get('productstock.slack_webhook')
var slack = require('slack-notify')(MY_SLACK_WEBHOOK_URL);
var minutes = 5, the_interval = minutes * 60 * 1000;

setInterval(function() {
    request(config.get('productstock.product_url'), function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            $('#product_inventory').each(function(i, element){
                if (i ==1){
                    stock = $(this).text();
                    if (stock.startsWith("0")){
                        var today = new Date();
                        console.log(today + " - Product still has no availability")
                    }else{
                        slack.alert(stock);
                    }

                }

            });
        }
    });
}, the_interval);
