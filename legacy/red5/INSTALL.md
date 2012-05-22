System configuration

apt-get update
apt-get upgrade

Add testing to the Debian packages sources (to get a newer version of Red5)

echo deb http://ftp.de.debian.org/debian testing main contrib non-free >> /etc/apt/sources.list
echo deb http://ftp.de.debian.org/debian unstable main contrib non-free >> /etc/apt/sources.list
echo deb http://www.debian-multimedia.org unstable main >> /etc/apt/sources.list

Add this content to the file cat /etc/apt/preferences.d/pinning

Package: *
Pin: release a=stable
Pin-Priority: 1000

Package: *
Pin: release a=testing
Pin-Priority: 900

Package: *
Pin: release a=unstable
Pin-Priority: 800

Then install the super newest red5 server:

apt-get install -t unstable red5-server red5-doc

This will install around 221 packages with a total of almost 880 MB

check that the server is running:

netstat -l

Look for the line 
tcp6       0      0 [::]:5080               [::]:*                  LISTEN

That means its there.

Access the Webinterface of the server
http://178.77.73.247:5080/

Update your IP Adress in the settings
sed -i -e "s/0.0.0.0/178.77.73.247/" /etc/red5/red5.properties

Copy the mystory directory into /var/lib/red5/webapps (please be in the same directory as this INSTALL file)
cp -r webapps/mystory /var/lib/red5/webapps

Now its a good time to restart the server:
/etc/init.d/red5-server restart

Change the owner of the files
find /var/lib/red5/webapps/ -type d -exec chown _red5 {} \;

Install conversion chain
apt-get -t unstable install ffmpeg2theora ffmpeg

Install Red5 from Subversion:
svn checkout http://red5.googlecode.com/svn/java/server/trunk/ red5-read-only
cd red5-read-only
ant dist