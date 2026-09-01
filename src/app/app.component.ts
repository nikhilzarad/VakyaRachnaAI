
import { HostListener, Component, ChangeDetectionStrategy } from '@angular/core';
import { ActionItem, ACTIONS, CUSTOM_ACTION } from './actions';
import { AiService } from './services/ai.service';
import { countWords, countChars } from './utils/text-helpers';
import { InputAreaComponent } from './components/input-area/input-area.component';
import { ActionBarComponent } from './components/action-bar/action-bar.component';
import { OutputAreaComponent } from './components/output-area/output-area.component';
import { CustomPromptComponent } from './components/custom-prompt/custom-prompt.component';
import { HistorySidebarComponent, HistoryItem } from './components/history-sidebar/history-sidebar.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-root',
    imports: [
    InputAreaComponent,
    ActionBarComponent,
    OutputAreaComponent,
    CustomPromptComponent,
    HistorySidebarComponent,
    MatButtonModule
],
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
  inputText = '';
  outputText = '';
  activeAction: ActionItem | null = null;
  customPrompt = '';
  showCustomPrompt = false;
  showHistorySidebar = false;
  history: HistoryItem[] = [];
  wordCount = 0;
  charCount = 0;

  constructor(public aiService: AiService) {}

  get loading() {
    return this.aiService.loading;
  }

  get error() {
    return this.aiService.error;
  }

  get runButtonLabel() {
    if (!this.activeAction) {
      return 'Select Action';
    }

    switch (this.activeAction?.id) {
      case 'improve':
        return 'Improve Text';
      case 'rewrite':
        return 'Rewrite Text';
      case 'summarize':
        return 'Summarize Text';
      case 'expand':
        return 'Expand Text';
      case 'formal':
        return 'Make Formal';
      case 'casual':
        return 'Make Casual';
      case 'shorter':
        return 'Shorten Text';
      case 'grammar':
        return 'Fix Grammar';
      case 'custom':
        return 'Transform Text';
      default:
        return 'Transform Text';
    }
  }

  get isRunDisabled() {
    return this.loading || !this.activeAction;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      this.handleRun();
    }
  }

  handleInputChange(value: string) {
    this.inputText = value;
    this.wordCount = countWords(value);
    this.charCount = countChars(value);
  }

  handleReset() {
    this.inputText = '';
    this.outputText = '';
    this.activeAction = null;
    this.customPrompt = '';
    this.history = [];
    this.wordCount = 0;
    this.charCount = 0;
    this.aiService.clearError();
  }

  handleToggleCustom() {
    this.showCustomPrompt = this.activeAction?.id === CUSTOM_ACTION.id;
  }

  handleActionSelect(action: ActionItem) {
    this.activeAction = action;
    this.showCustomPrompt = action.id === CUSTOM_ACTION.id;
  }

  handleCustomPromptChange(value: string) {
    this.customPrompt = value;
  }

  async handleRun() {
    if (!this.inputText.trim() || !this.activeAction) return;

    const prompt = (this.activeAction.id === CUSTOM_ACTION.id ? this.customPrompt : this.activeAction.prompt).trim();
    if (!prompt) return;

    const result = await this.aiService.runAI(prompt, this.inputText, this.activeAction.id);

    if (result) {
      this.outputText = result;
      this.history = [
        {
          action: this.activeAction.label,
          input: this.inputText,
          output: result,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...this.history,
      ].slice(0, 5);
    }
  }

  handleUseAsInput() {
    if (!this.outputText) return;
    this.inputText = this.outputText;
    this.outputText = '';
    this.wordCount = countWords(this.inputText);
    this.charCount = countChars(this.inputText);
  }

  handleRestore(item: HistoryItem) {
    this.outputText = item.output;
    this.inputText = item.input;
    this.wordCount = countWords(this.inputText);
    this.charCount = countChars(this.inputText);
    this.showHistorySidebar = false;
  }

  clearError() {
    this.aiService.clearError();
  }
}
