import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpGetOptions, HttpPostOptions, HttpRequestOptions } from './interfaces';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError, first, retry } from 'rxjs/operators';
import { throwError, firstValueFrom, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiProvider {

  private _token!: string;


  constructor(private http : HttpClient) {

  }


  private getRequestOptions(options: HttpRequestOptions): any {
    let headers = (options.auth) ?
    new HttpHeaders({
      'Accept': 'application/json',
    })
    :
    new HttpHeaders({
      'Accept': 'application/json'
    });
    if(options.contentType){
      if(options.contentType === 'multipart/form-data'){
        headers = headers.append('enctype', 'multipart/form-data');
      }
    }
    return {headers, body: options.data, responseType: options.responseType || 'json', params: options.params }
  }

  public get(options: HttpGetOptions, _baseUrl:any) : any {
    if (options.auth){

    } else {
      const _vars = options.url.match(/{(.*?)}/g) || [];
      for(const _var of _vars){
        const _value = options.params[_var.replace(/\{|\}/gi, '')];
        options.url = options.url.replace(
          _var,
          encodeURIComponent(
            typeof _value === 'string' ? _value : JSON.stringify(_value)
          )
        );
      }
      const obs = this.http
        .get(
          !options.ignoreBase ? _baseUrl + options.url : options.url,
          this.getRequestOptions({
            auth: options.auth,
            contentType: options.contentType,
            responseType: options.responseType,
          })
        )
        .pipe(first())
      return firstValueFrom(obs);
    }
  }

  public post(options: HttpPostOptions, _baseUrl:any): any {
    if(options.auth){

    } else {
      const requestOptions: HttpRequestOptions = { auth: options.auth };
      if(options.isFile){
        requestOptions.responseType = 'arraybuffer';
      }
      const obs = this.http
        .post(_baseUrl + options.url, options.data, this.getRequestOptions(requestOptions))
        .pipe(first())
        .pipe(map(res => res))
      return firstValueFrom(obs);
    }
  }
}
