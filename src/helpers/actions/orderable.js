let draggingElement;

export default function resizeableTable(item, handleDrop) {
  const list = item.parentNode;

  const onDrag = () => {
    draggingElement = item;
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
  };

  item.addEventListener('drag', onDrag);
  item.addEventListener('dragover', onDragOver);
  item.addEventListener('drop', onDrop);

  return {
    destroy() {
      item.removeEventListener('drag', onDrag);
      item.removeEventListener('dragover', onDragOver);
      item.removeEventListener('drop', onDrop);
    },
  };
}
