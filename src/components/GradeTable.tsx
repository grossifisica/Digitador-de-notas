import React, { useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  ClipboardPaste, 
  Sparkles, 
  HelpCircle,
  FileSpreadsheet,
  Eye,
  Keyboard
} from 'lucide-react';
import { GradeItem } from '../types';

interface GradeTableProps {
  grades: GradeItem[];
  currentIndex?: number;
  isAutomating?: boolean;
  onAddRow: () => void;
  onUpdateRow: (id: string, field: 'student' | 'grade', value: string) => void;
  onDeleteRow: (id: string) => void;
  onClearAll: () => void;
  onLoadSample: () => void;
  onOpenPasteModal: () => void;
}

export const GradeTable: React.FC<GradeTableProps> = ({
  grades,
  onAddRow,
  onUpdateRow,
  onDeleteRow,
  onClearAll,
  onLoadSample,
  onOpenPasteModal,
}) => {
  const activeRowRef = useRef<HTMLTableRowElement | null>(null);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
      {/* Table Action Toolbar */}
      <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/40">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-semibold text-white">Tabela de Notas</h2>
          <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700 font-mono">
            {grades.length} {grades.length === 1 ? 'aluno' : 'alunos'}
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            type="button"
            onClick={onAddRow}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Linha</span>
          </button>

          <button
            type="button"
            onClick={onOpenPasteModal}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-all"
            title="Copie do Excel/Sheets (com ou sem nomes) e cole tudo de uma vez"
          >
            <ClipboardPaste className="w-3.5 h-3.5 text-indigo-400" />
            <span>Colar do Excel / Sheets</span>
          </button>

          {grades.length === 0 && (
            <button
              type="button"
              onClick={onLoadSample}
              className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Carregar Exemplo</span>
            </button>
          )}

          {grades.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-300 border border-slate-800 hover:border-red-500/30 text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Table Content */}
      <div className="overflow-x-auto max-h-[520px] relative">
        {grades.length === 0 ? (
          <div className="py-16 px-4 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 shadow-inner">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
              A tabela de notas está vazia
            </h3>
            <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
              Adicione linhas manualmente ou cole uma lista com nomes e notas diretamente da sua planilha do Excel ou Google Planilhas.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={onAddRow}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Adicionar Primeira Linha</span>
              </button>
              <button
                type="button"
                onClick={onOpenPasteModal}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <ClipboardPaste className="w-4 h-4 text-indigo-400" />
                <span>Colar em Bloco do Excel</span>
              </button>
              <button
                type="button"
                onClick={onLoadSample}
                className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Carregar Exemplo</span>
              </button>
            </div>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-950/90 sticky top-0 z-10 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 w-16 text-center text-slate-500">#</th>
                
                {/* COLUNA 1: NOME (SIMPLES CONFERÊNCIA) */}
                <th className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">Nome do Aluno</span>
                    <span className="inline-flex items-center gap-1 text-[10px] lowercase first-letter:uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700 font-normal">
                      <Eye className="w-3 h-3 text-slate-400" />
                      Simples conferência (não será digitado)
                    </span>
                  </div>
                </th>

                {/* COLUNA 2: NOTA (SERÁ DIGITADA) */}
                <th className="py-3 px-4 w-64">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">Nota</span>
                    <span className="inline-flex items-center gap-1 text-[10px] lowercase first-letter:uppercase bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-normal">
                      <Keyboard className="w-3 h-3 text-emerald-400" />
                      Será digitada
                    </span>
                  </div>
                </th>

                <th className="py-3 px-4 w-14 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {grades.map((item, index) => {
                const hasGrade = item.grade.trim() !== '';

                return (
                  <tr
                    key={item.id}
                    ref={activeRowRef}
                    className="hover:bg-slate-800/40 transition-colors duration-150"
                  >
                    {/* Index Number */}
                    <td className="py-3 px-4 text-center font-mono text-slate-500 font-semibold">
                      {index + 1}
                    </td>

                    {/* COLUNA 1: NOME DO ALUNO (APENAS CONFERÊNCIA) */}
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={item.student}
                        onChange={(e) => onUpdateRow(item.id, 'student', e.target.value)}
                        placeholder={`Aluno ${index + 1}`}
                        className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-700 focus:border-indigo-500 focus:bg-slate-950/40 px-2.5 py-1.5 rounded text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none transition-colors"
                      />
                    </td>

                    {/* COLUNA 2: NOTA (SERÁ DIGITADA) */}
                    <td className="py-3 px-4">
                      <div className="relative flex items-center">
                        <input
                          id={`source-grade-input-${index}`}
                          type="text"
                          value={item.grade}
                          onChange={(e) => onUpdateRow(item.id, 'grade', e.target.value)}
                          placeholder="Ex: 8.5"
                          className={`w-full font-mono font-bold text-sm px-3.5 py-2 rounded-lg border focus:outline-none transition-all ${
                            !hasGrade
                              ? 'bg-slate-950/60 border-amber-500/40 text-amber-200 placeholder:text-slate-600'
                              : 'bg-slate-950/80 border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white'
                          }`}
                        />
                      </div>
                    </td>

                    {/* Delete action */}
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onDeleteRow(item.id)}
                        className="p-1.5 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Remover linha"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Table Footer with Summary */}
      {grades.length > 0 && (
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span>
              Total de alunos: <strong className="text-white">{grades.length}</strong>
            </span>
            <span>
              Notas a digitar:{' '}
              <strong className="text-emerald-400">
                {grades.filter((g) => g.grade.trim() !== '').length}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span>O script digitará <strong>exclusivamente os valores da coluna de Notas</strong>. Os nomes ficam visíveis para sua conferência.</span>
          </div>
        </div>
      )}
    </div>
  );
};
