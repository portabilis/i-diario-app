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

  private studentsFrequency:any = []
  private classes:any = []
  private globalAbsence:boolean = false
  private students:any = []

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dailyFrequencyStudentService: DailyFrequencyStudentService,
    private loadingCtrl: LoadingController,
    private auth: AuthService) {
  }

  ionViewDidLoad() {
    this.studentsFrequency = this.navParams.get('frequencies').daily_frequencies
    this.globalAbsence = this.navParams.get('global')
    this.students = this.mountStudentList()
    this.classes = this.mountClassNumbers()
  }

  updateFrequency(frequency){
    const loader = this.loadingCtrl.create({
      content: "Carregando..."
    })
    loader.present();
    this.auth.currentUser().then((user) => {
      this.dailyFrequencyStudentService.updateFrequency(frequency.id, frequency.present, user.id).then((result) => {
        loader.dismiss()
      }).catch(error => {
        console.log(error)
        loader.dismiss()
      });
    });
  }

  private mountStudentList(){
    let students = this.studentsFrequency[0].students.map((student) => {
      return student.student
    })

    students.forEach((student) => {
      let studentFrequencies = []
      this.studentsFrequency.forEach((dailyFrequency) => {
        dailyFrequency.students.map((dailyFrequencyStudent) => {
          if(dailyFrequencyStudent.student.id == student.id){
            studentFrequencies.push(dailyFrequencyStudent)
          }
        })
      })

      student["frequencies"] = studentFrequencies
    });

    return students
  }

  private mountClassNumbers(){
    return this.studentsFrequency.map((studentFrequency) => {
      return studentFrequency.class_number
    })
  }

}
