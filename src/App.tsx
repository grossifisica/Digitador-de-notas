import { useState } from 'react';
import { 
  GradeItem, 
  AutomationSettings 
} from './types';
import { 
  generateLinuxBashScript,
  generatePythonScript,
  generateWindowsVbsScript,
  generateWindowsBatchScript,
  generateBookmarkletCode,
  downloadFile 
} from './utils/scriptGenerators';
import { SettingsSliders } from './components/SettingsSliders';
import { GradeTable } from './components/GradeTable';
import { PasteModal } from './components/PasteModal';
import { DesktopExportModal } from './components/DesktopExportModal';
import { Terminal, Download, Check, Copy, Flame, Monitor, Keyboard } from 'lucide-react';

const DEFAULT_SETTINGS: AutomationSettings = {
  initialDelay: 3,         // 3 seconds default
  typingInterval: 2,       // 2 seconds default
  tabCount: 1,             // 1 TAB default (range 1 to 20)
  soundEnabled: true,
  voiceEnabled: false,
  autoScroll: true,
};

export default function App() {
  const [grades, setGrades] = useState<GradeItem[]>([]);
  const [settings, setSettings] = useState<AutomationSettings>(DEFAULT_SETTINGS);

  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [copiedBookmarklet, setCopiedBookmarklet] = useState(false);
  const [copiedTerminalCommand, setCopiedTerminalCommand] = useState(false);

  const activeGrades = grades.filter((g) => g.grade.trim() !== '');

  const handleAddRow = () => {
    const newRow: GradeItem = {
      id: `grade-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      student: `Aluno ${grades.length + 1}`,
      grade: '',
      status: 'pending',
    };
    setGrades((prev) => [...prev, newRow]);
  };

  const handleUpdateRow = (id: string, field: 'student' | 'grade', value: string) => {
    setGrades((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDeleteRow = (id: string) => {
    setGrades((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setGrades([]);
  };

  const handleLoadSample = () => {
    const sampleData: GradeItem[] = [
      { id: 'sample-1', student: 'Ana Clara Albuquerque', grade: '9.5', status: 'pending' },
      { id: 'sample-2', student: 'Bruno Henrique Silva', grade: '8.0', status: 'pending' },
      { id: 'sample-3', student: 'Carlos Eduardo Santos', grade: '7.5', status: 'pending' },
      { id: 'sample-4', student: 'Daniela Ferreira Costa', grade: '10.0', status: 'pending' },
      { id: 'sample-5', student: 'Felipe Augusto Rocha', grade: '6.5', status: 'pending' },
      { id: 'sample-6', student: 'Gabriela Mendes Lima', grade: '8.8', status: 'pending' },
      { id: 'sample-7', student: 'Lucas Vinicius Oliveira', grade: '9.0', status: 'pending' },
      { id: 'sample-8', student: 'Mariana Duarte Souza', grade: '7.0', status: 'pending' },
    ];
    setGrades(sampleData);
  };

  const handleImportGrades = (newItems: GradeItem[], replace: boolean) => {
    if (replace) {
      setGrades(newItems);
    } else {
      setGrades((prev) => [...prev, ...newItems]);
    }
  };

  const handleUpdateSettings = (newSettings: Partial<AutomationSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Linux Bash Script (.sh)
  const handleDownloadLinuxBash = () => {
    const script = generateLinuxBashScript(grades, settings);
    downloadFile(script, 'digitar_notas_linux.sh', 'application/x-sh;charset=utf-8');
  };

  // Windows VBScript (.vbs)
  const handleDownloadWindowsVbs = () => {
    const script = generateWindowsVbsScript(grades, settings);
    downloadFile(script, 'digitar_notas_windows.vbs', 'text/plain;charset=utf-8');
  };

  // Windows Batch Script (.bat)
  const handleDownloadWindowsBatch = () => {
    const script = generateWindowsBatchScript(grades, settings);
    downloadFile(script, 'digitar_notas_windows.bat', 'text/plain;charset=utf-8');
  };

  // Python Script (.py)
  const handleDownloadPython = () => {
    const script = generatePythonScript(grades, settings);
    downloadFile(script, 'digitar_notas.py', 'text/x-python;charset=utf-8');
  };

  // Copy Linux Terminal Command
  const handleCopyTerminalCommand = () => {
    navigator.clipboard.writeText('chmod +x digitar_notas_linux.sh && ./digitar_notas_linux.sh');
    setCopiedTerminalCommand(true);
    setTimeout(() => setCopiedTerminalCommand(false), 2500);
  };

  // Copy Bookmarklet
  const handleCopyBookmarklet = () => {
    const code = generateBookmarkletCode(grades, settings);
    navigator.clipboard.writeText(code);
    setCopiedBookmarklet(true);
    setTimeout(() => setCopiedBookmarklet(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* APP TITLE BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Digitador de Notas - Prof. Grossi
              </h1>
            </div>
          </div>
        </div>

        {/* SCRIPTS DE EXECUÇÃO: LINUX & WINDOWS */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border-2 border-emerald-500/40 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Flame className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  Scripts com Teclas Físicas (Linux &amp; Windows)
                </h2>
                <p className="text-xs text-slate-300">
                  Aperta fisicamente <strong>CONTROL+V</strong> e <strong>TAB</strong> no teclado no seu LibreOffice, Excel ou sistema escolar fora do navegador
                </p>
              </div>
            </div>

            <div className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
              {activeGrades.length} {activeGrades.length === 1 ? 'nota configurada' : 'notas configuradas'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* LINUX BLOCK */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Terminal className="w-4 h-4" /> Para Linux (Ubuntu, Mint, Debian, Fedora, Arch)
                  </span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                    xdotool / wl-copy
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Script Bash nativo para execução com teclas físicas via terminal no Linux.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleDownloadLinuxBash}
                  disabled={activeGrades.length === 0}
                  className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar Script Linux (.sh)</span>
                </button>

                <div className="flex items-center justify-between gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800 text-[11px] font-mono">
                  <span className="text-slate-400 truncate">chmod +x digitar_notas_linux.sh &amp;&amp; ./digitar_notas_linux.sh</span>
                  <button
                    type="button"
                    onClick={handleCopyTerminalCommand}
                    className="text-xs text-emerald-400 hover:text-emerald-300 shrink-0 font-sans font-semibold flex items-center gap-1"
                  >
                    {copiedTerminalCommand ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTerminalCommand ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* WINDOWS BLOCK */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Monitor className="w-4 h-4" /> Para Windows (10 / 11)
                  </span>
                  <span className="text-[10px] bg-sky-500/10 text-sky-300 px-2 py-0.5 rounded border border-sky-500/20 font-mono">
                    2 Cliques / Sem Instalação
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Dê 2 cliques no arquivo baixado: o Windows apertará Ctrl+V e TAB no seu teclado.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDownloadWindowsVbs}
                  disabled={activeGrades.length === 0}
                  className="px-3 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/30 transition-all hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Executável silencioso com 2 cliques nativo do Windows"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Executável (.vbs)</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadWindowsBatch}
                  disabled={activeGrades.length === 0}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Arquivo Batch para Windows"
                >
                  <Download className="w-3.5 h-3.5 text-sky-400" />
                  <span>Batch (.bat)</span>
                </button>
              </div>
            </div>
          </div>

          {/* SECONDARY ROW: PYTHON & WEB INJECTOR */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <span>Outras formas de automação:</span>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleDownloadPython}
                disabled={activeGrades.length === 0}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium flex items-center gap-1.5 transition-colors disabled:opacity-40"
              >
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span>Script Python (.py)</span>
              </button>

              <button
                type="button"
                onClick={handleCopyBookmarklet}
                disabled={activeGrades.length === 0}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium flex items-center gap-1.5 transition-colors disabled:opacity-40"
                title="Copiar código para colar no console do seu portal escolar ou salvar nos favoritos"
              >
                {copiedBookmarklet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
                <span>{copiedBookmarklet ? 'Injetor Copiado!' : 'Injetor Portal Web'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 1: Sliders Configuration (Delay, Interval, TABs) */}
        <SettingsSliders
          settings={settings}
          onChange={handleUpdateSettings}
        />

        {/* Section 2: Grade Table (Full Width) */}
        <div className="w-full">
          <GradeTable
            grades={grades}
            currentIndex={-1}
            isAutomating={false}
            onAddRow={handleAddRow}
            onUpdateRow={handleUpdateRow}
            onDeleteRow={handleDeleteRow}
            onClearAll={handleClearAll}
            onLoadSample={handleLoadSample}
            onOpenPasteModal={() => setIsPasteModalOpen(true)}
          />
        </div>
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-6 text-center text-xs text-slate-500">
        <p>
          Digitador de Notas &bull; Suporte para Linux (Bash xdotool) e Windows (VBS / BAT) &bull; Teclas físicas reais
        </p>
      </footer>

      <PasteModal
        isOpen={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
        onImport={handleImportGrades}
      />

      <DesktopExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        grades={grades}
        settings={settings}
      />
    </div>
  );
}
