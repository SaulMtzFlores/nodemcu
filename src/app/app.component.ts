import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'nodemcu';
  options: any;
  constructor() { }

  async ngOnInit(): Promise<any> {
    await this.addingLoop();
  }

  async addingLoop(temperatura:any=[], humedad:any=[], xAxisData:any=[]):Promise<any>{
    console.log('Heee');

    const values:any = this.getValues();
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

  getValues(){
    return {
      temperatura: 29 + ~~(Math.random() * (3 - (-3)) + (-3)),
      humedad: 54 + ~~(Math.random() * (3 - (-3)) + (-3))
    }
  }
}
