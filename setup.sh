#!/bin/bash
# base packages
sudo apt-get -y update
sudo apt-get -y install python-virtualenv git-core npm vim python-software-properties

# install and setup couchdb
sudo add-apt-repository ppa:longsleep/couchdb
sudo apt-get -y update && sudo apt-get -y install couchdb
sed -i 's/bind_address = 127.0.0.1/bind_address = 0.0.0.0/g' /etc/couchdb/default.ini
sudo service couchdb restart