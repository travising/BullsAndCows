import { Component, OnInit } from '@angular/core';

interface BTN {
  value: string;
  num: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public showNum = '';
  public resultNum = '';
  public inputNum = [];
  public btns = [];
  public timeShow = '';

  curTimer = 0;
  randomNum = [];
  count = 7;
  timeOut = 0;
  interval = null;
  playerName = '';
  public isShow = false;
  isDialogShow = false;
  dialogC = '';
  dialogT = '';
  isDialog2Show = false;
  dialog2C = '';
  dialog2T = '';
  chartArray = [];
  charts = '';

  constructor() {
  }

  ngOnInit() {
    this.buttonInit();
    this.inputName();
    // read history record info
    let getCharts;
    getCharts = JSON.parse(localStorage.getItem('chartsInfo'));
    console.log(getCharts);
    if (getCharts !== null) {
      for (let historyCnt = 0; historyCnt < getCharts.length; historyCnt++) {
        this.chartArray.push({
          name: getCharts[historyCnt].name,
          record: getCharts[historyCnt].record,
          date: getCharts[historyCnt].date
        });
      }
    }
    this.sorting();
  }

  buttonInit () {
    for (let idx = 1; idx < 10; idx++) {
      this.btns.push({value: idx.toString(), num: idx});
    }
    this.btns.push({value: '←', num: 11});
    this.btns.push({value: '0', num: 0});
    this.btns.push({value: 'OK', num: 14});
    this.btns.push({value: 'Restart', num: 13});
    this.btns.push({value: 'Charts', num: 12});
    this.btns.push({value: 'Help', num: 15});
  }

  initNum () {
    this.randomNum = [];
    this.curTimer = 0;
    this.count = 7;
    window.clearInterval(this.interval);
    let i: number, unitNum: number;
    for (i = 0; i < 4; i++) {
      do {
        unitNum = Math.floor(Math.random() * 10);
      } while (this.randomNum.indexOf(unitNum) !== -1);
      this.randomNum.push(unitNum);
    }
    this.timer();
  }

  inputName () {
    this.isShow = true;
  }

  gameStart () {
    console.log(this.playerName);
    if (this.playerName !== '') {
      this.isShow = false;
      this.initNum();
    }
  }

  sorting () {
    this.charts = '';
    console.log(this.chartArray);
    this.chartArray.sort(this.compare('record'));
    for (let c = 0; c < this.chartArray.length; c++) {
      localStorage.setItem('chartsInfo', JSON.stringify(this.chartArray));
      this.charts += (c + 1) + '.' + this.chartArray[c].name + '  ' + this.chartArray[c].record + 's  ' + this.chartArray[c].date + '\n';
    }
  }

  checkNum (event) {
    console.log(event);
    console.log(this.inputNum);
    console.log(this.showNum);
    if (!isNaN(Number(event.key)) && (this.inputNum.length < 4) && (this.inputNum.indexOf(Number(event.key))) === -1) {
      this.inputNum.push(Number(event.key));
      console.log(this.inputNum);
      this.showNum = this.inputNum.join('');
    } else if ((event.key === 'Backspace') || (event.key === 'Delete')) {
      this.inputNum.pop();
      console.log(this.inputNum);
      this.showNum = this.inputNum.join('');
    } else if (event.key === 'Enter') {
      if (this.inputNum.length === 4) {
        this.calNum();
      } else {
        this.dialogT = 'Warning';
        this.dialogC = '输入一个不重复的4位数字!';
        this.isDialogShow = true;
      }
    } else {
      this.showNum = this.inputNum.join('');
    }
  }

  addNum (num) {
    if ((this.inputNum.length < 4) && (this.inputNum.indexOf(num) === -1)) {
      this.inputNum.push(num);
      console.log(this.inputNum);
      this.showNum = this.inputNum.join('');
    }
  }

  delNum () {
    this.inputNum.pop();
    this.showNum = this.inputNum.join('');
  }

  clearNum () {
    this.showNum = '';
    this.inputNum = [];
  }

  inputContinue () {
    this.isDialog2Show = false;
    this.clearNum();
    this.resultNum = '';
    this.inputName();
  }

  inputExit () {
    window.close();
  }

  calNum () {
    let i, j, resA, resB;
    resA = resB = 0;
    console.log(this.randomNum);
    console.log(this.count);

    for (i = 0; i < 4; i++) {
      if (this.inputNum[i] === this.randomNum[i]) {
        resA++;
      }
      for (j = 0; j < 4; j++) {
        if (this.inputNum[j] === this.randomNum[i]) {
          resB++;
        }
      }
    }

    if (resA === 4) {
      window.clearInterval(this.interval);
      this.dialog2T = 'Result';
      this.dialog2C = '厉害了，老铁！\n答案为：' + this.randomNum.join() + '\n本次耗时：' + this.curTimer + 's';
      this.isDialog2Show = true;
      this.chartArray.push({
        name: this.playerName,
        record: this.curTimer,
        date: this.getCurTime()
      });
      this.sorting();
    } else {
      this.resultNum += this.showNum + ' ' + resA + 'A' + (resB - resA) + 'B' + '\t';
    }
    this.count--;

    if (this.count === 0) {
      this.dialog2T = 'Result';
      this.dialog2C = '再接再厉，老弟！\n答案是为：' + this.randomNum.join();
      this.isDialog2Show = true;
    }

    this.clearNum();
  }

  inputCmd(num) {
    if (num >= 0 && num <= 9) {
      this.addNum(num);
    } else if (num === 11) { // delete
      this.delNum();
    } else if (num === 12) { // charts
      this.dialogT = 'Charts';
      this.dialogC = this.charts;
      this.isDialogShow = true;
    } else if (num === 13) { // restart
      this.clearNum();
      this.resultNum = '';
      this.inputName();
    } else if (num === 15) { // help
      this.dialogT = 'Help';
      this.dialogC = '输入4位不重复的数字，若数字与位置均正确标记为A，若数字正确位置不正确标记为B\n例：随机数为1983，输入为1234\n数字1存在且位置正确标记为A，数字4存在但位置不正确标记为B，结果显示：1A1B';
      this.isDialogShow = true;
    } else {
      if (this.inputNum.length === 4) {
        this.calNum();
      } else {
        this.dialogT = 'Warning';
        this.dialogC = '输入一个不重复的4位数字!';
        this.isDialogShow = true;
      }
    }
  }

  timer () {
    const me = this;
    me.interval = window.setInterval(function () {
      me.curTimer++;
    }, 1000);
  }

  getCurTime () {
    const date = new Date(); // 获取系统当前时间
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const curTime = month + '/' + day + ' ' + hour + ':' + minute;
    return curTime;
  }

  inputOK () {
    this.isDialogShow = false;
  }

  compare (prop) {
    return function (a, b) {
      const value1 = a[prop];
      const value2 = b[prop];
      return value1 - value2;
    };
  }
}
