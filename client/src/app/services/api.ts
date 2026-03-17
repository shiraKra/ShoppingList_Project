import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // ודאי שהפורט 5218 הוא הפורט שרץ אצלך ב-Visual Studio
private url = 'http://localhost:5218/api/Shopping/exec';

  constructor(private http: HttpClient) { }

  exec(spName: string, params: any = {}): Observable<any> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    // שימוש ב-PascalCase (אותיות גדולות) עבור השרת
    const body = {
      SpName: spName,
      Params: params
    };

    return this.http.post(this.url, body, { headers: headers });
  }
}