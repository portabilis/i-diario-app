#!/bin/bash
# Portabilis Build Script
# Script to create platform builds
# Build platforms: ios, android
# Build types: debug, release
# Run: ./build {platform} {build_type} {build_version} {token_hash}
# Example: $ ./build android debug 40 J5YiOFRD&a|hH_~:Gsr`~hrT~Cr{II6`e?h<z0MBovb`1L18d68Y7W9@uJx8H7m

PLATFORM_DEFAULT="android"
VERSION_DEFAULT=0
TYPE_DEFAULT="debug"

PLATFORM=${1:-$PLATFORM_DEFAULT}
TYPE=${2:-$TYPE_DEFAULT}
VERSION=${3:-$VERSION_DEFAULT}
TOKEN=${4}

if [ "$PLATFORM" = "help" ] ; then
    echo "Portabilis Build Script

Script to create platform builds

Build platforms: ios, android
Build types: debug, release

Run: ./build {platform} {build_type} {build_version} {token_hash}
Example: $ ./build android debug 40 3DF1B9A6D1F484EF36D6A476122FE"
    exit
fi

echo "Setting Token"
sed -i -e 's/@@ACCESSTOKEN/'$TOKEN'/g' ../src/services/custom_http.ts

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
            ionic monitoring syncmaps
            ionic cordova build android --release --prod
            jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ../app_offline.keystore ../platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk app_offline
            rm -f ./android-release-$VERSION.apk
            $ANDROID_BUILDTOOLS_VERSION_PATH/zipalign -v 4 ../platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk ./android-release-$VERSION.apk
            echo ">>> Build finished <<<"
        fi
    else
        if [ "$TYPE" = "debug" ] ; then
            echo "Generating the debug Android build"
            ionic monitoring syncmaps
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
            ionic monitoring syncmaps
            ionic cordova build ios --release --prod
            echo ">>> Build finished <<<"
        else
            if [ "$TYPE" = "debug" ] ; then
                echo "Generating the debug iOS build"
                ionic monitoring syncmaps
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