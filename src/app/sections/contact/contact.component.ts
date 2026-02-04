import { Component } from '@angular/core';
import { GsapRevealDirective } from '../../shared/directives/gsap-reveal.directive';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [GsapRevealDirective],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {}
