import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ApiProvider } from './providers/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'nodemcu';
  options: any;

  databaseAPI = 'https://nodemcudbapi.herokuapp.com';
  ngTunnel = 'https://chess.com'

  measures: any = [];

  constructor(
    private apiProvider: ApiProvider,
    private http : HttpClient
  ) { }

  async ngOnInit(): Promise<any> {
    await this.addingLoop();

  }

  async addingLoop(temperatura:any=[], humedad:any=[], xAxisData:any=[]):Promise<any>{
    await this.requests();

    const values:any = await this.getValues();
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
      const str = '21312ñ3lkad asd a <p>${T:29, H:54}$</p>213lkj1';

      const indexT = str.lastIndexOf('<p>${T:');
      const num:number = Number(`${str[indexT+7]}${str[indexT+8]}`);
      const indexH = str.lastIndexOf('}$</p>');
      const num2:number = Number(`${str[indexH-2]}${str[indexH-1]}`);

      // try {
      //   const connect = await this.http.get(this.ngTunnel).toPromise();
      //   console.log(connect);

      // } catch (error) {
      //   console.log(JSON.stringify(error));
      // }



      const values = {
        temperatura: num + ~~(Math.random() * (3 - (-3)) + (-3)),
        humedad: num2 + ~~(Math.random() * (3 - (-3)) + (-3)),
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
}
