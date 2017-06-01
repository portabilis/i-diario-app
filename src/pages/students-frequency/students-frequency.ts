import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { Component } from '@angular/core';

import { DailyFrequencyStudentService } from '../../services/daily_frequency_student';
import { AuthService } from '../../services/auth';

@IonicPage()
@Component({
  selector: 'page-students-frequency',
  templateUrl: 'students-frequency.html',
})
export class StudentsFrequencyPage {

  private studentsFrequency:any = [];
  private classes:any = [];
  private globalAbsence:boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dailyFrequencyStudentService: DailyFrequencyStudentService,
    private loadingCtrl: LoadingController,
    private auth: AuthService) {
  }

  ionViewWillLoad() {
    this.studentsFrequency = this.navParams.data.students;
    this.classes = this.navParams.data.classes;
    this.globalAbsence = this.navParams.data.global;
  }

  updateFrequency(frequency){
    const loader = this.loadingCtrl.create({
      content: "Carregando..."
    })
    loader.present();
    this.auth.currentUser().then((user) => {
      this.dailyFrequencyStudentService.updateFrequency(frequency.id, frequency.present, user.id).then(result => {
        loader.dismiss();
      }).catch(error => {
        console.log(error);
        loader.dismiss();
      });
    });
  }

}
