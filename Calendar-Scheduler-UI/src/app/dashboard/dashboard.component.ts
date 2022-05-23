import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  displayedColumns = ["name", "active", "ruleIds", "createdDateAndTime", "createdUser", "lastModifiedDateAndTime", "lastModifiedUser"];
  dataSource: any = [];

  displayedRuleColumns = ["id", "holidayType", "isActive","month", "createdDateAndTime", "createdUser", "lastModifiedDateAndTime", "lastModifiedUser"];
  ruleDataSource: any = [];
  toggleColor = 'primary';

  constructor(private httpService:HttpService, private router: Router) {}

    ngOnInit() {

        /*this.dataSource = [{
          "id":1,
          "name":"venkatcustom89",
          "createdDateAndTime":"2022-03-03",
          "createdUser":"Venkat Chada",
          "lastModifiedUser":null,
          "lastModifiedDateAndTime":"2022-03-03",
          "active":false,
          "ruleIds":"2022-02-14"
          }];*/
        this.httpService.getAllCalender('2022').subscribe((res: any) => {
          if (res) {
            this.dataSource = res;
          }
        }, err => {
          console.error(err);
        })

        this.httpService.getAllRules().subscribe((res: any) => {
          if (res) {
            this.ruleDataSource = res;
          }
        }, err => {
          console.error(err);
        })

        this.ruleDataSource = [{
          id: 123
        }]

    }

    goToSchedule(row) {
      this.router.navigate(['schedule'], {state: row});
    }

    goToCreateRule(row) {
      this.httpService.getRuleDetails(row.id).subscribe((res: any) => {
        if (res) {

          this.router.navigate(['create-rule'], {state: row});
        }
      }, err => {
        console.error(err);
      })

      // row = {
      //   ruleId: 'id123',
      //   holidayType: "test-rule",
      //   month: "",
      //   dayOfTheMonth: "",
      //   dayOfTheWeek: "",
      //   weekOfTheMonth: "",
      //   customDays: "01-01,02-01,03-01,04-01,03-31,02-28,01-31,04-30",
      //   createdUser: "User",
      //   lastModifiedUser: "User",
      //   isActive: true
      // }

      // this.router.navigate(['create-rule'], {state: row});
    }

}
