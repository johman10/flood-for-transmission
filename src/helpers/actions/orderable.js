let draggingElement;

const emptyImage = document.createElement('img');
emptyImage.src =
  'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

export default function orderable(item, handleDrop) {
  const list = item.parentNode;

  const onDragStart = (e) => {
    e.dataTransfer.setDragImage(emptyImage, 0, 0);
    draggingElement = item;
    draggingElement.style = 'opacity: .6';
  };

  const onDragOver = (event) => {
    event.preventDefault();

    if (draggingElement.id === item.id) return;

    if (event.offsetY < 2) {
      list.insertBefore(draggingElement, item.nextSibling);
    } else {
      list.insertBefore(draggingElement, item);
    }
  };

  const onDrop = (event) => {
    event.preventDefault();
    const data = Array.from(list.childNodes).map((node) => {
      if (isNaN(node.id)) {
        return node.id;
      }

      return parseInt(node.id, 10);
    });
    handleDrop(data);
    draggingElement.style = 'opacity: 1';
  };

  item.addEventListener('dragstart', onDragStart);
  item.addEventListener('dragover', onDragOver);
  item.addEventListener('drop', onDrop);

  return {
    destroy() {
      item.removeEventListener('dragstart', onDragStart);
      item.removeEventListener('dragover', onDragOver);
      item.removeEventListener('drop', onDrop);
    },
  };
}
