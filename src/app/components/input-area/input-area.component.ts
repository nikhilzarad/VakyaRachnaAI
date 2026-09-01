import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, ChangeDetectionStrategy } from '@angular/core';


@Component({
    selector: 'app-input-area',
    imports: [],
    templateUrl: './input-area.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./input-area.component.scss']
})
export class InputAreaComponent {
  @Input() inputText = '';
  @Input() wordCount = 0;
  @Input() charCount = 0;
  @Output() inputChange = new EventEmitter<string>();
  @Output() reset = new EventEmitter<void>();
  @ViewChild('textarea') textareaRef!: ElementRef<HTMLTextAreaElement>;

  handleChange(event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    this.inputChange.emit(value);
  }

  handlePaste() {
    requestAnimationFrame(() => {
      const value = this.textareaRef.nativeElement.value;
      this.inputChange.emit(value);
    });
  }

  handleClear() {
    this.reset.emit();
    requestAnimationFrame(() => this.textareaRef.nativeElement.focus());
  }
}
