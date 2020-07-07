import _ from 'lodash';

export default class GUID {
  date: Date;

  constructor() {
    this.date = new Date();
  }

  generate() {
    this.date = new Date();
    let guidStr = '';
    const hexDate: string = this.hexadecimal(this.getGUIDDate(), 16);
    const hexTime: string = this.hexadecimal(this.getGUIDTime(), 16);
    for (let i = 0; i < 9; i++) {
      guidStr += Math.floor(Math.random() * 16).toString(16);
    }
    guidStr += hexDate;
    guidStr += hexTime;
    while (guidStr.length < 32) {
      guidStr += Math.floor(Math.random() * 16).toString(16);
    }
    return this.formatGUID(guidStr);
  }

  getGUIDDate() {
    return (
      this.date.getFullYear() +
      this.addZero(this.date.getMonth() + 1) +
      this.addZero(this.date.getDay())
    );
  }

  getGUIDTime() {
    return (
      this.addZero(this.date.getHours()) +
      this.addZero(this.date.getMinutes()) +
      this.addZero(this.date.getSeconds()) +
      this.addZero(parseInt(`${this.date.getMilliseconds() / 10}`))
    );
  }

  addZero(num) {
    if (!_.isNaN(Number(num)) && num >= 0 && num < 10) {
      return '0' + Math.floor(num);
    } else {
      return num.toString();
    }
  }

  hexadecimal(num, x, y?: number) {
    if (y) {
      return parseInt(num.toString(), y).toString(x);
    } else {
      return parseInt(num.toString()).toString(x);
    }
  }

  formatGUID = function(guidStr) {
    const str1 = guidStr.slice(0, 8) + '-',
      str2 = guidStr.slice(8, 12) + '-',
      str3 = guidStr.slice(12, 16) + '-',
      str4 = guidStr.slice(16, 20) + '-',
      str5 = guidStr.slice(20);
    return str1 + str2 + str3 + str4 + str5;
  };
}
