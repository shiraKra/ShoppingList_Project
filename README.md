# 🛒 פרויקט ניהול רשימת קניות - הכנה לפרקטיקום

[cite_start]פרויקט Full-Stack הממומש בארכיטקטורת שלוש שכבות: **Angular**, **.NET Web API**, ו-**SQL Server**[cite: 3].

## 📝 נושא הפרויקט: ניהול רשימת קניות
[cite_start]המערכת מאפשרת למשתמש לנהל רשימת מוצרים לקנייה, לשייך אותם לקטגוריות ולעקוב אחר סטטוס הביצוע (טרם נקנה/בעגלה/בוצע)[cite: 48, 62].

## 🏗 ארכיטקטורה ומבנה המערכת
[cite_start]המערכת בנויה כך שצד השרת (API) משמש כ"צינור" (Pipe) בלבד בין הלקוח למסד הנתונים[cite: 103, 154].
* [cite_start]**שכבת הלקוח (Angular):** מכילה Service מרכזי אחד המבצע את כל הקריאות ל-Endpoint יחיד בשרת (`POST /api/exec`)[cite: 91, 107, 151].
* [cite_start]**שכבת השרת (.NET API):** מקבלת בקשה גנרית הכוללת את שם הפרוצדורה ופרמטרים בפורמט JSON, ומנתבת אותה להרצה ב-SQL Server[cite: 92, 127].
* **שכבת הנתונים (SQL Server):** כל הלוגיקה העסקית ממומשת בתוך **Stored Procedures**. [cite_start]אין שאילתות SQL ישירות בקוד השרת[cite: 20, 159].

## 🗄 מבנה מסד הנתונים
[cite_start]המסד כולל 3 טבלאות עם קשרי גומלין (Foreign Keys)[cite: 55]:
1. [cite_start]**ShoppingItems (טבלה ראשית):** מוצרים, תיאור, מזהה קטגוריה, מזהה סטטוס ותאריך יצירה[cite: 56, 58].
2. [cite_start]**Categories (טבלת עזר):** ניהול קטגוריות המוצרים (חלב וביצים, ירקות ופירות, מאפייה וכו')[cite: 65].
3. [cite_start]**Statuses (טבלת עזר):** ניהול סטטוסי הקנייה (טרם נקנה, בעגלה, בוצע)[cite: 65].

## ⚙️ Stored Procedures שמומשו (CRUD & Search)
[cite_start]בפרויקט מומשו הפרוצדורות הבאות כנדרש[cite: 70, 72]:
* [cite_start]`sp_AddItem`: הוספת מוצר חדש לטבלה הראשית[cite: 74].
* [cite_start]`sp_GetAllItems`: שליפת רשימת המוצרים הכוללת JOIN לקבלת שמות קטגוריה וסטטוס[cite: 79].
* [cite_start]`sp_GetItemById`: שליפת רשומה לפי מזהה לצורך הצגת פרטים[cite: 76].
* [cite_start]`sp_UpdateItem`: עדכון רשומה קיימת בטבלה הראשית[cite: 75].
* [cite_start]`sp_SearchItems`: חיפוש טקסט חופשי על שם המוצר[cite: 79].
* [cite_start]`sp_ToggleItemStatus`: פעולה נוספת לשינוי סטטוס המוצר (Toggle)[cite: 81].
* [cite_start]`sp_DeleteItem`: מחיקת מוצר מהרשימה[cite: 84].
* `sp_GetSummary`: קבלת סיכום כמותי של המוצרים בסל.

## 🚀 הוראות הרצה
### 1. מסד נתונים (SQL Server)
* הריצי את קובץ ה-SQL הנמצא בתיקיית `DB` בתוך SQL Server Management Studio. [cite_start]הסקריפט יצור את ה-DB, הטבלאות, הפרוצדורות ונתוני הדוגמה[cite: 163, 164].

### 2. צד שרת (.NET API)
* פתחי את הפרויקט ב-Visual Studio.
* עדכני את ה-Connection String בקובץ `appsettings.json` לשרת המקומי שלך.
* [cite_start]הריצי את הפרויקט (F5)[cite: 170].

### 3. צד לקוח (Angular)
* פתחי טרמינל בתיקיית ה-client.
* הריצי `npm install` להתקנת הספריות.
* [cite_start]הריצי `ng serve` לפתיחת האפליקציה בכתובת `http://localhost:4200`[cite: 170].

---
[cite_start]**מוגש במסגרת פרויקט קדם לפרקטיקום.** [cite: 2]
