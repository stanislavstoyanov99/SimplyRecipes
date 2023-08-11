import { Component, OnInit } from '@angular/core';
import { FaqService } from '../services/faq.service';
import { IFaq } from '../shared/interfaces/faq/faq';
import { LoadingService } from '../services/loading.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../shared/dialogs/error-dialog/error-dialog.component';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  faqs: IFaq[] = [];

  constructor(
    public loadingService: LoadingService,
    private faqService: FaqService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.faqService.getFaqs().subscribe({
      next: (faqs) => {
        this.faqs = faqs;
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

}
