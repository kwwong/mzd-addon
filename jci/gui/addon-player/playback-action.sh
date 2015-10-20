#!/bin/sh

TXTPATH=/jci/gui/addon-player/

ACTIONFILE=playbackAction
PLAYBACKACTION=${TXTPATH}${ACTIONFILE}

LISTFILE=myVideoList
MYVIDEOLIST=${TXTPATH}${LISTFILE}

OPTIONFILE=playbackOption
PLAYBACKOPTION=${TXTPATH}${OPTIONFILE}

STATUSFILE=playbackStatus
PLAYBACKSTATUS=${TXTPATH}${STATUSFILE}

NCOPTION="-l -p 54321"

REQUEST=`cat ${PLAYBACKACTION} | grep 'GET '`
echo '' > ${PLAYBACKACTION}

if [ -z "${REQUEST}" ]
then
	GSTLAUNCH=`ps | grep 'gst-launch' | grep -v grep`
	echo "${GSTLAUNCH}" > ${PLAYBACKSTATUS}
	
	NC=`ps | grep 'nc -l' | grep -v grep`
	if [ -z "${NC}" ]
	then
		nc ${NCOPTION} > ${PLAYBACKACTION} &
	fi
	exit
fi

if [ ! -z "${REQUEST}" ]
then
	killall nc
	
	ACTION=$(echo ${REQUEST} | grep 'start-playback')
	if [ ! -z "${ACTION}" ]
	then
		GSTLAUNCH=`ps | grep 'gst-launch' | grep -v grep`
		if [ -z "${GSTLAUNCH}" ]
		then
			VIDEOFILE=$(echo ${ACTION} | cut -d'&' -f 2)
			if [ ! -z "${VIDEOFILE}" ] && [ -e "${VIDEOFILE}" ]
			then
				echo 1 > /proc/sys/vm/drop_caches
				/usr/bin/gst-launch --gst-fatal-warnings playbin2 uri=file://${VIDEOFILE} video-sink="mfw_v4lsink disp-height=416" audio-sink="alsasink" buffer-size="0" buffer-duration="0" &
			fi
		fi
	fi
	
	ACTION=$(echo ${REQUEST} | grep 'stop-playback')
	if [ ! -z "${ACTION}" ]
	then
		killall gst-launch-0.10
	fi
	
	ACTION=$(echo ${REQUEST} | grep 'get-video-list')
	if [ ! -z "${ACTION}" ]
	then
		echo '' > ${MYVIDEOLIST}
		VIDEOS=''
		for USB in a b c d e
		do
			USBPATH=/tmp/mnt/sd${USB}1
			for VIDEO in "${USBPATH}"/*.mp4  
			do
				VIDEONAME=$(echo ${VIDEO} | cut -d'/' -f 5)
				VIDEOCHECK=${VIDEONAME:0:1}
				if [ "${VIDEOCHECK}" != "*" ]
				then
					VIDEOS="${VIDEOS}<li data='${VIDEO}'>${VIDEONAME}</li>"
				fi
			done
		done
		if [ ! -z "${VIDEOS}" ]
		then
			VIDEOS="<ul id='myVideoListUl'>${VIDEOS}</ul>"
			echo "${VIDEOS}" > ${MYVIDEOLIST}
		fi
	fi
	
	ACTION=$(echo ${REQUEST} | grep 'reboot-system')
	if [ ! -z "${ACTION}" ]
	then
		/jci/tools/jci-dialog --confirm --title="Reboot System" --text="Click OK to reboot the system"
		if [ $? != 1 ]
		then
			reboot
			exit
		fi
	fi
	
	ACTION=$(echo ${REQUEST} | grep 'set-playback-option')
	if [ ! -z "${ACTION}" ]
	then
		PLAYALL=$(echo ${ACTION} | cut -d'&' -f 2 | cut -d'=' -f 2)
		REPEAT=$(echo ${ACTION} | cut -d'&' -f 3 | cut -d'=' -f 2)
		OPTION={\"playall\":\"${PLAYALL}\",\"repeat\":\"${REPEAT}\"}
		echo "${OPTION}" > ${PLAYBACKOPTION}
	fi
	
	nc ${NCOPTION} > ${PLAYBACKACTION} &
fi

exit