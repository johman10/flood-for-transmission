let draggingElement;

export default function orderable(item, handleDrop) {
  const list = item.parentNode;

  const onDragStart = (e) => {
    e.dataTransfer.setDragImage(document.createElement('div'), 0, 0);
    draggingElement = item;
    draggingElement.style = 'opacity: .6';
  };

  const onDragOver = (event) => {
    event.preventDefault();

    if (event.offsetY < 2) {
      list.insertBefore(draggingElement, item.nextSibling);
    } else {
      list.insertBefore(draggingElement, item);
    }
  };

  const onDrop = (event) => {
    event.preventDefault();
    const data = Array.from(list.childNodes).map((node) => node.id);
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
