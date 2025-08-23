import { BadResourceService } from './bad.service';
import { environment } from '../../../environments/environment';

describe('BadResourceService API base', () => {
  jasmine.getEnv().allowRespy(true);

  const dummyDetail = { badname: '', plz: '', ort: '' } as any;

  beforeEach(() => {
    environment.apiBase = 'https://www.wiewarm.ch/api/v1';
  });

  it('uses www host by default', async () => {
    const fetchSpy = spyOn(globalThis, 'fetch').and.resolveTo({
      ok: true,
      json: async () => dummyDetail,
    } as Response);

    const service = new BadResourceService();
    await (service as any).loadDetail('foo');

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://www.wiewarm.ch/api/v1/bad/foo',
      { signal: undefined }
    );
  });

  it('uses beta host when configured', async () => {
    environment.apiBase = 'https://beta.wiewarm.ch/api/v1';
    const fetchSpy = spyOn(globalThis, 'fetch').and.resolveTo({
      ok: true,
      json: async () => dummyDetail,
    } as Response);

    const service = new BadResourceService();
    await (service as any).loadDetail('foo');

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://beta.wiewarm.ch/api/v1/bad/foo',
      { signal: undefined }
    );
  });
});
