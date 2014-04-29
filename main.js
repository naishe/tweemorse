/**
*	Morse Code Wiki: https://en.wikipedia.org/wiki/Morse_code
*/

var util 			= require('util'),
		twitter 	= require('twitter'),
		npa 			= require('npa')(),
		telnet		= require('telnet'),
		argv 			= require('optimist').argv,
		queue			= require('queue-async');
		q					= require('q'),
		conf			= require('./config.js').conf;


var gpio = null;
if(!argv.nopi){
		gpio	= require('pi-gpio');
}

var	Q						= queue(1);
		LED_PIN 		= conf.LEDPin,
    COUNTER 		= 0,
    UNIT_DELAY 	= conf.delayInMillis,
		CHAR_GAP		= 1 * UNIT_DELAY,
		DIT					= 1 * UNIT_DELAY,
		DAH					= 3 * UNIT_DELAY,
		ONE_GAP			= 2 * UNIT_DELAY,
		GAP_BTW_MSG = 10 * UNIT_DELAY,
		TELNET_PORT	=	conf.telnetPort,
		DEBUG				= conf.verbose,
		USERS				= conf.users,
		KEYWORDS		= conf.keywords;


var on = function(){
		if(DEBUG){
			console.log("ON");
		}
		if(!argv.nopi){
    	gpio.write(LED_PIN, 1, function(){console.log("on");});
		}
};

var off = function(){
		if(DEBUG){
			console.log("OFF");
		}
		if(!argv.nopi){
    	gpio.write(LED_PIN, 0, function(){console.log("off");});
		}
};

var twit = new twitter({
		consumer_key: 				conf.twitter.consumerKey,
    consumer_secret: 			conf.twitter.consumerSecret,
    access_token_key: 		conf.twitter.accessTokenKey,
    access_token_secret: 	conf.twitter.accessTokenSecret
});

var intraCharGap = function(){
	if(DEBUG){
		console.log("GAP");
	}
	off();
}

var displayMorse = function(message, loc, callback){
	if(DEBUG){
		console.log('display morse: ' + message + ', loc: ' + loc);
	}
	if( message.length <= loc ){
		console.log("done: " + npa.fromMorse(message) +"\n------------\n");
		//sleep before processing the next message
		setTimeout(function(){console.log("ready.");callback(null, null);}, GAP_BTW_MSG);
		return;
	}

	var i = loc; //lost in translation :)
	var sign = message[i];
	if(DEBUG){
		console.log("Sign: " + sign);
	}
	if( sign == '.'){
		on();
		setTimeout(function(){
			intraCharGap();
			setTimeout(function() {
										displayMorse(message, ++i, callback);
									}, CHAR_GAP);
			}, DIT);
	}else if( sign == '-'){
		on();
		setTimeout(function(){
			intraCharGap();
			setTimeout(function() {
										displayMorse(message, ++i, callback);
									}, CHAR_GAP);
			}, DAH);
	}else if( sign == ' '){
		off();
		setTimeout(function(){
			displayMorse(message, ++i, callback);
		}, ONE_GAP);
	}

}

 
function startStreaming(){
	console.log("Listening to Twitter...");
	if(USERS && USERS.length >0){
		var usrs = USERS.join(',');
		console.log("Users to track: " + usrs)
		twit.stream('user', {'track': usrs}, function(stream){
				stream.on('data', function(data){
					console.log("Data: " + data.text);
					Q.defer(displayMorse, npa.toMorse(data), 0);
				});
		});
	}
	
	if(KEYWORDS && KEYWORDS.length > 0){
		var kw = KEYWORDS.join(",");
		console.log("Keywords to track: " + kw);
		twit.stream('statuses/filter', {'track': kw}, function(stream){
				stream.on('data', function(data){
					console.log("Data: " + data.text);
					Q.defer(displayMorse, npa.toMorse(data), 0);
				});
		});
	}
}

function startTelnet(){
	console.log("Starting a Telnet server at port: " + TELNET_PORT);
	telnet.createServer(function( client ) { 
		  client.on('data', function(data){
		  	console.log("Telnet data: " + data);
		  	client.write(data);
		  	Q.defer(displayMorse, npa.toMorse(data), 0);
		  }); 

	}).listen(TELNET_PORT);
}

function startListener(){
	if(argv.telnet){
		startTelnet();
	}else{
		startStreaming();
	}
}


if(argv.nopi){
	startListener();
}else{
	gpio.close(LED_PIN);
	gpio.open(LED_PIN, 'output', function(err){
			if(err) throw err;
			startListener();
	});
}
