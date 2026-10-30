import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  Terminal, 
  Info, 
  ShieldCheck, 
  Cpu
} from 'lucide-react';
import { GradeItem, AutomationSettings } from '../types';
import { 
  generateLinuxBashScript,
  generatePythonScript, 
  generateWindowsBatchScript,
  downloadFile 
} from '../utils/scriptGenerators';

interface DesktopExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  grades: GradeItem[];
  settings: AutomationSettings;
}

export const DesktopExportModal: React.FC<DesktopExportModalProps> = ({
  isOpen,
  onClose,
  grades,
  settings,
}) => {
  const [activeTab, setActiveTab] = useState<'linux' | 'python' | 'windows' | 'guide'>('linux');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const linuxCode = generateLinuxBashScript(grades, settings);
  const pythonCode = generatePythonScript(grades, settings);
  const windowsCode = generateWindowsBatchScript(grades, settings);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownloadLinux = () => {
    downloadFile(linuxCode, `digitar_notas_linux.sh`, 'application/x-sh;charset=utf-8');
  };

  const handleDownloadPython = () => {
    downloadFile(pythonCode, `digitar_notas_linux.py`, 'text/x-python;charset=utf-8');
  };

  const handleDownloadWindows = () => {
    downloadFile(windowsCode, `digitar_notas_windows.bat`, 'text/plain;charset=utf-8');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Scripts Nativos para Linux (Teclas Físicas)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Ubuntu &bull; Debian &bull; Mint &bull; Fedora &bull; Arch
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Aperta fisicamente CONTROL + C, CONTROL + V e TAB fora da aba do navegador no seu Linux
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-5 pt-3 border-b border-slate-800 bg-slate-950/40 flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('linux')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'linux'
                ? 'text-emerald-400 border-emerald-500 bg-slate-900/60'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Bash Script (.sh) &bull; Recomendado p/ Linux</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('python')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'python'
                ? 'text-indigo-400 border-indigo-500 bg-slate-900/60'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4 text-sky-400" />
            <span>Python (.py)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'guide'
                ? 'text-indigo-400 border-indigo-500 bg-slate-900/60'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Info className="w-4 h-4 text-amber-400" />
            <span>Instalação xdotool</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('windows')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'windows'
                ? 'text-slate-300 border-slate-500 bg-slate-900/60'
                : 'text-slate-500 border-transparent hover:text-slate-400'
            }`}
          >
            <span>Windows (.bat)</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'linux' && (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-200 space-y-1">
                  <p className="font-semibold text-white">
                    Script Bash Nativo para Linux com xdotool / xclip / wl-copy
                  </p>
                  <p className="text-emerald-300/90 leading-relaxed">
                    Usa o subsistema de teclado do Linux para apertar fisicamente <strong>CONTROL + V</strong> e a tecla <strong>TAB</strong> na janela ativa do seu sistema escolar, LibreOffice Calc ou navegador, mesmo com a aba minimizada ou em segundo plano!
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-slate-300">
                  Script pronto com suas <strong>{grades.filter(g => g.grade.trim() !== '').length} notas</strong>, delay de {settings.initialDelay}s e {settings.tabCount}x TAB.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(linuxCode, 'linux')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 border border-slate-700"
                  >
                    {copiedType === 'linux' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'linux' ? 'Copiado!' : 'Copiar Código'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadLinux}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
                  >
                    <Download className="w-4 h-4" />
                    <span>Baixar Script Linux (.sh)</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto max-h-56 leading-relaxed">
                <pre>{linuxCode}</pre>
              </div>

              <div className="text-xs text-slate-300 space-y-2 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  Como rodar no Terminal Linux:
                </p>
                <div className="space-y-1 font-mono text-xs text-emerald-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <p>chmod +x digitar_notas_linux.sh</p>
                  <p>./digitar_notas_linux.sh</p>
                </div>
                <p className="text-slate-400 text-[11px]">
                  O script fará a contagem regressiva de {settings.initialDelay}s. Basta clicar na primeira célula de notas da sua escola!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'python' && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-slate-300">
                  Script Python para Linux usando <code>pyautogui</code> e <code>pyperclip</code>.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(pythonCode, 'py')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 border border-slate-700"
                  >
                    {copiedType === 'py' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'py' ? 'Copiado!' : 'Copiar Código'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadPython}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar Arquivo .py</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-sky-300 overflow-x-auto max-h-56 leading-relaxed">
                <pre>{pythonCode}</pre>
              </div>

              <div className="text-xs text-slate-400 space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <p className="font-semibold text-slate-200">Como executar no Linux:</p>
                <p className="font-mono text-slate-300 bg-slate-900 px-2 py-1 rounded inline-block">
                  python3 digitar_notas_linux.py
                </p>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-3 text-xs text-slate-300">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  Instalação das dependências no Linux
                </h4>
                <p className="text-slate-400">
                  O script <code>.sh</code> utiliza o <code>xdotool</code> para pressionar as teclas e <code>xclip</code> (ou <code>wl-copy</code> se estiver no Wayland) para a área de transferência.
                </p>
                <div className="space-y-2 font-mono text-xs mt-2">
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-500"># Ubuntu, Linux Mint, Debian, Pop!_OS:</span><br />
                    <span className="text-emerald-400">sudo apt update && sudo apt install -y xdotool xclip</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-500"># Fedora:</span><br />
                    <span className="text-emerald-400">sudo dnf install -y xdotool xclip</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-500"># Arch Linux / Manjaro:</span><br />
                    <span className="text-emerald-400">sudo pacman -S xdotool xclip</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'windows' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-slate-300">
                  Arquivo Batch para Windows caso precise executar em uma máquina Windows.
                </p>
                <button
                  type="button"
                  onClick={handleDownloadWindows}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar .BAT (Windows)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
