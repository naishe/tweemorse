Tweemorse
=========

This is a fun projector with [RaspberryPi](http://www.raspberrypi.org/) and Node.js. This project basically takes your Twitter credentials and, users and keywords that you wanted to follow. Then it streams data from Twitter, extracts the message from it, converts it to [MorseCode](en.wikipedia.org/wiki/Morse_code), and turns the LED or beeper attached to the specified pin (default: 11) in ON or OFF based on generated Morse code.

####Configuration
If you want to drive the output (LED, beeper) from Twitter. You will have to configure your credentials from Twitter. To do that, you may need to create a Twitter app on https://apps.twitter.com/. Once you have create the app, you can use the credentials to fill the following fields in the `config.js` file.

    conf.twitter.consumerKey = "YOUR_CONSUMER_KEY";
    conf.twitter.consumerSecret = "YOUR_CONSUMER_SECRET";
    conf.twitter.accessTokenKey = "YOUR_ACCESS_TOKEN_KEY";
    conf.twitter.accessTokenSecret = "YOUR_ACCESS_TOKEN_SECRET";

Replace those all-caps placeholder with real values. You can now go ahead and edit the following fields to follow the desired users or keywords:

    conf.users = ["naishe", "substack"];
    conf.keywords = ["raspberrypi", "#wtf"];

You can play with rest of the configuration if you want.


###Running the application
To be able to run the application, you need to have the following stuffs:

1. Node.js on RaspberryPi
2. RaspberryPi Connected to the internet
3. A Twitter account

####Installing Node.js on Raspbian

Install `Node.js` on your RaspberryPi. There are many tutorials on web ([here](https://learn.adafruit.com/raspberry-pi-hosting-node-red/setting-up-node-dot-js) and [here](http://joshondesign.com/2013/10/23/noderpi)). One of the ways to get Node on Raspbian is running the following commands on terminal.

    # Update the list of software
    sudo apt-get update
    
    # Install the latest of software
    sudo apt-get upgrade
    
    # Dowlaod the latest Node.js installer
    sudo wget http://node-arm.herokuapp.com/node_latest_armhf.deb
    
    # Install the downloaded file
    sudo dpkg -i node_latest_armhf.deb
    
    # Check if Node is installed properly
    node -v

####Installing this application
To install the application, you will need to download it from github and then install the libraries. Here is how you do it:

    # checkout code from github
    git clone https://github.com/naishe/tweemorse.git
    cd tweemorse/
    
    # install the libraries
    sudo npm install
    
    # edit the config file to fill up your Twitter credentials
    # set the users and/or keywords you want to follow
    vi config.js 
    
    # test if it starts without any error
    sudo node main.js --nopi --telnet

####Having fun with Telnet
If you did not want to use Twitter, and just want to send message to your Pi to display it in Morse code. Start the application in Telnet mode by using option `--telnet`. Then you can connect to the telnet server running on RaspberryPi, and send it messages that will be displayed as Morse Code. Here is what you need to do:

**On RaspberryPi:**

    # go to the tweemorse directory
    cd tweemorse
    
    # start tweemorse in telnet mode.
    # this will start a telnet server listening to port 23 by default
    sudo node main.js --telnet
    
**On your machine:**

    #Assuming the IP address to RaspberryPi is 192.168.1.42
    telnet 192.168.1.42 23
    
    #Now send messages and see LED glow!
    
###Miscelleneous

1. If you just wanted to run this application on your computer and not on RaspberryPi. Install it on your machine, and start the application with `--nopi` option.

        sudo node main.js --nopi
        
        #Or, in Telnet mode
        sudo node main.js --nopi --telnet
2. You can change Telnet port from `config.js` file.
3. To increase of decrease the duration of blink, you will need to edit `config.js` and change `conf.delayInMillis`
4. To increase the verbosity of the application console output set `conf.verbose = true;` in `config.js`.

Have fun!
naishe

> Written with [StackEdit](https://stackedit.io/).