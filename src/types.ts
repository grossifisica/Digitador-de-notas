export interface GradeItem {
  id: string;
  student: string;
  grade: string;
  status: 'pending' | 'active' | 'copied' | 'completed' | 'error';
  errorMessage?: string;
}

export interface AutomationSettings {
  initialDelay: number;         // seconds (default: 3)
  typingInterval: number;       // seconds (default: 2)
  tabCount: number;             // number of TAB presses (default: 1, range 1-20)
  soundEnabled: boolean;        // audio beeps
  voiceEnabled: boolean;        // speak grade aloud
  autoScroll: boolean;          // auto scroll table to active item
}

export type AutomationStatus = 'idle' | 'countdown' | 'typing' | 'paused' | 'completed';

export interface AutomationProgress {
  status: AutomationStatus;
  currentIndex: number;
  currentStepDescription: string;
  countdownSecondsLeft: number;
  intervalProgressPercent: number;
  copiedCount: number;
  totalCount: number;
  lastCopiedValue: string | null;
  currentTabStep: number;
}
