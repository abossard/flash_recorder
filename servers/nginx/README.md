nginx rtmp module
==================

Somehow I did not yet manage to let it actually record a movie :-(

Installation on Debian
----------------------

1. Install build-essential and other stuff
    apt-get install build-essential libpcre3-dev zlib1g-dev libssl-dev
1. checkout the latest source from https://github.com/arut/nginx-rtmp-module
    git clone https://github.com/arut/nginx-rtmp-module.git
1. Download the latest stable source from http://nginx.org
1. change to the nginx source directory and build it
    ./configure --add-module=../nginx-rtmp-module/
    make
    make install
1. it will be installed in /usr/local/nginx
1. check nginx.conf
1. copy nginx.conf to the /usr/local/nginx/conf directory
1. it won't work somehow, but I didn't figure out why