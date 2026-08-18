import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonInformationComponent } from './json-information.component';

describe('JsonInformationComponent', () => {
  let component: JsonInformationComponent;
  let fixture: ComponentFixture<JsonInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
