import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { LegendPosition } from '@swimlane/ngx-charts';
import { AdminDashboardService } from 'src/app/services/admin-dashboard.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ErrorDialogComponent } from 'src/app/shared/dialogs/error-dialog/error-dialog.component';
import { IStatistics } from 'src/app/shared/interfaces/admin-dashboard/statistics';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  statistics: IStatistics = {
    recipesCount: 0,
    articlesCount: 0,
    reviewsCount: 0,
    registeredUsersCount: 0,
    adminsCount: 0,
    articleCommentsCount: 0,
    topCategories: [],
    topRecipes: [],
    topArticleComments: [],
    registeredUsersPerMonth: {},
    registeredAdminsPerMonth: {}
  };
  usersChartData!: any[];
  pieChartData!: any[];

  // Line Chart options
  lineChartView: [number, number] = [700, 400];
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLineChartLabel: string = 'Months';
  yAxisLineChartLabel: string = 'Count';
  colorSchemeLineChart: string = 'cool';
  timeline: boolean = true;

  // Pie Chart options
  gradient: boolean = true;
  isDoughnut: boolean = true;
  colorSchemePieChart: string = 'forest';
  legendPosition: LegendPosition = LegendPosition.Below;

  constructor(
    public route: ActivatedRoute,
    public loadingService: LoadingService,
    private adminDashboardService: AdminDashboardService,
    private dialog: MatDialog,
    private library: FaIconLibrary) {
      this.library.addIcons(faStar);
  }

  ngOnInit(): void {
    this.adminDashboardService.getStatistics().subscribe({
      next: (statistics) => {
        this.statistics = statistics;
        let adminSeries = this.setAdminSeriesData();
        let usersSeries = this.setUsersSeriesData();

        this.usersChartData = [
          {
            "name": "Admins",
            "series": adminSeries
          },
          {
            "name": "Users",
            "series": usersSeries
          }
        ];

        this.pieChartData = [
          {
            "name": "Articles",
            "value": this.statistics.articlesCount
          },
          {
            "name": "Recipes",
            "value": this.statistics.recipesCount
          },
          {
            "name": "Article Comments",
            "value": this.statistics.articleCommentsCount
          },
          {
            "name": "Reviews",
            "value": this.statistics.reviewsCount
          }
        ];
      },
      error: (err: string) => {
        this.dialog.open(ErrorDialogComponent, {
          data: {
            message: err
          }
        });
      }
    });
  }

  private setAdminSeriesData(): any[] {
    let adminSeries = [];
    for (let month in this.statistics.registeredAdminsPerMonth) {
      let count = this.statistics.registeredAdminsPerMonth[month];
      adminSeries.push({ name: month, value: count });
    }
    return adminSeries;
  }

  private setUsersSeriesData(): any[] {
    let usersSeries = [];
    for (let month in this.statistics.registeredUsersPerMonth) {
      let count = this.statistics.registeredUsersPerMonth[month];
      usersSeries.push({ name: month, value: count });
    }
    return usersSeries;
  }
}