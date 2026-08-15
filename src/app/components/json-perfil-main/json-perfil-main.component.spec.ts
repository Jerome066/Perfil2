import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonPerfilMainComponent } from './json-perfil-main.component';

describe('JsonPerfilMainComponent', () => {
  let component: JsonPerfilMainComponent;
  let fixture: ComponentFixture<JsonPerfilMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonPerfilMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonPerfilMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
