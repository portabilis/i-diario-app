import { Storage } from '@ionic/storage';
import { UtilsService } from './../../services/utils';
import { AuthService } from './../../services/auth';
import { FrequencyPage } from './../frequency/frequency';
import { Unity } from './../../data/unity.interface';
import { UnitiesService } from './../../services/unities';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-frequency-index',
  templateUrl: 'frequency-index.html'
})
export class FrequencyIndexPage {
  private user: any;
  shownGroup = null;
  lastFrequencyDays = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private loadingCtrl: LoadingController,
              private unitiesService: UnitiesService,
              private auth: AuthService,
              private utilsService: UtilsService,
              private storage: Storage) {
  }

  ionViewWillEnter(){
    this.auth.currentUser().then((user) => {
      this.user = user;
    });

    this.storage.get('frequencies').then((frequencies) => {
      if (frequencies) {
        this.lastFrequencyDays = this.lastTenDays(frequencies.daily_frequencies);
      }
    });
  }

  newFrequency() {
    const loading = this.loadingCtrl.create({
      content: 'Carregando...'
    });
    loading.present();
    this.unitiesService.getUnities(this.user.teacher_id).subscribe(
      (unities: Unity[]) => {
        this.navCtrl.push(FrequencyPage, { "unities": unities });
      },
      (error) => {
        console.log(error)
      },
      () => {
        loading.dismiss();
      });
  }

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
        this.shownGroup = null;
    } else {
        this.shownGroup = group;
    }
  };

  isGroupShown(group) {
      return this.shownGroup === group;
  };

  private lastTenDays(frequencies) {
    var lastDays = [];

    for (var day = 0; day < 10; day++) {
      var lastDay = new Date();
      lastDay.setDate(lastDay.getDate()-day);

      let shortDate = this.utilsService.toStringWithoutTime(lastDay);
      let frequenciesOfDay = this.frequenciesOfDay(frequencies, shortDate);

      lastDays[day] = {
        date: shortDate,
        format_date: this.utilsService.toExtensiveFormat(lastDay),
        exists: frequenciesOfDay.length > 0,
        unities: this.unitiesOfFrequency(frequenciesOfDay)
      };
    }
    return lastDays;
  }

  private frequenciesOfDay(frequencies, date) {
    return frequencies.filter((frequency) => frequency.frequency_date == date);
  }

  unitiesOfFrequency(frequencies) {
    if (!frequencies) return null;
    let unities = new Array();
    frequencies.forEach(frequency => {
      if (unities.filter((unity) => unity.id == frequency.unity_id).length == 0) {
        unities.push({
          id: frequency.unity_id,
          name: frequency.unity_name,
          classes: this.classesOfUnityFrequency(frequencies, frequency.unity_id)
        });
      }
    });
    return unities;
  }

  classesOfUnityFrequency(frequencies, unity_id) {
    let frequenciesOfUnity = frequencies.filter((frequency) => frequency.unity_id = unity_id);
    let classes = new Array();
    frequenciesOfUnity.forEach(frequency => {
      if (classes.filter((classroom) => classroom.id == frequency.classroom_id).length == 0) {
        classes.push({
          id: frequency.classroom_id,
          name: frequency.classroom_name
        });
      }
    });
    return classes;
  }
}