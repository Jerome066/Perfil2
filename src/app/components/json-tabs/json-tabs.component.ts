import { Component, input, output } from '@angular/core';
import {MatTabChangeEvent, MatTabsModule} from '@angular/material/tabs';
import { JsonTabs } from '../../models/json-tabs';


@Component({
  selector: 'app-json-tabs',
  imports: [MatTabsModule],
  templateUrl: './json-tabs.component.html',
  styleUrl: './json-tabs.component.css'
})
export class JsonTabsComponent {
  tabs = input.required<JsonTabs[]>();
  tabActual = output <number>();

  onTabChange(event: MatTabChangeEvent): void {
    console.log('Selected index:', event.index);
    console.log('Tab label:', event.tab.textLabel);
    this.tabActual.emit(event.index);
  }
}
