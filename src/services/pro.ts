import { Injectable } from '@angular/core';
import { Pro } from '@ionic/pro';

@Injectable()
export class ProService {
  constructor(

  ){}

  public Exception(error) {
    Pro.monitoring.exception(new Error(error));
  }
}