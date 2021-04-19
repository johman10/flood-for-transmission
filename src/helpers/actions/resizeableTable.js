export default function resizeableTable(handle, onChange) {
  const column = handle.parentElement;
  const table = handle.closest('table');
  let dragging = false;
  let handleStartX = handle.pageX;
  let columnStartWidth = column.getBoundingClientRect().width;
  let tableStartWidth = table.getBoundingClientRect().width;

  const handleMousedown = (e) => {
    dragging = true;
    handleStartX = e.pageX ?? e.touches[0].pageX;
    columnStartWidth = column.getBoundingClientRect().width;
    tableStartWidth = table.getBoundingClientRect().width;
  };

  const handleMouseup = () => {
    if (!dragging) return;

    const columnWidth = column.getBoundingClientRect().width;
    onChange(columnWidth);

    dragging = false;
  };

  const handleMousemove = (e) => {
    if (!dragging) return;

    const currentX = e.pageX ?? e.touches[0].pageX;
    const diffX = currentX - handleStartX;
    column.style.width = `${columnStartWidth + diffX}px`;
    table.style.width = `${tableStartWidth + diffX}px`;
  };

  handle.addEventListener('mousedown', handleMousedown);
  document.addEventListener('mouseup', handleMouseup);
  document.addEventListener('mousemove', handleMousemove);
  
  handle.addEventListener('touchstart', handleMousedown);
  document.addEventListener('touchend', handleMouseup);
  document.addEventListener('touchmove', handleMousemove);

  return {
    destroy() {
      handle.removeEventListener('mousedown', handleMousedown);
      document.removeEventListener('mouseup', handleMouseup);
      document.removeEventListener('mousemove', handleMousemove);

      handle.removeEventListener('touchstart', handleMousedown);
      document.removeEventListener('touchend', handleMouseup);
      document.removeEventListener('touchmove', handleMousemove);
    },
  };
}
