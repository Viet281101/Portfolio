import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsapRevealDirective } from '../../shared/directives/gsap-reveal.directive';
import coursesData from '../../data/courses.json';
import coursesInfo from '../../data/courses_info.json';

interface CourseInfo {
  title: string;
  description: string;
  duration: string;
  credits: string;
}

interface CourseItem {
  title: string;
  description?: string;
  duration?: string;
  credits?: string;
}

interface SemesterBlock {
  title: string;
  courses: CourseItem[];
  count: number;
}

interface EducationBlock {
  title: string;
  semesters: SemesterBlock[];
}

@Component({
  selector: 'app-journey',
  standalone: true,
  imports: [CommonModule, GsapRevealDirective],
  templateUrl: './journey.component.html',
  styleUrl: './journey.component.scss',
})
export class JourneyComponent {
  private readonly lang = 'en' as const;

  isEducationOpen = false;
  isEducationVisible = false;
  isEducationClosing = false;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  @ViewChild('educationDrawer') educationDrawer?: ElementRef<HTMLElement>;

  readonly experience = [
    {
      company: 'DU FLE — University of Rennes 2',
      period: '2020',
      type: 'education',
      summary: 'French language diploma (DU FLE).',
    },
    {
      company: 'Computer Science — University of Paris 8',
      period: '2021-2024',
      type: 'education',
      summary: 'Courses completed from year 1 through year 3.',
    },
    {
      company: 'WEDO Research & Investment',
      location: 'Paris/Hanoï',
      period: '05-08/2024',
      type: 'work',
      summary:
        'Wedori: Financial research company analyzing markets to identify opportunities and implement investment strategies.',
    },
    {
      company: 'Mirrix DAM',
      location: 'Paris/Hanoï',
      period: '09-12/2024',
      type: 'work',
      summary:
        'Mirrix: Digital Asset Management (DAM) solution developed as an add-on for Stibo Systems STEP platform.',
    },
    {
      company: 'BHSoft',
      location: 'Hanoï',
      period: '01-12/2025',
      type: 'work',
      summary:
        'BHSoft is an ISO-certified Agile software development company in Vietnam, pioneering in offering quality solutions for 3D mapping software, GIS solutions, ...',
    },
  ];

  readonly education: EducationBlock[] = this.buildEducation();

  handleEducationClick(type?: string): void {
    if (type === 'education') {
      this.toggleEducation();
    }
  }

  handleEducationKeydown(event: KeyboardEvent, type?: string): void {
    if (type !== 'education') {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleEducation();
    }
  }

  openEducation(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }

    this.isEducationVisible = true;
    this.isEducationClosing = false;
    this.isEducationOpen = true;
    this.scrollToEducationIfMobile();
  }

  closeEducation(): void {
    if (!this.isEducationVisible) {
      return;
    }

    this.isEducationOpen = false;
    this.isEducationClosing = true;

    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
    }

    this.closeTimer = setTimeout(() => {
      this.isEducationVisible = false;
      this.isEducationClosing = false;
      this.closeTimer = null;
    }, 320);
  }

  toggleEducation(): void {
    if (this.isEducationOpen) {
      this.closeEducation();
      return;
    }

    this.openEducation();
  }

  private scrollToEducationIfMobile(): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (window.innerWidth > 1024) {
      return;
    }

    setTimeout(() => {
      const element = this.educationDrawer?.nativeElement;
      if (!element) {
        return;
      }
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }

  private buildEducation(): EducationBlock[] {
    const levels = ['L1', 'L2', 'L3'];
    const courseRoot = (coursesData as any)[this.lang] ?? {};
    const infoRoot = (coursesInfo as any)[this.lang] ?? {};

    return levels
      .map(levelKey => {
        const level = courseRoot[levelKey];
        if (!level) {
          return null;
        }

        const semesters = Object.keys(level)
          .filter(key => key.startsWith('S'))
          .map(semesterKey => {
            const semester = level[semesterKey];
            const courseEntries = Object.entries(semester.courses || {}) as Array<[string, string]>;

            const courses = courseEntries
              .filter(([, title]) => this.isValidCourseTitle(title))
              .map(([courseIndex, title]) => {
                const infoKey = `${levelKey}-${semesterKey}-${courseIndex}`;
                const info: CourseInfo | undefined = infoRoot[infoKey];

                return {
                  title,
                  description: info?.description,
                  duration: info?.duration,
                  credits: info?.credits,
                };
              });

            return {
              title: semester.h3,
              courses,
              count: courses.length,
            } as SemesterBlock;
          })
          .filter(semester => semester.courses.length > 0);

        return {
          title: level.h2,
          semesters,
        } as EducationBlock;
      })
      .filter(Boolean) as EducationBlock[];
  }

  private isValidCourseTitle(title: string): boolean {
    const normalized = title.trim().toLowerCase();
    return !['null', 'vide', 'not yet', 'pas encore'].includes(normalized);
  }
}
