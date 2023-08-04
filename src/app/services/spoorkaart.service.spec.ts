import { TestBed } from '@angular/core/testing';

import { SpoorkaartService } from './spoorkaart.service';

describe('SpoorkaartService', () => {
  let service: SpoorkaartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpoorkaartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
