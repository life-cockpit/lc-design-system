import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipDirective, ButtonComponent, CardComponent } from '@life-cockpit/ui-kit';

@Component({
  selector: 'app-tooltip-demo',
  standalone: true,
  imports: [CommonModule, TooltipDirective, ButtonComponent, CardComponent],
  templateUrl: './tooltip-demo.component.html',
  styleUrls: ['./tooltip-demo.component.scss'],
})
export class TooltipDemoComponent {}
