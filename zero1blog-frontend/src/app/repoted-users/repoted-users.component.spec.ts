import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepotedUsersComponent } from './repoted-users.component';

describe('RepotedUsersComponent', () => {
  let component: RepotedUsersComponent;
  let fixture: ComponentFixture<RepotedUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepotedUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepotedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
