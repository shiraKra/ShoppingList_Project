import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api'; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-items-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './items-list.html',
  styleUrls: ['./items-list.css']
})
export class ItemsListComponent implements OnInit {
  // קטלוג עשיר ומלא במוצרים
  catalog = [
    // חלב וביצים
    { name: 'חלב 3%', category: 'חלב וביצים', icon: '🥛', categoryId: 1 },
    { name: 'גבינה צהובה', category: 'חלב וביצים', icon: '🧀', categoryId: 1 },
    { name: 'ביצים L', category: 'חלב וביצים', icon: '🥚', categoryId: 1 },
    { name: 'יוגורט יווני', category: 'חלב וביצים', icon: '🍦', categoryId: 1 },
    { name: 'חמאה', category: 'חלב וביצים', icon: '🧈', categoryId: 1 },
    { name: 'גבינה לבנה', category: 'חלב וביצים', icon: '🥣', categoryId: 1 },
    { name: 'שמנת חמוצה', category: 'חלב וביצים', icon: '🥛', categoryId: 1 },

    // ירקות ופירות
    { name: 'עגבניה', category: 'ירקות ופירות', icon: '🍅', categoryId: 2 },
    { name: 'מלפפון', category: 'ירקות ופירות', icon: '🥒', categoryId: 2 },
    { name: 'בצל', category: 'ירקות ופירות', icon: '🧅', categoryId: 2 },
    { name: 'תפוח אדמה', category: 'ירקות ופירות', icon: '🥔', categoryId: 2 },
    { name: 'גזר', category: 'ירקות ופירות', icon: '🥕', categoryId: 2 },
    { name: 'תפוח עץ', category: 'ירקות ופירות', icon: '🍎', categoryId: 2 },
    { name: 'בננה', category: 'ירקות ופירות', icon: '🍌', categoryId: 2 },
    { name: 'חסה', category: 'ירקות ופירות', icon: '🥬', categoryId: 2 },
    { name: 'לימון', category: 'ירקות ופירות', icon: '🍋', categoryId: 2 },

    // מאפייה
    { name: 'לחם פרוס', category: 'מאפייה', icon: '🍞', categoryId: 3 },
    { name: 'פיתות', category: 'מאפייה', icon: '🥙', categoryId: 3 },
    { name: 'חלה לשבת', category: 'מאפייה', icon: '🥖', categoryId: 3 },
    { name: 'לחמניות', category: 'מאפייה', icon: '🥯', categoryId: 3 },
    { name: 'בייגלה טרי', category: 'מאפייה', icon: '🥨', categoryId: 3 },

    // בשר ודגים
    { name: 'חזה עוף', category: 'בשר ודגים', icon: '🍗', categoryId: 4 },
    { name: 'בשר טחון', category: 'בשר ודגים', icon: '🥩', categoryId: 4 },
    { name: 'דג סלמון', category: 'בשר ודגים', icon: '🐟', categoryId: 4 },
    { name: 'סטייק בקר', category: 'בשר ודגים', icon: '🍖', categoryId: 4 },

    // ניקיון
    { name: 'נוזל כלים', category: 'ניקיון', icon: '✨', categoryId: 5 },
    { name: 'נייר טואלט', category: 'ניקיון', icon: '🧻', categoryId: 5 },
    { name: 'אבקת כביסה', category: 'ניקיון', icon: '🧺', categoryId: 5 },
    { name: 'נוזל רצפות', category: 'ניקיון', icon: '🧼', categoryId: 5 },
    { name: 'שקיות אשפה', category: 'ניקיון', icon: '🗑️', categoryId: 5 },

    // מזווה
    { name: 'אורז', category: 'מזווה', icon: '🍚', categoryId: 6 },
    { name: 'פסטה', category: 'מזווה', icon: '🍝', categoryId: 6 },
    { name: 'שמן קנולה', category: 'מזווה', icon: '🍾', categoryId: 6 },
    { name: 'קפה', category: 'מזווה', icon: '☕', categoryId: 6 },
    { name: 'סוכר', category: 'מזווה', icon: '🍬', categoryId: 6 },
    { name: 'מלח', category: 'מזווה', icon: '🧂', categoryId: 6 },
    { name: 'רסק עגבניות', category: 'מזווה', icon: '🥫', categoryId: 6 }
  ];

  categories = ['הכל', 'חלב וביצים', 'ירקות ופירות', 'מאפייה', 'בשר ודגים', 'ניקיון', 'מזווה', 'קפואים'];
  selectedCategory = 'הכל';
  filteredCatalog = [...this.catalog];
  cartItems: any[] = []; 

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.api.exec("sp_GetAllItems", {}).subscribe({
      next: (data: any) => {
        const result = Array.isArray(data) ? data : (data?.data || []);
        this.cartItems = result;
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error("שגיאה במשיכת נתונים:", err)
    });
  }

  addToCart(product: any): void {
    const newItem = {
      ItemName: product.name,
      ItemDescription: product.category,
      CategoryId: product.categoryId,
      StatusId: 1
    };

    this.api.exec("sp_AddItem", newItem).subscribe({
      next: () => {
        console.log("המוצר נוסף בהצלחה");
        this.loadCart(); 
      },
      error: (err) => console.error("שגיאה בהוספה:", err)
    });
  }

  onToggleStatus(item: any): void {
    const itemId = item.Id || item.id; 
    this.api.exec("sp_ToggleItemStatus", { Id: itemId }).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error("שגיאה בעדכון:", err)
    });
  }

  onDeleteItem(id: number | undefined): void {
    if (!id) return;
    this.api.exec("sp_DeleteItem", { Id: id }).subscribe({
      next: () => {
        console.log("המוצר נמחק");
        this.loadCart();
      },
      error: (err) => console.error("שגיאה במחיקה:", err)
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.filteredCatalog = category === 'הכל' 
      ? [...this.catalog] 
      : this.catalog.filter(p => p.category === category);
  }
}