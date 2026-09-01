import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ACTIONS, CUSTOM_ACTION } from '../../actions';

@Component({
    selector: 'app-action-bar',
    imports: [CommonModule],
    templateUrl: './action-bar.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./action-bar.component.scss']
})
export class ActionBarComponent {
  @Input() activeAction: any;
  @Output() actionSelect = new EventEmitter<any>();
  @Output() toggleCustom = new EventEmitter<void>();

  actions = ACTIONS;
  customAction = CUSTOM_ACTION;

  handleClick(action: any) {
    this.actionSelect.emit(action);
  }

  selectCustom() {
    this.actionSelect.emit(this.customAction);
    this.toggleCustom.emit();
  }
}
