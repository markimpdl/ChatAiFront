import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChatAiService } from './chat-ai.service';
import { environment } from '../environments/environment';

describe('ChatAiService', () => {
  let service: ChatAiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ChatAiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should POST to the correct API URL', () => {
    service.sendMessage('Hello', []).subscribe();

    const req = http.expectOne(environment.apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush('Hi there');
  });

  it('should send question and history in request body', () => {
    const history = [{ role: 'user', content: 'Previous' }];
    service.sendMessage('New question', history).subscribe();

    const req = http.expectOne(environment.apiUrl);
    expect(req.request.body).toEqual({ question: 'New question', history });
    req.flush('Answer');
  });

  it('should return plain text response as string', () => {
    let result = '';
    service.sendMessage('Hi', []).subscribe(res => (result = res));

    http.expectOne(environment.apiUrl).flush('Plain text answer');
    expect(result).toBe('Plain text answer');
  });

  it('should extract answer from JSON response', () => {
    let result = '';
    service.sendMessage('Hi', []).subscribe(res => (result = res));

    http.expectOne(environment.apiUrl).flush(JSON.stringify({ answer: 'JSON answer' }));
    expect(result).toBe('JSON answer');
  });

  it('should return raw string if JSON has no answer field', () => {
    let result = '';
    service.sendMessage('Hi', []).subscribe(res => (result = res));

    const raw = JSON.stringify({ other: 'field' });
    http.expectOne(environment.apiUrl).flush(raw);
    expect(result).toBe(raw);
  });
});
