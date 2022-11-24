import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  public readonly DELIMITER = `-`;
  public parsedDates: string[];

  public parse(value: string): NgbDateStruct | null {
    if (value) {
      const dateParts = value.trim().split(this.DELIMITER);
      this.parsedDates = [...dateParts];
      if (dateParts.length === 1 && this.isNumber(dateParts[0])) {
        const day = this.toInteger(dateParts[0]);
        return day >= 1 && day <= 31 ? { day, month: null, year: null } : null;
      } else if (dateParts.length === 2 && this.isNumber(dateParts[0]) && this.isNumber(dateParts[1])) {
        const day = this.toInteger(dateParts[0]);
        const month = this.toInteger(dateParts[1]);
        return (day >= 1 && day <= 31) && (month >= 1 && month <= 12) ? { day, month, year: null } : null;
      } else if (dateParts.length === 3 && this.isNumber(dateParts[0]) && this.isNumber(dateParts[1]) && this.isNumber(dateParts[2])) {
        const day = this.toInteger(dateParts[0]);
        const month = this.toInteger(dateParts[1]);
        const year = this.toInteger(dateParts[2]);
        return (day >= 1 && day <= 31)
          && (month >= 1 && month <= 12)
          && (this.parsedDates[2].length === 4) ?
          { day, month, year }
          : null;
      }
    }
    return null;
  }

  public toInteger(value: any): number {
    return parseInt(`${value}`, 10);
  }

  public isNumber(value: any): value is number {
    return !isNaN(this.toInteger(value));
  }

  public padNumber(value: number) {
    if (this.isNumber(value)) {
      return `0${value}`.slice(-2);
    } else {
      return ``;
    }
  }

  public format(date: NgbDateStruct | null): string {
    return date ? this.padNumber(date.day) + this.DELIMITER + this.padNumber(date.month) + this.DELIMITER + date.year : ``;
  }
}
