import React from 'react';
import { Clock, Timer, CornerDownRight, Sliders } from 'lucide-react';
import { AutomationSettings } from '../types';

interface SettingsSlidersProps {
  settings: AutomationSettings;
  onChange: (updated: Partial<AutomationSettings>) => void;
  disabled?: boolean;
}

export const SettingsSliders: React.FC<SettingsSlidersProps> = ({
  settings,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-semibold text-white">Configurações de Temporização e Teclas</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Slider 1: Delay Inicial */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="initial-delay-slider" className="text-sm font-medium text-slate-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Delay Inicial</span>
              </label>
              <span className="font-mono text-sm font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                {settings.initialDelay}s
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Tempo para você clicar no campo inicial do sistema antes da digitação começar.
            </p>
          </div>
          <div>
            <input
              id="initial-delay-slider"
              type="range"
              min="1"
              max="30"
              step="1"
              disabled={disabled}
              value={settings.initialDelay}
              onChange={(e) => onChange({ initialDelay: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
              <span>1s</span>
              <span className="text-amber-500/80 font-semibold">Padrão: 3s</span>
              <span>30s</span>
            </div>
          </div>
        </div>

        {/* Slider 2: Intervalo entre Digitações */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="typing-interval-slider" className="text-sm font-medium text-slate-200 flex items-center gap-2">
                <Timer className="w-4 h-4 text-indigo-400" />
                <span>Tempo entre Digitações</span>
              </label>
              <span className="font-mono text-sm font-bold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded border border-indigo-400/20">
                {Number(settings.typingInterval).toFixed(1)}s
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Pausa após cada colagem de nota para o sistema escolar processar a resposta.
            </p>
          </div>
          <div>
            <input
              id="typing-interval-slider"
              type="range"
              min="0.2"
              max="3"
              step="0.2"
              disabled={disabled}
              value={settings.typingInterval}
              onChange={(e) => onChange({ typingInterval: parseFloat(Number(e.target.value).toFixed(1)) })}
              className="w-full accent-indigo-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
              <span>0.2s</span>
              <span className="text-indigo-400/80 font-semibold">Padrão: 2.0s</span>
              <span>3.0s</span>
            </div>
          </div>
        </div>

        {/* Slider 3: Pressionamentos da tecla TAB */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="tab-count-slider" className="text-sm font-medium text-slate-200 flex items-center gap-2">
                <CornerDownRight className="w-4 h-4 text-emerald-400" />
                <span>Saltos de Tecla TAB</span>
              </label>
              <span className="font-mono text-sm font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                {settings.tabCount}x {settings.tabCount === 1 ? 'TAB' : 'TABs'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Quantidade de vezes que a tecla TAB é pressionada para avançar para a próxima célula.
            </p>
          </div>
          <div>
            <input
              id="tab-count-slider"
              type="range"
              min="1"
              max="20"
              step="1"
              disabled={disabled}
              value={settings.tabCount}
              onChange={(e) => onChange({ tabCount: Number(e.target.value) })}
              className="w-full accent-emerald-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
              <span className="text-emerald-400/80 font-semibold">1 (Padrão)</span>
              <span>10</span>
              <span>20 (Máx)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Sequence Guide */}
      <div className="mt-4 pt-3 border-t border-slate-800/70 flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <span className="font-medium text-slate-300">Ciclo de Execução:</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
            1. Aguardar {settings.initialDelay}s
          </span>
          <span className="text-slate-600">➔</span>
          <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20 font-mono">
            2. Ctrl+C (Nota)
          </span>
          <span className="text-slate-600">➔</span>
          <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
            3. Ctrl+V (Colar)
          </span>
          <span className="text-slate-600">➔</span>
          <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
            4. Esperar {Number(settings.typingInterval).toFixed(1)}s
          </span>
          <span className="text-slate-600">➔</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
            5. Pressionar TAB {settings.tabCount}x
          </span>
          <span className="text-slate-600">➔</span>
          <span className="text-slate-400 italic">Repetir para a próxima linha</span>
        </div>
      </div>
    </div>
  );
};
