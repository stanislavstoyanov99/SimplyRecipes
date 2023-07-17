import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { fromEvent, Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[appNavbar]'
})
export class NavbarDirective implements OnInit, OnDestroy {

  destroy = new Subject<void>();
  destroy$ = this.destroy.asObservable();
  
  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document) { }

  ngOnDestroy(): void {
    this.destroy.next();
  }

  ngOnInit(): void {
    fromEvent(window, 'scroll')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.onScroll());
  }

  private onScroll(): void {
    if (this.document.body.scrollTop > 80 || this.document.documentElement.scrollTop > 80) {
      this.renderer.setStyle(this.element.nativeElement, "padding", "5px 10px");
			
		} else {
      this.renderer.setStyle(this.element.nativeElement, "padding", "20px 10px");
		}
  }
}
