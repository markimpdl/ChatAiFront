import { test, expect } from '@playwright/test';

test.describe('Chat AI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the chat card with title', async ({ page }) => {
    await expect(page.locator('.ant-card-head-title')).toContainText('Chat AI');
  });

  test('should display input and send button', async ({ page }) => {
    await expect(page.locator('input[nz-input]')).toBeVisible();
    await expect(page.locator('button:has-text("Send")')).toBeVisible();
  });

  test('send button should be disabled when input is empty', async ({ page }) => {
    await expect(page.locator('button:has-text("Send")')).toBeDisabled();
  });

  test('send button should be enabled when input has text', async ({ page }) => {
    await page.locator('input[nz-input]').fill('Hello');
    await expect(page.locator('button:has-text("Send")')).toBeEnabled();
  });

  test('should add user message to chat on send', async ({ page }) => {
    await page.route('**/api/ChatAi', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: 'Hello! How can I help you?',
      });
    });

    await page.locator('input[nz-input]').fill('Hi there');
    await page.locator('button:has-text("Send")').click();

    await expect(page.locator('text=Hi there')).toBeVisible();
  });

  test('should display AI response after sending message', async ({ page }) => {
    await page.route('**/api/ChatAi', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: 'Hello! How can I help you?',
      });
    });

    await page.locator('input[nz-input]').fill('Hi');
    await page.locator('button:has-text("Send")').click();

    await expect(page.locator('text=Hello! How can I help you?')).toBeVisible();
  });

  test('should clear input after sending message', async ({ page }) => {
    await page.route('**/api/ChatAi', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: 'Response',
      });
    });

    const input = page.locator('input[nz-input]');
    await input.fill('My question');
    await page.locator('button:has-text("Send")').click();

    await expect(input).toHaveValue('');
  });

  test('should display error message on API failure', async ({ page }) => {
    await page.route('**/api/ChatAi', async (route) => {
      await route.fulfill({ status: 502 });
    });

    await page.locator('input[nz-input]').fill('Test question');
    await page.locator('button:has-text("Send")').click();

    await expect(page.locator('text=Failed to get response')).toBeVisible();
  });

  test('should send message on Enter key press', async ({ page }) => {
    await page.route('**/api/ChatAi', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: 'Response via Enter',
      });
    });

    await page.locator('input[nz-input]').fill('Enter key test');
    await page.locator('input[nz-input]').press('Enter');

    await expect(page.locator('text=Enter key test')).toBeVisible();
  });

  test('should send conversation history with each request', async ({ page }) => {
    const requests: unknown[] = [];

    await page.route('**/api/ChatAi', async (route) => {
      const body = route.request().postDataJSON();
      requests.push(body);
      await route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: `Answer ${requests.length}`,
      });
    });

    await page.locator('input[nz-input]').fill('First question');
    await page.locator('button:has-text("Send")').click();
    await expect(page.locator('text=Answer 1')).toBeVisible();

    await page.locator('input[nz-input]').fill('Second question');
    await page.locator('button:has-text("Send")').click();
    await expect(page.locator('text=Answer 2')).toBeVisible();

    const secondRequest = requests[1] as { question: string; history: unknown[] };
    expect(secondRequest.history).toHaveLength(2);
    expect(secondRequest.history[0]).toMatchObject({ role: 'user', content: 'First question' });
    expect(secondRequest.history[1]).toMatchObject({ role: 'assistant', content: 'Answer 1' });
  });
});
