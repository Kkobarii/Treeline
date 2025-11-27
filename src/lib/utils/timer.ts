export type Checkpoint = {
  label: string;
  time: number;
  elapsed: number;
  delta: number;
};

export class Timer {
  private startTime: number;
  private lastTime: number;
  private checkpoints: Checkpoint[] = [];

  constructor(startNow = true) {
    this.startTime = performance.now();
    this.lastTime = this.startTime;
    if (!startNow) {
      this.startTime = performance.now();
      this.lastTime = this.startTime;
    }
  }

  checkpoint(label: string): Checkpoint {
    const now = performance.now();
    const elapsed = now - this.startTime;
    const delta = now - this.lastTime;
    const cp: Checkpoint = { label, time: now, elapsed, delta };
    this.checkpoints.push(cp);
    this.lastTime = now;
    return cp;
  }

  getCheckpoints(): Checkpoint[] {
    return this.checkpoints.slice();
  }

  printReport(prefix = '', logger: (msg?: any) => void = console.log): void {
    const now = performance.now();
    if (this.checkpoints.length === 0) {
      const total = now - this.startTime;
      logger(prefix + `Timer report:  (no checkpoints) total: ${this._formatMs(total)}`);
      return;
    }

    type Row = { idx: string; label: string; total: string; since: string };
    const rows: Row[] = this.checkpoints.map((cp, i) => ({
      idx: String(i + 1),
      label: cp.label,
      total: this._formatMs(cp.elapsed),
      since: this._formatMs(cp.delta),
    }));

    // compute column widths
    const idxW = Math.max(...rows.map(r => r.idx.length), 2);
    const labelW = Math.max(...rows.map(r => r.label.length), 5);
    const totalW = Math.max(...rows.map(r => r.total.length), 10);
    const sinceW = Math.max(...rows.map(r => r.since.length), 10);

    const pad = (s: string, w: number) => s + ' '.repeat(Math.max(0, w - s.length));

    const header = `| ${pad('#', idxW)} | ${pad('Label', labelW)} | ${pad('Total', totalW)} | ${pad('Since Last', sinceW)} |`;
    const sep = `|-${'-'.repeat(idxW)}-|-${'-'.repeat(labelW)}-|-${'-'.repeat(totalW)}-|-${'-'.repeat(sinceW)}-|`;

    const lines: string[] = [];
    lines.push('Timer report:');
    lines.push(header);
    lines.push(sep);
    for (const r of rows) {
      lines.push(`| ${pad(r.idx, idxW)} | ${pad(r.label, labelW)} | ${pad(r.total, totalW)} | ${pad(r.since, sinceW)} |`);
    }

    const totalNow = now - this.startTime;
    const sinceLast = now - this.lastTime;
    lines.push(`| ${' '.repeat(idxW)} | ${' '.repeat(labelW)} | ${pad(this._formatMs(totalNow), totalW)} | ${pad(this._formatMs(sinceLast), sinceW)} |`);

    logger(prefix + '\n' + lines.join('\n'));
  }

  private _formatMs(ms: number): string {
    return `${ms.toFixed(3)}ms`;
  }
}
