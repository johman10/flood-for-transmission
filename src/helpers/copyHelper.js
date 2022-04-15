export function copyToClipboard(textToCopy) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(textToCopy);
  }

  return new Promise((resolve, reject) => {
    let textArea = document.createElement('textarea');
    textArea.value = textToCopy;

    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy') ? resolve() : reject();
    textArea.remove();
  });
}
