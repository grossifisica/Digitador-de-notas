/**
 * Human-like keyboard robot that emits actual keyboard events and manages focus.
 */

export async function humanPressCtrlC(text: string, element?: HTMLElement | null): Promise<void> {
  if (element && 'focus' in element) {
    element.focus();
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      element.select();
    }
  }

  // Keydown Control
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Control',
      code: 'ControlLeft',
      keyCode: 17,
      which: 17,
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    })
  );

  // Keydown C
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'c',
      code: 'KeyC',
      keyCode: 67,
      which: 67,
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    })
  );

  // Real clipboard write
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    }
  } catch {
    try {
      const tempTextArea = document.createElement('textarea');
      tempTextArea.value = text;
      tempTextArea.style.position = 'fixed';
      tempTextArea.style.opacity = '0';
      document.body.appendChild(tempTextArea);
      tempTextArea.select();
      document.execCommand('copy');
      document.body.removeChild(tempTextArea);
    } catch {
      // Ignored
    }
  }

  window.dispatchEvent(new Event('copy', { bubbles: true, cancelable: true }));

  // Keyup C
  window.dispatchEvent(
    new KeyboardEvent('keyup', {
      key: 'c',
      code: 'KeyC',
      keyCode: 67,
      which: 67,
      ctrlKey: true,
      bubbles: true,
    })
  );

  // Keyup Control
  window.dispatchEvent(
    new KeyboardEvent('keyup', {
      key: 'Control',
      code: 'ControlLeft',
      keyCode: 17,
      which: 17,
      ctrlKey: false,
      bubbles: true,
    })
  );
}

export async function humanPressCtrlV(
  text: string,
  targetElement?: HTMLInputElement | HTMLTextAreaElement | null
): Promise<void> {
  if (targetElement) {
    targetElement.focus();
    targetElement.select();
  }

  // Keydown Control
  (targetElement || window).dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Control',
      code: 'ControlLeft',
      keyCode: 17,
      which: 17,
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    })
  );

  // Keydown V
  (targetElement || window).dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'v',
      code: 'KeyV',
      keyCode: 86,
      which: 86,
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    })
  );

  try {
    (targetElement || window).dispatchEvent(new Event('paste', { bubbles: true, cancelable: true }));
  } catch {
    // Continue
  }

  if (targetElement) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    )?.set;

    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(targetElement, text);
    } else {
      targetElement.value = text;
    }

    try {
      targetElement.dispatchEvent(
        new InputEvent('beforeinput', { inputType: 'insertFromPaste', data: text, bubbles: true })
      );
      targetElement.dispatchEvent(new Event('input', { bubbles: true }));
      targetElement.dispatchEvent(new Event('change', { bubbles: true }));
    } catch {
      targetElement.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  // Keyup V
  (targetElement || window).dispatchEvent(
    new KeyboardEvent('keyup', {
      key: 'v',
      code: 'KeyV',
      keyCode: 86,
      which: 86,
      ctrlKey: true,
      bubbles: true,
    })
  );

  // Keyup Control
  (targetElement || window).dispatchEvent(
    new KeyboardEvent('keyup', {
      key: 'Control',
      code: 'ControlLeft',
      keyCode: 17,
      which: 17,
      ctrlKey: false,
      bubbles: true,
    })
  );
}

export function humanPressTab(
  currentElement: HTMLElement | null,
  container?: HTMLElement | null
): HTMLElement | null {
  const activeEl = currentElement || document.activeElement;

  (activeEl || window).dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Tab',
      code: 'Tab',
      keyCode: 9,
      which: 9,
      bubbles: true,
      cancelable: true,
    })
  );

  const scope = container || document;
  const focusables = Array.from(
    scope.querySelectorAll<HTMLElement>(
      'input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );

  let nextEl: HTMLElement | null = null;

  if (focusables.length > 0) {
    const currentIndex = activeEl instanceof HTMLElement ? focusables.indexOf(activeEl) : -1;
    const nextIndex = (currentIndex + 1) % focusables.length;
    nextEl = focusables[nextIndex];
    if (nextEl) {
      nextEl.focus();
      if (nextEl instanceof HTMLInputElement || nextEl instanceof HTMLTextAreaElement) {
        nextEl.select();
      }
    }
  }

  (nextEl || activeEl || window).dispatchEvent(
    new KeyboardEvent('keyup', {
      key: 'Tab',
      code: 'Tab',
      keyCode: 9,
      which: 9,
      bubbles: true,
    })
  );

  return nextEl;
}
