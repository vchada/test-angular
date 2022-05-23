import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import * as moment from 'moment';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  selectedDateList = [];
  form: FormGroup = new FormGroup({});
  @ViewChild('confirmationModal') confirmationModal: ElementRef;
  @ViewChild('disbaleConfirmationModal') disbaleConfirmationModal: ElementRef;

  years = [
    2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032
  ]

  selectedYear = 2022;
  selectedCalendar;

  prefrenceList = []
  edit:boolean = false;
  selectedPrefrence = []
  selectedPrefrenceList = [];
  constructor(private httpService: HttpService, private fb: FormBuilder, private router: Router) {

    this.fetchHolidayList(this.selectedYear);
    if(this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras && this.router.getCurrentNavigation().extras.state) {
      const stateData = this.router.getCurrentNavigation().extras.state;
      this.selectedCalendar = stateData;
      this.selectRules(this.selectedCalendar.ruleName?.split(','));
      this.selectedPrefrence = this.selectedCalendar.ruleName?.split(',');
      this.edit = true;
    }
    this.form = fb.group({
      name: [this.selectedCalendar?.name, [Validators.required]]
    })
   }

  ngOnInit(): void {
  }

  disable(){
    if(this.selectedCalendar){
      this.selectedCalendar.active = false;
      this.update();
    }
  }

  disableCalendarConfirm(){
    if(this.selectedCalendar){
      this.selectedCalendar.active = false;
      this.update();
    }
  }

  fetchHolidayList(selectedYear) {
    this.prefrenceList = [];
    /*let res = {
      "venkat-built-in-11": "2022-03-11,2022-03-15,2022-03-16",
      "JAN_3_WK_TH242526": "2022-01-25,2022-01-26,2022-01-27",
      "MARCH3rd": "2022-03-21",
      "APRIL_3RD_WEEK_TUESDAY": "2022-04-19",
      "VALENTINES_DAY": "2022-02-14"
    }
    Object.keys(res).forEach(item => {
      this.prefrenceList.push({
        name: item,
        dates: res[item].split(',')
      })
    })*/
    this.httpService.getHolidayList(selectedYear).subscribe(res => {
      if (res ) {
        Object.keys(res).forEach(item => {
          this.prefrenceList.push({
            name: item,
            dates: res[item].split(',')
          })
        })
      }
    }, err => {
      console.error(err);
    })
  }

  selectRules(names: any[]) {
    this.httpService.getRuleIds().subscribe((ruleIds: any[]) => {
      //let ruleIds = [{'VALENTINES_DAY': "2022-02-14"}];
      if (names) {
        for(let i in ruleIds){
          for(let j in names) {
            if(i === names[j]){
              //this.selectedPrefrence.push(i);
              this.selectedPrefrenceList = [];
              this.selectedPrefrence.forEach(item => {
                if(item) {
                  this.selectedPrefrenceList = [...this.selectedPrefrenceList ,...(this.prefrenceList.find(val => val.name === item).dates)]
                }
              })
            }
          }
        }
      }
    }, err => {
      console.error(err);
    })
  }

  dateSelected(dates) {
    this.selectedDateList = dates;
  }

  changeYear(year) {
    this.selectedYear = year;
    this.selectedPrefrence = [];
    this.selectedPrefrenceList = [];
    this.fetchHolidayList(this.selectedYear);
  }

  changePrefrence(prefrence) {
    this.selectedPrefrence = prefrence;
    this.selectedPrefrenceList = [];
    this.selectedPrefrence.forEach(item => {
      if(item) {
        this.selectedPrefrenceList = [...this.selectedPrefrenceList ,...(this.prefrenceList.find(val => val.name === item).dates)]
      }
    })
    console.log(this.selectedPrefrenceList);
  }

  sendYearChanged(year) {
    this.selectedYear = (new Date(year)).getFullYear();
    this.fetchHolidayList(this.selectedYear);
    this.selectedPrefrence = [];
  }

  cancel() {
    this.selectedPrefrence = [];
  }

  remove(prefrence) {
    this.selectedPrefrence = this.selectedPrefrence.filter(item => item !== prefrence);
    this.changePrefrence(this.selectedPrefrence);
  }

  save() {
    this.httpService.getRuleIds().subscribe((ruleIds: any) => {
      if (ruleIds ) {

        const reqData = {
          name: this.form.value.name,
          createdDateAndTime: null,
          createdUser: "Venkat Chada",
          lastModifiedUser: null,
          lastModifiedDateAndTime: null,
          active: true,
          ruleIds: "",
          ruleName : this.selectedPrefrence.join(',')
        }
        this.selectedPrefrence.forEach(item => {
          if(reqData.ruleIds === '') {
            reqData.ruleIds = reqData.ruleIds + ruleIds[item]
          } else {
            reqData.ruleIds = reqData.ruleIds + ',' + ruleIds[item]
          }
        })
        this.httpService.saveCalendar(reqData).subscribe((res: any) => {
          if (res && res.message === 'CALENDER_PERSISTED_SUCCESSFULLY') {
            this.confirmationModal.nativeElement.click();
            this.router.navigate(['dashboard']);
          }
        }, err => {
          console.error(err);
        })
      }
    }, err => {
      console.error(err);
    })

  }

  update() {
    this.httpService.getRuleIds().subscribe((ruleIds: any) => {
      if (ruleIds ) {

        const reqData = {
          name: this.selectedCalendar.name,
          id: this.selectedCalendar.id,
          createdDateAndTime: this.selectedCalendar.createdDateAndTime,
          createdUser: this.selectedCalendar.createdUser,
          lastModifiedUser: this.selectedCalendar.lastModifiedUser,
          lastModifiedDateAndTime: this.selectedCalendar.lastModifiedDateAndTime,
          active: this.selectedCalendar.active,
          ruleIds: '',
          ruleName : this.selectedPrefrence.join(',')
        }
        this.selectedPrefrence.forEach(item => {
          if(reqData.ruleIds === '') {
            reqData.ruleIds = reqData.ruleIds + ruleIds[item]
          } else {
            reqData.ruleIds = reqData.ruleIds + ',' + ruleIds[item]
          }
        })
        this.httpService.updateCalendar(reqData).subscribe((res: any) => {
          if (res && res.message === "CALENDAR UPDATED SUCCESSFULLY") {
            this.disbaleConfirmationModal.nativeElement.click();
            this.edit = false;
            this.router.navigate(['dashboard']);
          }
        }, err => {
          console.error(err);
        })
      }
    }, err => {
      console.error(err);
    })

  }

  generateRules(){
    let ruleNames = [];
    this.prefrenceList.map((p,i) => {
      ruleNames.push(i);
    });
    return ruleNames.join(',');
  }

  generate(){}



  getDateArray(year) {


    let startDate = new Date(year + "-01-01"); //YYYY-MM-DD
    let endDate = new Date(year + "-12-31"); //YYYY-MM-DD
    let arr = new Array();
    let dt = new Date(startDate);
    while (dt <= endDate) {
      arr.push(new Date(dt));
      dt.setDate(dt.getDate() + 1);
    }
    return arr;
  }

}
