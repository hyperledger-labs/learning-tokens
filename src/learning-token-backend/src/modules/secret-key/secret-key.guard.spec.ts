import { SecretKeyGuard } from './secret-key.guard';

describe('SecretKeyGuard', () => {
  it('should be defined', () => {
    expect(new SecretKeyGuard()).toBeDefined();
  });
});
