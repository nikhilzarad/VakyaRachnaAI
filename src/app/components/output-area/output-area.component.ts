import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';

import { countWords, countChars } from '../../utils/text-helpers';
import { copyToClipboard } from '../../utils/text-helpers';

@Component({
    selector: 'app-output-area',
    imports: [],
    templateUrl: './output-area.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./output-area.component.scss']
})
export class OutputAreaComponent {
  @Input() outputText = '';
  @Input() loading = false;
  @Input() error = '';
  @Output() useAsInput = new EventEmitter<void>();
  @Output() clearError = new EventEmitter<void>();

  copied = false;

  countWords = countWords;
  countChars = countChars;

  async handleCopy() {
    const success = await copyToClipboard(this.outputText);
    if (success) {
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    }
  }
}
