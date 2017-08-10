import { ConnectionService } from './../../services/connection';
import { OfflineDataPersisterService } from './../../services/offline_data_persistence/offline_data_persister';
import { UnitiesPersisterService } from './../../services/offline_data_persistence/unities_persister';
import { Storage } from '@ionic/storage';
import { UtilsService } from './../../services/utils';
import { AuthService } from './../../services/auth';
import { FrequencyPage } from './../frequency/frequency';
import { Unity } from './../../data/unity.interface';
import { UnitiesService } from './../../services/unities';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-frequency-index',
  templateUrl: 'frequency-index.html'
})
export class FrequencyIndexPage {
  private user: any;
  shownGroup = null;
  lastFrequencyDays = null;
  emptyFrequencies = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private unitiesService: UnitiesService,
    private auth: AuthService,
    private utilsService: UtilsService,
    private storage: Storage,
    private unitiesPersister: UnitiesPersisterService,
    private alertCtrl: AlertController,
    private offlineDataPersister: OfflineDataPersisterService,
    private connectionService: ConnectionService
  ) {}

  ionViewWillEnter(){
    if (this.connectionService.isOnline) {
      this.auth.currentUser().then((user) => {
        this.user = user;
        this.refreshFrequencies(user);
      });
    } else {
      this.loadFrequencies();
    }
  }

  refreshFrequencies(user){
    const loading = this.loadingCtrl.create({
      content: 'Aguarde, estamos deixando tudo pronto para você.'
    })
    loading.present()
    this.offlineDataPersister.persist(user).subscribe(
      (result) => {
      },
      (error) => {
        loading.dismiss()
        this.showErrorAlert()
      },
      () => {
        loading.dismiss()
        this.loadFrequencies()
      }
    )
  }

  showErrorAlert() {
    let alert = this.alertCtrl.create({
      title: 'Erro',
      subTitle: 'Não foi possível realizar a sincronização.',
      buttons: ['OK']
    });
    alert.present();
  }

  loadFrequencies() {
    this.storage.get('frequencies').then((frequencies) => {
      if (frequencies) {
        this.lastFrequencyDays = this.lastTenFrequencies(frequencies.daily_frequencies);
        this.emptyFrequencies = false;
      }else{
        this.emptyFrequencies = true;
      }
    });
  }

  newFrequency() {
    this.storage.get('unities').then((unities) => {
      this.navCtrl.push(FrequencyPage, { "unities": unities });
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

  private sortDesc(a,b){
    return b > a
  }

  private lastTenFrequencies(frequencies) {

    let uniqueDates:any = []
    frequencies.forEach(frequency => {
      if(!uniqueDates.includes(frequency.frequency_date)){
        uniqueDates.push(frequency.frequency_date)
      }
    });

    uniqueDates.sort(this.sortDesc)

    var lastDays = []
    uniqueDates.forEach((uniqueDate, index) => {
      var lastDay = new Date(uniqueDate);

      let shortDate = this.utilsService.toStringWithoutTime(lastDay);
      let frequenciesOfDay = this.frequenciesOfDay(frequencies, shortDate);

      lastDays[index] = {
        date: shortDate,
        format_date: this.utilsService.toExtensiveFormat(lastDay),
        exists: frequenciesOfDay.length > 0,
        unities: this.unitiesOfFrequency(frequenciesOfDay)
      };
    })

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

  doRefresh(refresher) {
    this.offlineDataPersister.persist(this.user).subscribe(
      () => {
      },
      (error) => {
        this.utilsService.showRefreshPageError();
        refresher.cancel();
      },
      () => {
        this.loadFrequencies();
        refresher.complete();
        this.emptyFrequencies = false;
      }
    );
  }
}