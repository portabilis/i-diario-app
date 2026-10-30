import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ionicframework.appoffline153013',
  appName: 'Portábilis Diário',
  webDir: 'www',
  server: {
    androidScheme: 'https',
  },
  cordova: {
    preferences: {
      ScrollEnabled: 'false',
      hostname: 'localhost',
      AndroidInsecureFileModeEnabled: 'true',
      'android-minSdkVersion': '22',
      'android-targetSdkVersion': '36',
      BackupWebStorage: 'none',
      SplashMaintainAspectRatio: 'true',
      FadeSplashScreenDuration: '300',
      SplashShowOnlyFirstTime: 'false',
      SplashScreen: 'screen',
      SplashScreenDelay: '3000',
      'android-build-tool': 'gradle',
      WKWebViewOnly: 'true',
      CordovaWebViewEngine: 'CDVWKWebViewEngine',
      icon_folder: 'mipmap',
      icon_name: 'ic_launcher',
    },
  },
};

export default config;
