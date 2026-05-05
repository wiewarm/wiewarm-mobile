import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { StorageService } from '../storage/storage.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        {
          provide: StorageService,
          useValue: {
            read: () => null,
            write: () => undefined,
            remove: () => undefined,
          },
        },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('canEdit returns true only when session badId matches and active grant exists', async () => {
    const loginPromise = service.doLogin(7, 'test-pin');
    httpMock.expectOne((req) => req.method === 'PUT').flush({});
    await loginPromise;

    expect(service.canEdit(7)).toBeTrue();
    expect(service.canEdit(8)).toBeFalse();
  });

  it('canEdit returns false when session exists but no active grant (e.g. after page reload)', () => {
    service.session.set({ badId: 7 });
    // activeGrant is not set — simulates state after a page reload

    expect(service.canEdit(7)).toBeFalse();
  });
});
