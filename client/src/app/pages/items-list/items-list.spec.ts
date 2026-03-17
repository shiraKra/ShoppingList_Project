import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-items-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './items-list.html',
  styleUrls: ['./items-list.css']
})
export class ItemsListComponent implements OnInit {
  // קטלוג מוצרים לבחירה
  catalog = [
    { name: 'חלב 3%', category: 'חלב וביצים', icon: '🥛' },
    { name: 'גבינה צהובה', category: 'חלב וביצים', icon: '🧀' },
    { name: 'קוטג׳', category: 'חלב וביצים', icon: '🥣' },
    { name: 'תבנית ביצים', category: 'חלב וביצים', icon: '🥚' },
    { name: 'חמאה', category: 'חלב וביצים', icon: '🧈' },
    { name: 'עגבניה', category: 'ירקות ופירות', icon: '🍅' },
    { name: 'מלפפון', category: 'ירקות ופירות', icon: '🥒' },
    { name: 'בננה', category: 'ירקות ופירות', icon: '🍌' },
    { name: 'אבוקדו', category: 'ירקות ופירות', icon: '🥑' },
    { name: 'חלה לשבת', category: 'מאפייה', icon: '🍞' },
    { name: 'פיתות', category: 'מאפייה', icon: '🫓' },
    { name: 'רוגעלך', category: 'מאפייה', icon: '🥐' },
    { name: 'חזה עוף', category: 'בשר ודגים', icon: '🍗' },
    { name: 'פילה סלמון', category: 'בשר ודגים', icon: '🐟' },
    { name: 'נוזל כלים', category: 'ניקיון', icon: '✨' },
    { name: 'אבקת כביסה', category: 'ניקיון', icon: '🧼' },
    { name: 'נייר טואלט', category: 'ניקיון', icon: '🧻' },
    { name: 'אורז בסמטי', category: 'מזווה', icon: '🍚' },
    { name: 'פסטה', category: 'מזווה', icon: '🍝' },
    { name: 'קפה נמס', category: 'מזווה', icon: '☕' }
  ];

  categories = ['הכל', 'חלב וביצים', 'ירקות ופירות', 'מאפייה', 'בשר ודגים', 'ניקיון', 'מזווה'];
  selectedCategory = 'הכל';
  filteredCatalog = [...this.catalog];
  cartItems: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  // פונקציה לטעינת העגלה מה-SQL
  loadCart(): void {
    this.api.exec("sp_GetItems").subscribe({
      next: (data: any) => {
        console.log("נתונים שהתקבלו:", data);
        // מיפוי השדות כדי לוודא תאימות לאותיות גדולות/קטנות מה-DB
        this.cartItems = data.map((item: any) => ({
          id: item.id || item.Id,
          itemName: item.itemName || item.ItemName,
          itemDescription: item.itemDescription || item.ItemDescription
        }));
      },
      error: (err) => console.error("שגיאה בטעינת נתונים:", err)
    });
  }

  // סינון הקטלוג לפי קטגוריה
  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.filteredCatalog = (category === 'הכל') 
      ? [...this.catalog] 
      : this.catalog.filter(p => p.category === category);
  }

  // הוספת מוצר לעגלה בלחיצה
  addToCart(product: any): void {
    console.log("מנסה להוסיף:", product.name);
    
    // יצירת האובייקט שהפרוצדורה sp_InsertItem מצפה לו
    const params = {
      itemName: product.name,
      itemDescription: product.category
    };

    // שליחה לשרת
    this.api.exec("sp_InsertItem", params).subscribe({
      next: () => {
        console.log("המוצר נוסף בהצלחה!");
        this.loadCart(); // רענון הרשימה המוצגת
      },
      error: (err) => {
        console.error("שגיאה בהוספה:", err);
        alert("ההוספה נכשלה. ודאי שה-API רץ.");
      }
    });
  }

  // מחיקת מוצר
  onDeleteItem(id: number): void {
    if (confirm("להסיר את המוצר מהרשימה?")) {
      this.api.exec("sp_DeleteItem", { id: id }).subscribe({
        next: () => this.loadCart(),
        error: (err) => console.error("שגיאה במחיקה:", err)
      });
    }
  }
}