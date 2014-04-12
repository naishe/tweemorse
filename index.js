/**
*	Morse Code Wiki: https://en.wikipedia.org/wiki/Morse_code
*/

var util 			= require('util'),
		twitter 	= require('twitter'),
		npa 			= require('npa')(),
		telnet		= require('telnet'),
		argv 			= require('optimist').argv;

var gpio = null;
if(!argv.nopi){
		gpio	= require('pi-gpio');
}

//TODO: message enqueueing
var MSG_Q 			= [],
		LED_PIN 		= 11,
    COUNTER 		= 0,
    UNIT_DELAY 	= 200,
		CHAR_GAP		= 1 * UNIT_DELAY,
		DIT					= 1 * UNIT_DELAY,
		DAH					= 3 * UNIT_DELAY,
		ONE_GAP			= 2 * UNIT_DELAY,
		TELNET_PORT	=	23;


var on = function(){
		console.log("ON");
		if(!argv.nopi){
    	gpio.write(LED_PIN, 1, function(){console.log("on");});
		}
};

var off = function(){
		console.log("OFF");
		if(!argv.nopi){
    	gpio.write(LED_PIN, 0, function(){console.log("off");});
		}
};

var twit = new twitter({
		consumer_key: 'ZAVlKw8RcifMlrqGMk8A',
    consumer_secret: 'hGt3S4csB4wRPCzO5WwM1WmOHqjD1x2CImnDeP79Q',
    access_token_key: '30669639-P2gSCtXMgjAKHwxlv0vXvEo7hMEvdRsnPqiOXJFRG',
    access_token_secret: 'CRIwV8A853VA6eyliRHRKlNP5P6uXLBBAST1hg7F7QBCl'
});

var intraCharGap = function(){
	console.log("GAP")
	off();
}

var displayMorse = function(message, loc){
	console.log('display morse: ' + message + ', loc: ' + loc);
	if( message.length <= loc ){
		return;
	}

	var i = loc; //lost in translation :)
	var sign = message[i];
	console.log("Sign: " + sign);
	if( sign == '.'){
		on();
		setTimeout(function(){
			intraCharGap();
			setTimeout(function() {
										displayMorse(message, ++i);
									}, CHAR_GAP);
			}, DIT);
	}else if( sign == '-'){
		on();
		setTimeout(function(){
			intraCharGap();
			setTimeout(function() {
										displayMorse(message, ++i);
									}, CHAR_GAP);
			}, DAH);
	}else if( sign == ' '){
		off();
		setTimeout(function(){
			displayMorse(message, ++i);
		}, ONE_GAP);
	}
}

 
function startStreaming(){
	console.log("Listening to Twitter...")
	twit.stream('user', {'track': 'naishe'}, function(stream){
			stream.on('data', function(data){
				console.log("Data: " + data.text);
				displayMorse(npa.toMorse(data.text), 0);
			});
	});
}

function startTelnet(){
	console.log("Starting a Telnet server at port: " + TELNET_PORT);
	telnet.createServer(function( client ) { 
		  client.on('data', function(data){
		  	console.log(">> incoming data: " + data);
		  	client.write(data);
				displayMorse(npa.toMorse(data), 0);
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
