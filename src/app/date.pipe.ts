import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'esdate'
})
export class DatePipe implements PipeTransform {

  transform(value:string, showHour:boolean=true): string {
    const dateObj: Date = new Date(value);
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
}
