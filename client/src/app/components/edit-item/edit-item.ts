import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-item',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-item.html',
  styleUrl: './edit-item.css',
})
export class EditItem implements OnInit {
  itemId!: number;
  
  // אובייקט עם ערכי ברירת מחדל כדי למנוע מצב של ערך חסר (undefined)
  item: any = { 
    ItemName: '', 
    CategoryId: 1,
    StatusId: 1 
  };
  
  categories = [
    { id: 1, name: 'חלב וביצים' },
    { id: 2, name: 'ירקות ופירות' },
    { id: 3, name: 'ניקיון' },
    { id: 4, name: 'מאפייה' },
    { id: 5, name: 'בשר ודגים' },
    { id: 6, name: 'מזווה' },
    { id: 7, name: 'קפואים' }
  ];

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.itemId = Number(idParam);
    
    if (this.itemId) {
      this.loadItemDetails();
    }
  }

  loadItemDetails(): void {
    this.api.exec("sp_GetItemById", { Id: this.itemId }).subscribe({
      next: (res: any) => {
        if (res && res.length > 0) {
          // טעינת הנתונים מה-DB לתוך האובייקט
          this.item = res[0];
          console.log("נתוני מוצר נטענו:", this.item);
        }
      },
      error: (err) => console.error("שגיאה בטעינת המוצר:", err)
    });
  }

  onSave(): void {
    // בניית האובייקט בצורה הכי מפורשת שיש
    const params = {
      Id: Number(this.itemId),
      ItemName: String(this.item.ItemName),
      ItemDescription: "", 
      CategoryId: Number(this.item.CategoryId),
      // אם בטעות ה-StatusId ריק, נשלח 1 כברירת מחדל כדי שה-SQL לא יצעק
      StatusId: this.item.StatusId ? Number(this.item.StatusId) : 1
    };

    console.log("שולח פרמטרים לעדכון:", params);

    this.api.exec("sp_UpdateItem", params).subscribe({
      next: (res) => {
        console.log("השמירה הצליחה!");
        this.router.navigate(['/items-list']);
      },
      error: (err) => {
        console.error("שגיאה בשמירה:", err);
        // debugger; // אם זה נופל, הקוד ייעצר כאן ותוכלי לבדוק ב-Console את המשתנה params
        alert(`שגיאת שרת: ${err.error?.error || 'חסר פרמטר ב-SQL'}`);
      }
    });
  }
}