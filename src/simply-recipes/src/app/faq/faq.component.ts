import { Component, OnInit } from '@angular/core';
import { FaqService } from '../services/faq.service';
import { IFaq } from '../shared/interfaces/faq/faq';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  faqs: IFaq[] | null = null;

  constructor(private faqService: FaqService) { }

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
