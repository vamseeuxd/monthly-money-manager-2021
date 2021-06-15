import { TestBed } from '@angular/core/testing';

import { FirebaseCloudMessageService } from './firebase-cloud-message.service';

describe('FirebaseCloudMessageService', () => {
  let service: FirebaseCloudMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseCloudMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
