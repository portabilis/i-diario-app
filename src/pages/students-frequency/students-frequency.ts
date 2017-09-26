import { ConnectionService } from './../../services/connection';
import { Observable } from 'rxjs/Observable';
import { DailyFrequencyStudentsSynchronizer } from './../../services/offline_data_synchronization/daily_frequency_students_synchronizer';
import { DailyFrequenciesSynchronizer } from './../../services/offline_data_synchronization/daily_frequencies_synchronizer';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { Component } from '@angular/core';

import { DailyFrequencyStudentService } from '../../services/daily_frequency_student';
import { AuthService } from '../../services/auth';

@IonicPage()
@Component({
  selector: 'page-students-frequency',
  templateUrl: 'students-frequency.html',
})
export class StudentsFrequencyPage {

  private studentsFrequency: any = []
  private classes: any = []
  private globalAbsence: boolean = false
  private students: any = []
  private classroomId: number = null
  private disciplineId: number = null
  private frequencyDate: string = null
  private isSavingFrequencies : boolean = false
  private loadingCount: number = 0

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dailyFrequencyStudentService: DailyFrequencyStudentService,
    private loadingCtrl: LoadingController,
    private auth: AuthService,
    private storage: Storage,
    private dailyFrequenciesSynchronizer: DailyFrequenciesSynchronizer,
    private dailyFrequencyStudentsSynchronizer: DailyFrequencyStudentsSynchronizer,
    private connection: ConnectionService) {
  }

  ionViewDidLoad() {
    this.globalAbsence = this.navParams.get('global')

    if(this.globalAbsence){
      this.studentsFrequency = this.navParams.get('frequencies').daily_frequency
    }else{
      this.studentsFrequency = this.navParams.get('frequencies').daily_frequencies
    }

    this.students = this.mountStudentList()
    this.classes = this.mountClassNumbers()
    this.classroomId = this.findCurrentClassroom()
    this.disciplineId = this.findCurrentDiscipline()
    this.frequencyDate = this.findCurrentFrequencyDate()
  }

  updateFrequency(frequency, classNumber = null){
    this.auth.currentUser().then((user) => {
      const params = {
        id: frequency.id,
        present: frequency.present,
        classroomId: this.classroomId,
        disciplineId: this.disciplineId,
        studentId: frequency.student.id,
        classNumber: classNumber,
        userId: user.id,
        frequencyDate: this.frequencyDate
      }

      this.dailyFrequencyStudentService.updateFrequency(params).subscribe(
        (dailyFrequencyStudentsToSync) => {
          if(this.connection.isOnline){
            this.loadingCount++
            let loadingCountLocal = this.loadingCount
            this.isSavingFrequencies = true

            this.dailyFrequencyStudentsSynchronizer.sync(dailyFrequencyStudentsToSync).subscribe(
              () => {
              },
              () => {
              },
              () => {
                if (this.loadingCount == loadingCountLocal){
                  this.isSavingFrequencies = false
                }
              })
            }
          }
        )
    })
  }

  private mountStudentList(){

    if(this.globalAbsence){
      return this.studentsFrequency.students
    }

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
      student["frequencies"] = JSON.parse(JSON.stringify(studentFrequencies))
    });

    return students
  }

  private mountClassNumbers(){
    if(this.globalAbsence){ return [] }

    return this.studentsFrequency.map((studentFrequency) => {
      return studentFrequency.class_number
    })
  }

  private findCurrentDiscipline(){
    if(this.globalAbsence){
      return this.studentsFrequency.discipline_id
    }else{
      return this.studentsFrequency[0].discipline_id
    }
  }

  private findCurrentClassroom(){
    if(this.globalAbsence){
      return this.studentsFrequency.classroom_id
    }else{
      return this.studentsFrequency[0].classroom_id
    }
  }
  private findCurrentFrequencyDate(){
    if(this.globalAbsence){
      return this.studentsFrequency.frequency_date
    }else{
      return this.studentsFrequency[0].frequency_date
    }
  }

  goBack() {
    this.navCtrl.pop();
  }
}
