import { Http, RequestOptionsArgs, Request, Response, Headers, ConnectionBackend, RequestOptions, XHRBackend } from '@angular/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable()
export class CustomHttp extends Http {

  constructor(backend: XHRBackend, defaultOptions: RequestOptions) {
    super(backend, defaultOptions);
  };

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return super.request(url, this.addAccessToken(options));
  };
  
  get(url: string, options?: RequestOptionsArgs): Observable<Response>{
    return super.get(url, this.addAccessToken(options));
  };

  post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response>{
    return super.post(url, this.addAccessToken(options));
  };

  put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response>{
    return super.put(url, this.addAccessToken(options));
  };

  delete(url: string, options?: RequestOptionsArgs): Observable<Response>{
    return super.delete(url, this.addAccessToken(options));
  };

  patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response>{
    return super.patch(url, this.addAccessToken(options));
  };

  head(url: string, options?: RequestOptionsArgs): Observable<Response>{
    return super.head(url, this.addAccessToken(options));
  };

  options(url: string, options?: RequestOptionsArgs): Observable<Response>{
    return super.options(url, this.addAccessToken(options));
  };

  private addAccessToken(options) {
    if (!options) options = {};

    if (options.headers) options.headers.append('Access-Token', '@@ACCESSTOKEN');
    else options.headers = new Headers({'Access-Token': '@@ACCESSTOKEN'});

    return options;
  }
}