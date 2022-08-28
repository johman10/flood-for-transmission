export default function clickOutside(node, focusReady = 1) {
  // add all the elements inside modal which you want to make focusable
  const focusableElements =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  let firstFocusableElement = node.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
  let focusableContent = node.querySelectorAll(focusableElements);
  let lastFocusableElement = focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal

  function onKeyDown(event) {
    let isTabPressed = event.key === 'Tab';

    if (!isTabPressed) {
      return;
    }

    if (event.shiftKey) {
      // if shift key pressed for shift + tab combination
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus(); // add focus for the last focusable element
        event.preventDefault();
      }
    } else {
      // if tab key is pressed
      if (document.activeElement === lastFocusableElement) {
        // if focused has reached to last focusable element then focus first focusable element after pressing tab
        firstFocusableElement.focus(); // add focus for the first focusable element
        event.preventDefault();
      }
    }
  }

  function initialFocus(focusReady) {
    console.log('initialFocus', firstFocusableElement, focusReady);
    if (!firstFocusableElement || !focusReady) return;

    firstFocusableElement.focus();
  }

  function run(focusReady) {
    firstFocusableElement = node.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
    focusableContent = node.querySelectorAll(focusableElements);
    lastFocusableElement = focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal

    initialFocus(focusReady);
  }

  document.addEventListener('keydown', onKeyDown);
  run(focusReady);

  return {
    update: run,
    destroy: () => {
      document.removeEventListener('keydown', onKeyDown);
    },
  };
}
