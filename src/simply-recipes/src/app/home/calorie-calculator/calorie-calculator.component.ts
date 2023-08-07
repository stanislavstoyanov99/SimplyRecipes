import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { CalorieCalculatorModel } from 'src/app/shared/models/calorie-calculator';

@Component({
  selector: 'app-calorie-calculator',
  templateUrl: './calorie-calculator.component.html',
  styleUrls: ['./calorie-calculator.component.scss']
})
export class CalorieCalculatorComponent implements AfterViewInit, OnDestroy {

  @ViewChild('calorieForm') calorieForm!: NgForm;
  gender: string;
  calorieCalculatorModel: CalorieCalculatorModel;
  gainWeight: number;
  maintainWeight: number;
  loseWeight: number;
  subscription!: Subscription;

  constructor() {
    this.gender = 'male';
    this.gainWeight = 2700;
    this.maintainWeight = 2400;
    this.loseWeight = 1900;
    this.calorieCalculatorModel = new CalorieCalculatorModel();
  }

  ngAfterViewInit(): void {
    this.subscription = this.calorieForm.valueChanges!
      .pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(() => {
        if (this.calorieForm.dirty) {
          this.calculateCalories();
        }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private calculateCalories(): void {
    let bmr = 10 * this.calorieForm.value['weight'] + 6.25 * this.calorieForm.value['height'] - 5 * this.calorieForm.value['age'] +
      (this.calorieForm.value['gender'] === "male" ? 5 : -161);
    bmr = bmr * 1.2;
    bmr += this.calorieForm.value['walking'] * 60 * (.03 * this.calorieForm.value['weight'] * 1 / 0.45) / 7;
    bmr += this.calorieForm.value['cardio'] * 60 * (.07 * this.calorieForm.value['weight'] * 1 / 0.45) / 7;
    bmr = Math.floor(bmr);

    this.gainWeight = Math.round((bmr + 300) / 100) * 100;
    this.maintainWeight = Math.round((bmr) / 100) * 100;
    this.loseWeight = Math.round((bmr - 500) / 100) * 100;
  }
}
