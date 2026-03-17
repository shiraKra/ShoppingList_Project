import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './summary.html',
  styleUrl: './summary.css'
})
export class Summary implements OnInit {
  allItems: any[] = [];
  purchasedItems: any[] = [];
  missingItems: any[] = [];
  progressPercent: number = 0;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {} // הוספנו ChangeDetectorRef

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    // אנחנו משתמשים ב-sp_GetAllItems כי אמרת שהיא עובדת ברשימה הראשית
    this.api.exec("sp_GetAllItems", {}).subscribe({
      next: (res: any) => {
        console.log("נתונים גולמיים מהשרת:", res);

        // וידוא שהנתונים הם מערך
        const data = Array.isArray(res) ? res : (res?.data || []);
        this.allItems = data;

        // פילטור ידני עם לוגיקה חסינה (בודק גם אות גדולה וגם קטנה)
        this.purchasedItems = this.allItems.filter(i => {
          const s = i.StatusId ?? i.statusId;
          return s === 2;
        });

        this.missingItems = this.allItems.filter(i => {
          const s = i.StatusId ?? i.statusId;
          return s !== 2;
        });

        // חישוב אחוזים
        if (this.allItems.length > 0) {
          this.progressPercent = Math.round((this.purchasedItems.length / this.allItems.length) * 100);
        } else {
          this.progressPercent = 0;
        }

        console.log("תוצאת פילטור:", {
          בסל: this.purchasedItems.length,
          פספסת: this.missingItems.length
        });

        // הכרחי: מעדכן את האנגולר שהנתונים השתנו כדי שיראה אותם על המסך
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("שגיאה קריטית בטעינת סיכום:", err);
      }
    });
  }
}