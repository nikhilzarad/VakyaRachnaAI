import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild, ChangeDetectionStrategy } from '@angular/core';


@Component({
    selector: 'app-custom-prompt',
    imports: [],
    templateUrl: './custom-prompt.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./custom-prompt.component.scss']
})
export class CustomPromptComponent implements AfterViewInit {
  @Input() customPrompt = '';
  @Output() promptChange = new EventEmitter<string>();
  @ViewChild('textarea') textareaRef!: ElementRef<HTMLTextAreaElement>;

  suggestions = [
    'Translate this to Hindi',
    'Rewrite this as a tweet thread',
    'Make this sound more confident',
    'Simplify this for a 10 year old',
  ];

  ngAfterViewInit() {
    requestAnimationFrame(() => this.textareaRef?.nativeElement?.focus());
  }

  handleChange(event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    this.promptChange.emit(value);
  }

  handleSuggestionClick(suggestion: string) {
    this.promptChange.emit(suggestion);
    requestAnimationFrame(() => this.textareaRef?.nativeElement?.focus());
  }
}
