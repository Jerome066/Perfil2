import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonTabsComponent } from './json-tabs.component';

describe('JsonTabsComponent', () => {
  let component: JsonTabsComponent;
  let fixture: ComponentFixture<JsonTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
