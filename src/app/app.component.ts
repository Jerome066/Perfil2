import { Component } from '@angular/core';
import { JsonPerfilMainComponent } from "./components/json-perfil-main/json-perfil-main.component";

@Component({
  selector: 'app-root',
  imports: [ JsonPerfilMainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Perfil2';
}
