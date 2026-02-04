import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  template: `
    <div
      [ngClass]="['skeleton', variant]"
      [style.width]="width"
      [style.height]="height"
    ></div>
  `,
  styles: [
    `
      .skeleton {
        display: inline-block;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.03) 0%,
          rgba(255, 255, 255, 0.06) 50%,
          rgba(255, 255, 255, 0.03) 100%
        );
        background-size: 200% 100%;
        animation: shimmer 1.4s linear infinite;
        border-radius: 6px;
      }

      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }

      .avatar {
        border-radius: 50%;
      }
      .block {
        display: block;
      }
      .rounded-pill {
        border-radius: 999px;
      }
      .text-line {
        height: 14px;
        margin-bottom: 8px;
        border-radius: 4px;
      }
      .title {
        height: 22px;
      }
      .large {
        height: 160px;
      }
      .small {
        height: 12px;
      }
    `,
  ],
})
export class SkeletonComponent {
  @Input() width: string = '100%';
  @Input() height: string = '14px';
  @Input() variant: string = 'block';
}
