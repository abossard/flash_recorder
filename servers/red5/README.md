Red 5 Media Server
==================

Installation on Debian
----------------------

1. Checkout the Javacode with 
    svn co http://red5.googlecode.com/svn/java/server/trunk/ red5
1. Install openjdk (or Oracle's JDK)
    apt-get install openjdk-6-jdk
1. Change to the directory and built it
    cd red5
    ant clean dist
1. copy the content of the 'dist' directory to the location of your choice
1. copy the files from this 'webapps' directory into the webapps directory of your red5 instance
1. start the server with the red5.sh
    source red5.sh
1. finished

It stores the flv's within the 'webapps/record/streams' directory 