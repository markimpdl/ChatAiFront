import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChatMessage } from './models/chat.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatAiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  sendMessage(question: string, history: ChatMessage[]): Observable<string> {
    return this.http
      .post(this.apiUrl, { question, history }, { responseType: 'text' })
      .pipe(
        map(res => {
          try {
            const parsed = JSON.parse(res);
            return parsed.answer ?? res;
          } catch {
            return res;
          }
        })
      );
  }
}
