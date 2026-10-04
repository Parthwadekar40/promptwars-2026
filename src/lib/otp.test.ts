import { cancelOtp, issueOtp, verifyOtp } from './otp';
import * as mail from './mail';

vi.mock('./mail', () => ({ sendEmail: vi.fn(async () => ({ ok: true, data: 'sent' })) }));
const sendEmail = vi.mocked(mail.sendEmail);
const lastCode = (): string => String(sendEmail.mock.calls[sendEmail.mock.calls.length - 1][1].passcode);

describe('email one-time code', () => {
  beforeEach(() => {
    sessionStorage.clear();
    sendEmail.mockClear();
  });
  afterEach(() => vi.useRealTimers());

  it('emails a 6-digit code to the address the person typed — never a fixed inbox', async () => {
    expect((await issueOtp('new.user@example.com', 'Asha')).ok).toBe(true);
    const [to, params] = sendEmail.mock.calls[0];
    expect(to).toBe('new.user@example.com');
    expect(params.passcode).toMatch(/^\d{6}$/);
    expect(params.user_name).toBe('Asha');
  });

  it('accepts the right code once, then forgets it', async () => {
    await issueOtp('a@b.co', 'A');
    const code = lastCode();
    expect(verifyOtp(code).ok).toBe(true);
    expect(verifyOtp(code)).toEqual({ ok: false, error: expect.stringMatching(/no code requested/i) });
  });

  it('rejects a wrong code, and a code older than five minutes', async () => {
    vi.useFakeTimers();
    await issueOtp('a@b.co', 'A');
    const code = lastCode();
    expect(verifyOtp(code === '000000' ? '111111' : '000000')).toEqual({
      ok: false,
      error: expect.stringMatching(/not correct/i),
    });
    vi.advanceTimersByTime(5 * 60_000 + 1);
    expect(verifyOtp(code)).toEqual({ ok: false, error: expect.stringMatching(/expired/i) });
  });

  it('cancelling discards the pending code', async () => {
    await issueOtp('a@b.co', 'A');
    const code = lastCode();
    cancelOtp();
    expect(verifyOtp(code).ok).toBe(false);
  });

  it('surfaces a delivery failure so the UI can offer a resend', async () => {
    sendEmail.mockResolvedValueOnce({ ok: false, error: 'Email failed (500)' });
    expect(await issueOtp('a@b.co', 'A')).toEqual({ ok: false, error: 'Email failed (500)' });
  });
});
