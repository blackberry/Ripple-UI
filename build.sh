#!/bin/bash

#clear build_output directory
rm -fr build_output
mkdir build_output

#call jake
jake > build_output/jake.txt
export BUILD_STATUS=$?
#echo $BUILD_STATUS

#if jake was good then run jake tests
if [ $BUILD_STATUS = 0 ]; then 
        jake test > build_output/jaketest.txt
        TEST_STATUS=$?
        #echo $TEST_STATUS
        zip -9 -r build_output/ripple_ui.zip  ../ripple_build
        exit $TEST_STATUS
fi
echo $TEST_STATUS        
exit $BUILD_STATUS

