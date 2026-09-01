import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';

import { truncateText } from '../../utils/text-helpers';

export interface HistoryItem {
  action: string;
  input: string;
  output: string;
  timestamp: string;
}

@Component({
    selector: 'app-history-sidebar',
    imports: [],
    templateUrl: './history-sidebar.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./history-sidebar.component.scss']
})
export class HistorySidebarComponent {
  @Input() history: HistoryItem[] = [];
  @Output() restore = new EventEmitter<HistoryItem>();

  expandedIndex: number | null = null;

  truncateText = truncateText;

  toggleIndex(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }
}
