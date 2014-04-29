var conf = {};

//Twitter configuration
conf.twitter = {};
conf.twitter.consumerKey = "YOUR_CONSUMER_KEY";
conf.twitter.consumerSecret = "YOUR_CONSUMER_SECRET";
conf.twitter.accessTokenKey = "YOUR_ACCESS_TOKEN_KEY";
conf.twitter.accessTokenSecret = "YOUR_ACCESS_TOKEN_SECRET";

//Logging configuration
conf.verbose = false;

//Physical pin on RaspberryPi which the LED or BEEPER or both attached to
conf.LEDPin	= 11;

// the smallest delay, everything is scaled with this
// dit = 1 delay, dah = 3 delays, <space> = 2 delays, delay between two characters = 1 delay.
conf.delayInMillis = 200;

//Telnet port
conf.telnetPort = 23;

//users to track. Provide array of users you want to track
conf.users = ["naishe", "substack"];

//array keywords that you may want to track
conf.keywords = ["raspberrypi", "#wtf"];

exports.conf = conf;
