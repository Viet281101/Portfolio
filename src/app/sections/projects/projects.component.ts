import { Component } from '@angular/core';
import { GsapRevealDirective } from '../../shared/directives/gsap-reveal.directive';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [GsapRevealDirective],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {}
