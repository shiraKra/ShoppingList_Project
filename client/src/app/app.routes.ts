import { Routes } from '@angular/router';
import { ItemsListComponent } from './pages/items-list/items-list';
import { EditItem } from './components/edit-item/edit-item';
import { Summary } from './components/summary/summary'; // הוספת ה-Import

export const routes: Routes = [
  { path: '', redirectTo: 'items-list', pathMatch: 'full' },
  { path: 'items-list', component: ItemsListComponent },
  { path: 'edit-item/:id', component: EditItem },
  { path: 'summary', component: Summary } // הנתיב החדש לעמוד הסיכום
];