import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { BadResourceService } from './bad.service';
import { environment } from '../../../environments/environment';

describe('BadResourceService', () => {
  let httpMock: HttpTestingController;
  let originalApiBase: string;
  const listUrlSuffix = '/temperature/all_current.json/0';

  beforeEach(() => {
    originalApiBase = environment.apiBase;
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BadResourceService],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    environment.apiBase = originalApiBase;
    httpMock.verify();
  });

  const flushListIfRequested = () => {
    const pending = httpMock.match((r) => r.url.endsWith(listUrlSuffix));
    pending.forEach((req) => req.flush([]));
  };
  const dummyDetail = { badname: '', plz: '', ort: '' } as any;

  it('uses beta host when configured', fakeAsync(() => {
    const betaUrl = 'https://beta.wiewarm.ch/api/v1';
    environment.apiBase = betaUrl;
    const service = TestBed.inject(BadResourceService);
    tick();
    flushListIfRequested();
    
    let result: any;
    (service as any).loadDetail('foo').then((value: any) => {
      result = value;
    });
    
    const req = httpMock.expectOne(`${betaUrl}/bad/foo`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyDetail);

    tick();
    expect(result).toEqual(dummyDetail);
  }));

  it('uses www host when configured', fakeAsync(() => {
    const wwwUrl = 'https://www.wiewarm.ch/api/v1';
    environment.apiBase = wwwUrl;
    const service = TestBed.inject(BadResourceService);
    tick();
    flushListIfRequested();
    
    let result: any;
    (service as any).loadDetail('foo').then((value: any) => {
      result = value;
    });
    
    const req = httpMock.expectOne(`${wwwUrl}/bad/foo`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyDetail);

    tick();
    expect(result).toEqual(dummyDetail);
  }));

  it('exposes a shared badResource', fakeAsync(() => {
    environment.apiBase = originalApiBase;
    const service = TestBed.inject(BadResourceService);
    const dummyList = [{ bad: 'Test Bad' }] as any;

    // Trigger evaluation, then let resource scheduling settle.
    service.badResource.value();
    tick();

    const req = httpMock.expectOne(
      `${environment.apiBase}${listUrlSuffix}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyList);

    tick();
    expect(service.badResource.value()).toEqual(dummyList);
  }));

});
