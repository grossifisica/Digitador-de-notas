import { GradeItem, AutomationSettings } from '../types';

/**
 * Generates an executable Bash script (.sh) for Linux (Ubuntu, Linux Mint, Debian, Fedora, Arch, etc.)
 */
export function generateLinuxBashScript(grades: GradeItem[], settings: AutomationSettings): string {
  const tabCount = Math.max(1, Math.min(20, settings.tabCount));
  const gradesList = grades.map((g) => `  "${g.grade.trim().replace(/"/g, '\\"')}"`).join('\n');
  const studentsList = grades.map((g, i) => `  "${(g.student || `Aluno ${i + 1}`).replace(/"/g, '\\"')}"`).join('\n');

  return `#!/usr/bin/env bash
# ==============================================================
# DIGITADOR AUTOMÁTICO DE NOTAS - LINUX (TECLAS FÍSICAS REAIS)
# ==============================================================

set -e

DELAY_INICIAL=${settings.initialDelay}
INTERVALO=${settings.typingInterval}
QTD_TABS=${tabCount}

NOTAS=(
${gradesList}
)

ALUNOS=(
${studentsList}
)

TOTAL=\${#NOTAS[@]}

echo "=========================================================="
echo "      DIGITADOR AUTOMÁTICO DE NOTAS PARA LINUX"
echo "=========================================================="
echo "Total de linhas: $TOTAL"
echo "Delay inicial: \${DELAY_INICIAL}s | Intervalo: \${INTERVALO}s | TABs: \${QTD_TABS}x"
echo "=========================================================="

MISSING_TOOLS=()
if ! command -v xdotool &> /dev/null && ! command -v wtype &> /dev/null; then
  MISSING_TOOLS+=("xdotool")
fi

if ! command -v xclip &> /dev/null && ! command -v wl-copy &> /dev/null; then
  MISSING_TOOLS+=("xclip")
fi

if [ \${#MISSING_TOOLS[@]} -gt 0 ]; then
  echo ""
  echo "⚠️ Ferramentas necessárias não encontradas: \${MISSING_TOOLS[*]}"
  echo "Instale no Ubuntu / Linux Mint / Debian:"
  echo "   sudo apt update && sudo apt install -y xdotool xclip"
  echo ""
  exit 1
fi

echo ""
read -r -p "⌨️  Tecle ENTER para começar a digitar (ou Ctrl+C para cancelar)..."
echo ""
echo "👉 Clique no primeiro campo de notas agora!"
echo "Iniciando em \${DELAY_INICIAL} segundos..."
echo "Pressione Ctrl+C para cancelar."

for ((s=DELAY_INICIAL; s>0; s--)); do
  printf "\\rIniciando em %d segundos..." "$s"
  sleep 1
done
echo -e "\\n🚀 Digitação iniciada!"

copiar_nota() {
  local valor="$1"
  if command -v wl-copy &> /dev/null; then
    printf "%s" "$valor" | wl-copy
  elif command -v xclip &> /dev/null; then
    printf "%s" "$valor" | xclip -selection clipboard
  fi
}

apertar_ctrl_v() {
  if command -v xdotool &> /dev/null; then
    xdotool key --delay 50 ctrl+v
  elif command -v wtype &> /dev/null; then
    wtype -M ctrl -k v -m ctrl
  fi
}

apertar_tab() {
  local vezes="$1"
  for ((t=1; t<=vezes; t++)); do
    if command -v xdotool &> /dev/null; then
      xdotool key Tab
    elif command -v wtype &> /dev/null; then
      wtype -k Tab
    fi
    sleep 0.08
  done
}

for i in "\${!NOTAS[@]}"; do
  NOTA="\${NOTAS[$i]}"
  ALUNO="\${ALUNOS[$i]}"
  IDX=$((i + 1))

  if [ -z "$NOTA" ]; then
    echo "[$IDX/$TOTAL] Aluno: $ALUNO | Nota: (vazio)"
  else
    echo "[$IDX/$TOTAL] Aluno: $ALUNO | Nota: $NOTA"
    copiar_nota "$NOTA"
    sleep 0.05
    apertar_ctrl_v
  fi
  sleep "$INTERVALO"
  apertar_tab "$QTD_TABS"
done

echo ""
echo "🎉 Concluído com sucesso! Todas as $TOTAL linhas foram processadas."
printf "\\a"
`;
}

/**
 * Generates Windows VBScript (.vbs) - 2 clicks, native, zero installation!
 */
export function generateWindowsVbsScript(grades: GradeItem[], settings: AutomationSettings): string {
  const tabCount = Math.max(1, Math.min(20, settings.tabCount));
  const initialDelayMs = Math.round(settings.initialDelay * 1000);
  const intervalMs = Math.round(settings.typingInterval * 1000);

  let script = `' DIGITADOR DE NOTAS - WINDOWS
Dim WshShell, btn
Set WshShell = CreateObject("WScript.Shell")

btn = MsgBox("DIGITADOR DE NOTAS" & vbCrLf & vbCrLf & _
  "Total de linhas: ${grades.length}" & vbCrLf & _
  "Delay inicial: ${settings.initialDelay}s" & vbCrLf & _
  "Intervalo: ${settings.typingInterval}s | TABs: ${tabCount}x" & vbCrLf & vbCrLf & _
  "Tecle ENTER (ou clique em OK) para comecar a digitar e clique no primeiro campo do seu sistema em ate ${settings.initialDelay} segundos!", 65, "Digitador de Notas")

If btn = 2 Then WScript.Quit

WScript.Sleep ${initialDelayMs}

`;

  grades.forEach((item, index) => {
    const cleanGrade = item.grade.trim();
    if (cleanGrade === '') {
      script += `' [${index + 1}/${grades.length}] Nota: (vazio)\n`;
      script += `WScript.Sleep ${intervalMs}\n`;
    } else {
      script += `' [${index + 1}/${grades.length}] Nota: ${cleanGrade}\n`;
      script += `WshShell.Run "cmd.exe /c <nul set /p=""${cleanGrade}"" | clip", 0, True\n`;
      script += `WScript.Sleep 50\n`;
      script += `WshShell.SendKeys "^v"\n`;
      script += `WScript.Sleep ${intervalMs}\n`;
    }
    for (let t = 0; t < tabCount; t++) {
      script += `WshShell.SendKeys "{TAB}"\n`;
      script += `WScript.Sleep 60\n`;
    }
    script += `\n`;
  });

  script += `MsgBox "Sucesso! Todas as ${grades.length} linhas foram processadas no teclado!", 64, "Concluido"\n`;
  return script;
}

/**
 * Generates Windows Batch Script (.bat)
 */
export function generateWindowsBatchScript(grades: GradeItem[], settings: AutomationSettings): string {
  const tabCount = Math.max(1, Math.min(20, settings.tabCount));
  const notesList = grades.map((g) => `"${g.grade.trim().replace(/"/g, '`"')}"`).join(', ');

  return `@echo off
chcp 65001 >nul
title Digitador Automatico de Notas
color 0B
echo ========================================================
echo DIGITADOR DE NOTAS - WINDOWS
echo Total de linhas: ${grades.length}
echo Delay Inicial: ${settings.initialDelay}s | Intervalo: ${settings.typingInterval}s | TABs: ${tabCount}x
echo ========================================================
set /p "_confirm=Tecle ENTER para comecar a digitar..."
echo Clique no primeiro campo de notas agora!

powershell -NoProfile -ExecutionPolicy Bypass -Command "& { Add-Type -AssemblyName System.Windows.Forms; Write-Host 'Iniciando em ${settings.initialDelay}s...' -ForegroundColor Yellow; Start-Sleep -Seconds ${settings.initialDelay}; $notas = @(${notesList}); foreach ($nota in $notas) { if (-not [string]::IsNullOrEmpty($nota)) { [System.Windows.Forms.Clipboard]::SetText($nota); [System.Windows.Forms.SendKeys]::SendWait('^v'); } Start-Sleep -Milliseconds ${Math.round(settings.typingInterval * 1000)}; for ($t = 0; $t -lt ${tabCount}; $t++) { [System.Windows.Forms.SendKeys]::SendWait('{TAB}'); Start-Sleep -Milliseconds 60; } } Write-Host 'Concluido!' -ForegroundColor Green; }"
pause >nul
`;
}

/**
 * Generates Python script using pyautogui
 */
export function generatePythonScript(grades: GradeItem[], settings: AutomationSettings): string {
  const tabCount = Math.max(1, Math.min(20, settings.tabCount));
  const gradesArrayStr = JSON.stringify(grades.map((g) => g.grade.trim()), null, 2);

  return `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script Python de Digitação Física (Linux / Windows / macOS)
Requisitos: pip install pyautogui pyperclip
"""
import time
import pyautogui
import pyperclip

DELAY_INICIAL = ${settings.initialDelay}
INTERVALO_DIGITACAO = ${settings.typingInterval}
QUANTIDADE_TABS = ${tabCount}
NOTAS = ${gradesArrayStr}

def main():
    print("=" * 60)
    print("DIGITADOR FÍSICO DE TECLAS (CONTROL+V E TAB)")
    print(f"Total de linhas: {len(NOTAS)}")
    print("Pressione Ctrl+C para cancelar.")
    print("=" * 60)
    
    input("⌨️  Tecle ENTER para começar a digitar...")
    print(f"👉 Clique no primeiro campo agora! Iniciando em {DELAY_INICIAL}s...")
    time.sleep(DELAY_INICIAL)
    
    for idx, nota in enumerate(NOTAS, start=1):
        if nota == "":
            print(f"[{idx}/{len(NOTAS)}] Nota: (vazio)")
        else:
            print(f"[{idx}/{len(NOTAS)}] Apertando CONTROL+V: {nota}")
            pyperclip.copy(nota)
            pyautogui.hotkey('ctrl', 'v')
        time.sleep(INTERVALO_DIGITACAO)
        
        for _ in range(QUANTIDADE_TABS):
            pyautogui.press('tab')
            time.sleep(0.06)
            
    print("Concluído com sucesso!")

if __name__ == "__main__":
    main()
`;
}

/**
 * Generates an in-browser Bookmarklet snippet
 */
export function generateBookmarkletCode(grades: GradeItem[], settings: AutomationSettings): string {
  const tabCount = Math.max(1, Math.min(20, settings.tabCount));
  const gradesJson = JSON.stringify(grades.map((g) => g.grade.trim()));

  return `javascript:(function(){
  const notas = ${gradesJson};
  const delayInicial = ${settings.initialDelay} * 1000;
  const intervalo = ${settings.typingInterval} * 1000;
  const tabCount = ${tabCount};
  
  if (!notas.length) { alert('Nenhuma linha para processar!'); return; }
  
  const box = document.createElement('div');
  box.style.position = 'fixed';
  box.style.top = '15px';
  box.style.right = '15px';
  box.style.background = '#0f172a';
  box.style.color = '#38bdf8';
  box.style.padding = '14px 20px';
  box.style.borderRadius = '12px';
  box.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
  box.style.zIndex = '999999';
  box.style.fontFamily = 'sans-serif';
  box.style.fontSize = '14px';
  box.style.fontWeight = 'bold';
  box.innerHTML = 'Digitador pronto (' + notas.length + ' linhas). Tecle ENTER para começar!';
  document.body.appendChild(box);
  
  function onEnterStart(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      window.removeEventListener('keydown', onEnterStart, true);
      box.innerHTML = 'Clique na primeira célula agora! Iniciando em ' + (delayInicial / 1000) + 's...';
      setTimeout(() => {
        let idx = 0;
        function typeNext() {
          if (idx >= notas.length) {
            box.innerHTML = 'Concluído! ' + notas.length + ' linhas processadas com sucesso.';
            box.style.color = '#4ade80';
            setTimeout(() => box.remove(), 4000);
            return;
          }
          
          const el = document.activeElement;
          const nota = notas[idx];
          box.innerHTML = '[' + (idx + 1) + '/' + notas.length + '] ' + (nota === '' ? 'Nota vazia' : 'Digitando nota: ' + nota);
          
          if (el && ('value' in el)) {
            el.value = nota;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }
          
          setTimeout(() => {
            for (let t = 0; t < tabCount; t++) {
              const focusables = Array.from(document.querySelectorAll('input:not([disabled]):not([type="hidden"]), select, textarea'));
              const curIdx = focusables.indexOf(document.activeElement);
              if (curIdx >= 0 && focusables[curIdx + 1]) {
                focusables[curIdx + 1].focus();
                if (focusables[curIdx + 1].select) focusables[curIdx + 1].select();
              }
            }
            idx++;
            setTimeout(typeNext, 200);
          }, intervalo);
        }
        typeNext();
      }, delayInicial);
    }
  }
  window.addEventListener('keydown', onEnterStart, true);
})();`;
}

export function downloadFile(content: string, filename: string, type: string = 'text/plain;charset=utf-8'): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
