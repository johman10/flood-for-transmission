<script>
  let hovering = false;

  const isFile = (event) => {
    var dt = event.dataTransfer;
    return dt.types.some((type) => type === 'Files');
  };

  const handleDragEnter = (event) => {
    if (!isFile(event)) return;
    hovering = true;
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragLeave = (event) => {
    event.stopPropagation();
    event.preventDefault();

    hovering = false;
  };

  const handleFiles = (newFiles) => {
    const fileList = Array.from(newFiles);
    if (acceptList) {
      const allFilesValid = fileList.every((file) => {
        const splitName = file.name.split('.');
        const extension = `.${splitName[splitName.length - 1]}`;
        return acceptList.some(
          (type) => type === file.type || type === extension
        );
      });

      if (!allFilesValid) {
        invalid = true;
        return;
      }
    }

    invalid = false;
    if (multiple) {
      files = files ? [...files, ...fileList] : fileList;
    } else {
      files = [fileList[0]];
    }
    return files;
  };

  const handleDrop = (event) => {
    event.preventDefault();
    hovering = false;

    const { dataTransfer } = event;
    handleFiles(dataTransfer.files);
    event.target.value = '';
  };

  const handleChange = (event) => {
    event.preventDefault();
    handleFiles(event.target.files);
    event.target.value = '';
  };

  const removeFile = (removeFile) => {
    files = files.filter((file) => removeFile !== file);
  };
</script>

<svelte:window
  on:dragenter="{handleDragEnter}"
  on:dragover="{handleDragOver}"
  on:dragleave="{handleDragLeave}"
/>

<label class="dropzone" class:hovering>Drop here</label>

<style>
  .dropzone {
    position: absolute;
    width: 100vw;
    height: 100vh;
    inset: 0;
    opacity: 0;
    background-color: black;
    pointer-events: none;
  }

  .dropzone.hovering {
    opacity: 1;
    pointer-events: all;
  }
</style>
