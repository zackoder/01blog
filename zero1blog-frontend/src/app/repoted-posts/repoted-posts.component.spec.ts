import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepotedPostsComponent } from './repoted-posts.component';

describe('RepotedPostsComponent', () => {
  let component: RepotedPostsComponent;
  let fixture: ComponentFixture<RepotedPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepotedPostsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepotedPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
