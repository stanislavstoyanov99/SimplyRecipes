import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FaqService } from 'src/app/services/faq.service';
import { ConfirmDialogModel, ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ErrorDialogComponent } from 'src/app/shared/dialogs/error-dialog/error-dialog.component';
import { EditFaqDialogModel, FaqEditDialogComponent } from 'src/app/shared/dialogs/faq-edit-dialog/faq-edit-dialog.component';
import { IFaqDetails } from 'src/app/shared/interfaces/faq/faq-details';

@Component({
  selector: 'app-get-all-faqs',
  templateUrl: './get-all-faqs.component.html',
  styleUrls: ['./get-all-faqs.component.scss']
})
export class GetAllFaqsComponent implements OnInit {

  faqs: IFaqDetails[] = [];

  constructor(
    private faqsService: FaqService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.faqsService.getAllFaqs().subscribe({
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

  onEditHandler(faq: IFaqDetails): void {
    const title = `Edit ${faq.question} faq with id: ${faq.id}`;
    const dialogData = new EditFaqDialogModel(title, faq);
    const dialogRef = this.dialog.open(FaqEditDialogComponent, {
      width: '50%',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(faq => {
      if (faq) {
        this.faqsService.editFaq(faq).subscribe({
          next: (faq) => {
            const indexOfUpdatedFaq = this.faqs.findIndex(x => x.id === faq.id);
            this.faqs[indexOfUpdatedFaq] = faq;
          },
          error: (err: string) => {
            this.dialog.open(ErrorDialogComponent, {
              data: { message: err }
            });
          }
        });
      }
    });
  }

  onRemoveHandler(faqId: number): void {
    const message = 'Are you sure you want to delete this faq?';
    const dialogData = new ConfirmDialogModel('Confirmation', message);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.faqsService.removeFaq(faqId).subscribe({
          next: () => {
            const indexOfDeletedFaq = this.faqs.findIndex(x => x.id === faqId);
            this.faqs.splice(indexOfDeletedFaq!, 1);
          },
          error: (err: string) => {
            this.dialog.open(ErrorDialogComponent, {
              data: { message: err }
            });
          }
        });
      }
    });
  }

}
