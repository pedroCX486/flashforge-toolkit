import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorscreenComponent } from './monitorscreen.component';

describe('MonitorscreenComponent', () => {
  let component: MonitorscreenComponent;
  let fixture: ComponentFixture<MonitorscreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MonitorscreenComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
