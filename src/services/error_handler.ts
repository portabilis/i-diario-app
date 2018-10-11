import { ProService } from './pro';
import { MessagesService } from './messages';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class ErrorHanlderService {
  constructor(
    private alert: MessagesService,
    private pro: ProService
  ){}

  public handleError(title: string, message: string, code: number, error: string) {
    let subTitle = `<span class="error-code">Erro ${code}</span> ${message}`;

    this.pro.Exception(error);
    this.alert.showAlert(title, subTitle);
  }
}
