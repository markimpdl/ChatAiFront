import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { HttpClientModule } from '@angular/common/http';
import { ChatAiService } from '../chat-ai.service';
import { ChatMessage, UiMessage } from '../models/chat.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule,
    NzSpinModule,
    NzTagModule
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  messages: UiMessage[] = [];
  history: ChatMessage[] = [];
  question = '';
  loading = false;

  constructor(private chatAi: ChatAiService) {}

  send(): void {
    if (!this.question.trim()) return;
    const q = this.question;
    this.messages.push({ role: 'user', text: q });
    this.question = '';
    this.loading = true;

    this.chatAi.sendMessage(q, [...this.history]).subscribe({
      next: (answer) => {
        this.history.push({ role: 'user', content: q });
        this.history.push({ role: 'assistant', content: answer });
        this.messages.push({ role: 'ai', text: answer });
        this.loading = false;
      },
      error: () => {
        this.messages.push({ role: 'ai', text: 'Failed to get response' });
        this.loading = false;
      }
    });
  }

  formatMessage(text: string): string {
    return text.replace(/\n/g, '<br>');
  }
}
