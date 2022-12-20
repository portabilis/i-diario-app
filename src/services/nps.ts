import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { User } from '../data/user.interface';
import { environment } from '../environments/environment';

@Injectable()
export class NpsService {
  private user: User;
  constructor(
    private storage: Storage
  ){}

  public startNps(user: User) {
    this.user = user;
    this.setWootricSettings(() => {
      this.appendWootricScript();
    });
  }

  public stopNps() {
    this.user = undefined;
    if (window['WootricSurvey']) {
      window['WootricSurvey'].stop();
    }

    let npsScriptTag = document.getElementById('wootric-script-tag');
    if (npsScriptTag) {
      npsScriptTag.remove();
    }
  }

  private appendWootricScript() {
    let script = document.createElement('script');

    script.type = 'text/javascript';
    script.src = 'https://cdn.wootric.com/wootric-sdk.js';
    script.async = true;
    script.id = 'wootric-script-tag';
    script.onload = function() {
      window['WootricSurvey'].run();
    };

    document.body.appendChild(script);
  }

  private setWootricSettings(callback: Function) {
    this.storage.get('serverUrl').then(host => {
      window['wootric_survey_immediately'] = true; // Remover para produção
      window['wootric_no_surveyed_cookie'] = true;
      window['wootricSettings'] = {
        email: this.user.email,
        account_token: environment.npsAccountToken,
        external_id: this.user.id,
        created_at: new Date(this.user.created_at).getTime(),
        properties: {
          product: 'app',
          user_role: 'Professor',
          user_name: `${this.user.first_name} ${this.user.last_name}`,
          host: host
        }
      };
      callback();
    });
  }
}
