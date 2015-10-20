#!/bin/sh

mount -o rw,remount /

# -- Disable watchdogs in /jci/sm/sm.conf to avoid boot loops if smthing goes wrong --

# backup first
cp -a /jci/sm/sm.conf /jci/sm/sm.conf.bak

# edit now
sed -i 's/watchdog_enable="true"/watchdog_enable="false"/g' /jci/sm/sm.conf
sed -i 's|args="-u /jci/gui/index.html"|args="-u /jci/gui/index.html --noWatchdogs"|g' /jci/sm/sm.conf


# -- Enable userjs and allow file XMLHttpRequest in /jci/opera/opera_home/opera.ini --

# backup first
cp -a /jci/opera/opera_home/opera.ini /jci/opera/opera_home/opera.ini.bak

# edit now
sed -i 's/User JavaScript=0/User JavaScript=1/g' /jci/opera/opera_home/opera.ini
count=$(grep -c "Allow File XMLHttpRequest=" /jci/opera/opera_home/opera.ini)
if [ "$count" = "0" ]; then
    sed -i '/User JavaScript=.*/a Allow File XMLHttpRequest=1' /jci/opera/opera_home/opera.ini
else
    sed -i 's/Allow File XMLHttpRequest=.*/Allow File XMLHttpRequest=1/g' /jci/opera/opera_home/opera.ini
fi


# if user has already used the earlier version
# backup and "disable" it
mv /jci/opera/opera_dir/userjs/speedometer.js /jci/opera/opera_dir/userjs/speedometer.js.bak
mv /jci/opera/opera_dir/userjs/mySpeedometer.js /jci/opera/opera_dir/userjs/mySpeedometer.js.bak
mv /jci/opera/opera_dir/userjs/fps.js /jci/opera/opera_dir/userjs/fps.js.bak
mv /jci/scripts/stage_wifi.sh /jci/scripts/stage_wifi.sh.bak
mv /jci/scripts/get-vehicle-speed.sh /jci/scripts/get-vehicle-speed.sh.bak

#
cp -a jci/opera/opera_dir/userjs/addon-startup.js /jci/opera/opera_dir/userjs/
cp -a jci/scripts/* /jci/scripts/
cp -a jci/gui/addon-* /jci/gui/
cp -a bin/busybox-armv7l /bin/

# 
chmod 755 /jci/gui/addon-common/*.js

chmod 755 /jci/gui/addon-speedometer/*.js
chmod 666 /jci/gui/addon-speedometer/speedCurrent

chmod 755 /jci/gui/addon-player/*.js
chmod 666 /jci/gui/addon-player/myVideoList
chmod 666 /jci/gui/addon-player/playback*
chmod 755 /jci/gui/addon-player/playback-action.sh

chmod 755 /jci/scripts/stage_wifi.sh
chmod 755 /jci/scripts/get-vehicle-speed.sh

#
chmod 755 /bin/busybox-armv7l
rm -f /usr/bin/nc
ln -s /bin/busybox-armv7l /usr/bin/nc

/jci/tools/jci-dialog --title="Installation Completed" --text="Please reboot your system now" --ok-label='OK' --no-cancel &