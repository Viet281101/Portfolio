import { Component } from '@angular/core';
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
  selector: 'app-background',
  standalone: true,
  imports: [CommonModule, GsapRevealDirective],
  templateUrl: './background.component.html',
  styleUrl: './background.component.scss'
})
export class BackgroundComponent {
  private readonly lang = 'en' as const;

  readonly experience = [
    {
      company: 'WEDO Research & Investment',
      location: 'Paris/Hanoï',
      period: '05-08/2024',
      summary:
        'Wedori: Financial research company analyzing markets to identify opportunities and implement investment strategies.'
    },
    {
      company: 'BHSoft',
      location: 'Hanoï',
      period: '01-09/2025',
      summary:
        'BHSoft is an ISO-certified Agile software development company in Vietnam, pioneering in offering quality solutions for 3D mapping software, GIS solutions, ...'
    }
  ];

  readonly education: EducationBlock[] = this.buildEducation();

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
                  credits: info?.credits
                };
              });

            return {
              title: semester.h3,
              courses,
              count: courses.length
            } as SemesterBlock;
          })
          .filter(semester => semester.courses.length > 0);

        return {
          title: level.h2,
          semesters
        } as EducationBlock;
      })
      .filter(Boolean) as EducationBlock[];
  }

  private isValidCourseTitle(title: string): boolean {
    const normalized = title.trim().toLowerCase();
    return !['null', 'vide', 'not yet', 'pas encore'].includes(normalized);
  }
}
