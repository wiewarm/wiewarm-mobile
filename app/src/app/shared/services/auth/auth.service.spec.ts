import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { StorageService } from '../storage/storage.service';

describe('AuthService', () => {
  let service: AuthService;

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
  });

  it('canEdit returns true only when session badId matches', () => {
    service.session.set({ badId: 7 });

    expect(service.canEdit(7)).toBeTrue();
    expect(service.canEdit(8)).toBeFalse();
  });
});
