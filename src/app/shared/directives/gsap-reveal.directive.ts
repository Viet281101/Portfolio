import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';

export type RevealPreset = 'fade-up' | 'fade-in' | 'scale';

@Directive({
  selector: '[gsapReveal]',
  standalone: true,
})
export class GsapRevealDirective implements AfterViewInit, OnDestroy {
  private preset: RevealPreset = 'fade-up';

  @Input()
  set gsapReveal(value: RevealPreset | '') {
    this.preset = value || 'fade-up';
  }

  get gsapReveal(): RevealPreset {
    return this.preset;
  }
  @Input() delay = 0;
  @Input() duration = 0.9;
  @Input() y = 28;

  private observer?: IntersectionObserver;

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const element = this.el.nativeElement;
    const base = {
      opacity: 0,
      y: this.preset === 'fade-up' ? this.y : 0,
      scale: 1,
    } as const;

    if (this.preset === 'scale') {
      gsap.set(element, { ...base, scale: 0.96 });
    } else {
      gsap.set(element, base);
    }

    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            gsap.to(element, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: this.duration,
              delay: this.delay,
              ease: 'power3.out',
            });
            this.observer?.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
