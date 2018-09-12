#!/bin/bash
# Portabilis Build Script
# Script to create platform builds
# Build platforms: ios, android
# Build types: debug, release
# Run: ./build {platform} {build_type} {build_version}
# Example: $ ./build android debug 40

PLATFORM_DEFAULT="android"
VERSION_DEFAULT=0
TYPE_DEFAULT="debug"

PLATFORM=${1:-$PLATFORM_DEFAULT}
TYPE=${2:-$TYPE_DEFAULT}
VERSION=${3:-$VERSION_DEFAULT}

if [ "$PLATFORM" = "help" ] ; then
    echo "Portabilis Build Script

Script to create platform builds

Build platforms: ios, android
Build types: debug, release

Run: ./build {platform} {build_type} {build_version}
Example: $ ./build android debug 40"
    exit
fi

if [ "$PLATFORM" = "android" ] ; then
    echo ">>> Starting steps for Android build <<<"

    if [ "$TYPE" = "release" ] ; then
        echo "Generating the release Android build"

        ANDROID_BUILDTOOLS_VERSION_PATH="$(ls -td ~/Library/Android/sdk/build-tools/* | head -n 1)"

        echo "$ANDROID_BUILDTOOLS_VERSION_PATH"
        if [ -z "$ANDROID_BUILDTOOLS_VERSION_PATH" ] ; then
            echo "ERROR: Android Build Tools not found!"
            echo "Please, verify if Android Studio is installed."
        else
            ionic cordova build android --release --prod
            jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ../app_offline.keystore ../platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk app_offline
            rm -f ./android-release-$VERSION.apk
            $ANDROID_BUILDTOOLS_VERSION_PATH/zipalign -v 4 ../platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk ./android-release-$VERSION.apk
            echo ">>> Build finished <<<"
        fi
    else
        if [ "$TYPE" = "debug" ] ; then
            echo "Generating the debug Android build"
            ionic cordova build android --debug
            cp -vf ../platforms/android/app/build/outputs/apk/debug/app-debug.apk .
            echo ">>> Build finished <<<"
        else
            echo "ERROR: Build type invalid!"
        fi
    fi

else
    if [ "$PLATFORM" = "ios" ] ; then
        echo ">>> Starting steps for iOS build <<<"

        if [ "$TYPE" = "release" ] ; then
            echo "Generating the release iOS build"
            ionic cordova build ios --prod --release
            echo ">>> Build finished <<<"
        else
            if [ "$TYPE" = "debug" ] ; then
                echo "Generating the debug iOS build"
                ionic cordova build ios --debug
                echo ">>> Build finished <<<"
            else
                echo "ERROR: Build type invalid!"
            fi
        fi
    else
        echo "ERROR: Platform invalid!"
    fi
fi