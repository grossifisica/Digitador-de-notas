/**
 * Web Worker-based timer to guarantee zero throttling even when the window
 * loses focus (lost focus / background tab / minimized).
 */

type TickCallback = () => void;

export class BackgroundTimer {
  private worker: Worker | null = null;
  private fallbackInterval: number | null = null;
  private tickCallback: TickCallback | null = null;
  private intervalMs: number = 100;
  private isRunning: boolean = false;

  constructor(intervalMs: number = 100) {
    this.intervalMs = intervalMs;
    this.initWorker();
  }

  private initWorker(): void {
    try {
      const workerCode = `
        let timer = null;
        self.onmessage = function(e) {
          if (e.data.action === 'start') {
            if (timer) clearInterval(timer);
            const interval = e.data.interval || 100;
            timer = setInterval(function() {
              self.postMessage({ type: 'tick' });
            }, interval);
          } else if (e.data.action === 'stop') {
            if (timer) {
              clearInterval(timer);
              timer = null;
            }
          }
        };
      `;
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      this.worker = new Worker(workerUrl);

      this.worker.onmessage = (e) => {
        if (e.data?.type === 'tick' && this.tickCallback && this.isRunning) {
          this.tickCallback();
        }
      };
    } catch (err) {
      console.warn('Web Worker initialization failed, using standard timer fallback', err);
      this.worker = null;
    }
  }

  public start(callback: TickCallback, intervalMs?: number): void {
    if (intervalMs) {
      this.intervalMs = intervalMs;
    }
    this.tickCallback = callback;
    this.isRunning = true;

    if (this.worker) {
      this.worker.postMessage({ action: 'start', interval: this.intervalMs });
    } else {
      if (this.fallbackInterval) clearInterval(this.fallbackInterval);
      this.fallbackInterval = window.setInterval(() => {
        if (this.tickCallback && this.isRunning) {
          this.tickCallback();
        }
      }, this.intervalMs);
    }
  }

  public stop(): void {
    this.isRunning = false;
    if (this.worker) {
      this.worker.postMessage({ action: 'stop' });
    }
    if (this.fallbackInterval) {
      clearInterval(this.fallbackInterval);
      this.fallbackInterval = null;
    }
  }

  public destroy(): void {
    this.stop();
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}
