import { Component, OnInit } from '@angular/core';
import { FaqService } from '../services/faq.service';
import { IFaq } from '../shared/interfaces/faq/faq';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  faqs: IFaq[] = [];

  constructor(public loadingService: LoadingService, private faqService: FaqService) { }

  ngOnInit(): void {
    this.faqService.getFaqs().subscribe({
      next: (value) => {
        this.faqs = value;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

}
