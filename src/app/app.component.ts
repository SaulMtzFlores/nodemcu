import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ApiProvider } from './providers/api';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'nodemcu';
  options: any;

  databaseAPI = 'https://nodemcudbapi.herokuapp.com';
  ngTunnel = ''

  measures: any = [];

  form: FormGroup = new FormGroup({
    url: new FormControl('https://corsproxynode.herokuapp.com/')
  });

  tempRequested:number = 0;
  humRequested:number = 0;

  constructor(
    private apiProvider: ApiProvider,
    private http : HttpClient
  ) { }

  async ngOnInit(): Promise<any> {
    await this.addingLoop();
  }

  async addingLoop(temperatura:any=[], humedad:any=[], xAxisData:any=[]):Promise<any>{
    if(this.ngTunnel){
      await this.requests();
      const values:any = await this.getValues();
      if(values.temperatura && values.humedad){
        temperatura.push(values.temperatura);
        humedad.push(values.humedad);
        xAxisData.push(this.esdate());


        this.options = {
          legend: {
            data: ['Temperatura °C', 'Humedad %'],
            align: 'left',
          },
          tooltip: {},
          xAxis: {
            data: xAxisData,
            silent: false,
            splitLine: {
              show: false,
            },
          },
          yAxis: {},
          series: [
            {
              name: 'Temperatura °C',
              type: 'bar',
              data: temperatura,
              animationDelay: (idx) => idx * 10,
            },
            {
              name: 'Humedad %',
              type: 'bar',
              data: humedad,
              animationDelay: (idx) => idx * 10 + 100,
            },
          ],
          animationEasing: 'elasticOut',
          animationDelayUpdate: (idx) => idx * 5,
        };

        if(temperatura.length>=10){
          temperatura.splice(0, 1);
          humedad.splice(0, 1);
          xAxisData.splice(0, 1);
        }
      }
    }

    setTimeout(async() => await this.addingLoop(temperatura, humedad, xAxisData), 1000)
  }

  esdate(showHour:boolean=true): string {
    const dateObj: Date = new Date();
    const dateInfo: any = {
      date: dateObj,
      day: dateObj.getDate(),
      month: dateObj.getMonth(),
      year: dateObj.getFullYear()
    }

    const date = `${dateInfo.day} de ${this.monthStr(dateInfo.month)} del ${dateInfo.year}`;
    return (showHour) ? `${this.hourStr(dateInfo.date)}.` : `${date}`;
  }


  monthStr(month:number): string {
    return [
      'enero', 'febrero', 'marzo', 'abril',
      'mayo', 'junio', 'julio', 'agosto',
      'septiembre', 'octubre', 'noviembre', 'diciembre'
    ][month];
  }

  hourStr(date: Date):string{
    let hours = date.getHours();
    let ampm= (hours >= 12) ? 'pm' : 'am';

    hours = hours % 12;
    hours = (hours) ? hours : 12;

    let minutes: any = date.getMinutes();
    let seconds: any = date.getSeconds();
    let mill: any = date.getMilliseconds();

    minutes = (minutes < 10) ? `0${minutes}`: minutes;
    seconds = (seconds < 10) ? `0${seconds}`: seconds;

    return `${hours}:${minutes}:${seconds} ${ampm}`;
  }

  async getValues():Promise<any>{
    try {
      try {
        const response = await this.http.get<any>(this.ngTunnel, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        }).toPromise();

      } catch (error) {
        const response:any = JSON.parse(JSON.stringify(error));
        const html = response.error.text;
        const htmlTagMatchTemp:string = '${T:<span id="temperature">'
        const temp = html.indexOf(htmlTagMatchTemp);
        const htmlTagMatchHum:string = ',H:<span id="humidity">';
        const hume = html.indexOf(htmlTagMatchHum);
        const readFromTemp = temp+htmlTagMatchTemp.length;
        const readFromHum = hume+htmlTagMatchHum.length;

        let tempStr:string='';
        let humeStr:string='';

        let char:string='';
        let index = 0;
        while(true){
          char = html[readFromTemp+index];
          if(char==='<'){ break } else { tempStr+=char; }
          index++;
        }
        index = 0; char = '';
        while(true){
          char = html[readFromHum+index];
          if(char === '<'){ break } else { humeStr+=char }
          index++;
        }

        console.log('Temperatura: ', tempStr,' Humedad:', humeStr);
        if(Number(tempStr) && Number(humeStr)){
          this.tempRequested = Number(tempStr);
          this.humRequested = Number(humeStr);
        }else{
          this.tempRequested = 0;
          this.humRequested = 0;
        }
      }



      const values = {
        temperatura: this.tempRequested,
        humedad: this.humRequested,
        fecha: new Date()
      }

      await this.apiProvider.post({
        url: `/measures`,
        auth: false,
        data: values
      }, this.databaseAPI);

      return values
    } catch (error) {
      console.log(error);
    }
  }

  async requests():Promise<any>{
    const response = await this.apiProvider.get({
      url: '/measures',
      auth: false
    },this.databaseAPI);

    this.measures = response.data;
  }

  setTunel(){
    const data:any =  this.form.getRawValue();
    if(!data || !data.url){
      return;
    }
    this.ngTunnel = data.url;
  }
}
