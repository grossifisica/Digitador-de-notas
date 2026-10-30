import React, { useState } from 'react';
import { X, ClipboardPaste, AlertCircle, Check } from 'lucide-react';
import { GradeItem } from '../types';

interface PasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newItems: GradeItem[], replace: boolean) => void;
}

export const PasteModal: React.FC<PasteModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [rawText, setRawText] = useState('');
  const [replaceExisting, setReplaceExisting] = useState(true);

  if (!isOpen) return null;

  const handleProcess = () => {
    if (!rawText.trim()) return;

    const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
    const parsedItems: GradeItem[] = [];

    lines.forEach((line, index) => {
      // Check if line contains tabs or semicolons or commas separating Name and Grade
      const parts = line.split(/[\t;]/).map((p) => p.trim());

      let student = `Aluno ${index + 1}`;
      let grade = '';

      if (parts.length >= 2) {
        // e.g. "João Silva \t 8.5"
        // Check which part looks more like a number
        const isPart0Number = /^[\d.,]+$/.test(parts[0]);
        const isPart1Number = /^[\d.,]+$/.test(parts[1]);

        if (isPart1Number && !isPart0Number) {
          student = parts[0];
          grade = parts[1];
        } else if (isPart0Number && !isPart1Number) {
          grade = parts[0];
          student = parts[1];
        } else {
          student = parts[0];
          grade = parts[1];
        }
      } else {
        // Single column of numbers or general text
        grade = line;
      }

      parsedItems.push({
        id: `grade-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
        student,
        grade,
        status: 'pending',
      });
    });

    onImport(parsedItems, replaceExisting);
    setRawText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <ClipboardPaste className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">
              Colar Bloco de Notas (Excel / Sheets)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Copie uma coluna de notas (ou duas colunas com <em>Nome do Aluno</em> e <em>Nota</em>) da sua planilha Excel, Google Sheets ou arquivo de texto e cole no campo abaixo:
          </p>

          <textarea
            rows={8}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={"Exemplo 1 (apenas notas):\n8.5\n9.0\n6.8\n10.0\n\nExemplo 2 (nome e nota separados por tab):\nAna Silva\t9.5\nBruno Souza\t7.0"}
            className="w-full font-mono text-xs bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />

          <div className="flex items-center justify-between text-xs text-slate-400">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={replaceExisting}
                onChange={(e) => setReplaceExisting(e.target.checked)}
                className="rounded accent-indigo-500"
              />
              <span>Substituir notas atuais (se desmarcado, adicionará ao final)</span>
            </label>
            <span className="text-slate-500 font-mono">
              {rawText.split(/\r?\n/).filter((l) => l.trim().length > 0).length} linhas detectadas
            </span>
          </div>

          <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-xl flex items-start gap-2.5 text-xs text-indigo-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-indigo-400" />
            <span>
              Aceita vírgula ou ponto (ex: 8,5 ou 8.5). Cada linha se transformará em um registro na tabela.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!rawText.trim()}
            onClick={handleProcess}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4" />
            <span>Processar e Inserir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
