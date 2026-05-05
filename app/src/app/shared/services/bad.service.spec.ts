import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { BadResourceService } from './bad.service';
import { AuthService } from './auth/auth.service';
import { environment } from '../../../environments/environment';

describe('BadResourceService', () => {
  let httpMock: HttpTestingController;
  let originalApiBase: string;
  const listUrlSuffix = '/temperature/all_current.json/0';

  beforeEach(() => {
    originalApiBase = environment.apiBase;
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BadResourceService,
        {
          provide: AuthService,
          useValue: {
            getEditCredential: () => '1234',
          },
        },
      ],
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

  const dummyDetail = { badid: 1, badname: '', plz: '', ort: '' } as any;

  it('uses configured host for API requests', fakeAsync(() => {
    const apiUrl = 'https://www.wiewarm.ch/api/v1';
    environment.apiBase = apiUrl;
    const service = TestBed.inject(BadResourceService);
    tick();
    flushListIfRequested();
    
    let result: any;
    service.getDetail('foo').then((value: any) => {
      result = value;
    });
    
    const req = httpMock.expectOne(`${apiUrl}/bad/foo`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyDetail);

    tick();
    expect(result).toEqual(jasmine.objectContaining(dummyDetail));
  }));

  it('normalizes numeric detail fields from API strings', fakeAsync(() => {
    environment.apiBase = originalApiBase;
    const service = TestBed.inject(BadResourceService);
    tick();
    flushListIfRequested();

    let result: any;
    service.getDetail('foo').then((value: any) => {
      result = value;
    });

    const req = httpMock.expectOne(`${environment.apiBase}/bad/foo`);
    expect(req.request.method).toBe('GET');
    req.flush({
      badid: '7',
      badname: 'Testbad',
      plz: '8000',
      ort: 'Zuerich',
      becken: {
        Hauptbecken: {
          beckenid: '22',
          beckenname: 'Hauptbecken',
          typ: 'Freibad',
          status: 'offen',
          date_pretty: '12.04.',
          temp: '15.6',
        },
      },
    });

    tick();
    expect(result.badid).toBe(7);
    expect(result.becken.Hauptbecken.beckenid).toBe(22);
    expect(result.becken.Hauptbecken.temp).toBe(15.6);
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

  it('updates a cached detail loaded by slug lookup', fakeAsync(() => {
    environment.apiBase = originalApiBase;
    const service = TestBed.inject(BadResourceService);
    tick();
    flushListIfRequested();
    const detail = {
      badid: '42',
      badname: 'Testbad',
      plz: '8000',
      ort: 'Zuerich',
      adresse1: 'Alt',
      zeiten: '09-18',
      preise: '5',
      info: 'Info',
    } as any;

    let loadedDetail: any;
    service.getDetail('testbad').then((value: any) => {
      loadedDetail = value;
    });

    const getReq = httpMock.expectOne(`${environment.apiBase}/bad/testbad`);
    expect(getReq.request.method).toBe('GET');
    getReq.flush(detail);
    tick();

    expect(loadedDetail).toEqual(
      jasmine.objectContaining({
        ...detail,
        badid: 42,
      }),
    );

    service.updateBadFields(42, { ort: 'Bern', email: 'bad@example.ch' });

    const putReq = httpMock.expectOne(`${environment.apiBase}/bad`);
    expect(putReq.request.method).toBe('PUT');
    expect(putReq.request.body).toEqual(
      jasmine.objectContaining({
        ...detail,
        ort: 'Bern',
        email: 'bad@example.ch',
        badid: 42,
        pincode: '1234',
      }),
    );
    putReq.flush({});
    tick();
  }));
});
