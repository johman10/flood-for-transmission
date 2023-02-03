import { alerts } from '~helpers/stores';

const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

export const getFileAddBody = (files, start, destination) => {
  const promises = files.map((file) => toBase64(file));
  return Promise.all(promises).then((base64Files) =>
    base64Files.map((base64File) => ({
      'metainfo': base64File,
      'paused': !start,
      'download-dir': destination,
    }))
  );
};

export const handleTorrentAddResponses = (responses) => {
  const duplicateResponses = responses
    .map((response) => response.arguments['torrent-duplicate'])
    .filter(Boolean);
  const pluralize = responses.length > 1 ? 'torrents' : 'torrent';

  if (!duplicateResponses.length) {
    alerts.add(`Succesfully added ${responses.length} ${pluralize}`);
  } else if (duplicateResponses.length === responses.length) {
    alerts.add(`All the uploaded ${pluralize} already exist`, 'negative');
  } else {
    const pluralizeDuplicates =
      duplicateResponses.length > 1 ? 'torrents' : 'torrent';
    const successCount = responses.length - duplicateResponses.length;
    alerts.add(
      `Succesfully added ${successCount} ${pluralize}, the other ${duplicateResponses.length} ${pluralizeDuplicates} already exist`,
      'negative'
    );
  }
};

export const areAllFilesValid = (files, acceptList) => {
  return files.every((file) => {
    const splitName = file.name.split('.');
    const extension = `.${splitName[splitName.length - 1]}`;
    return acceptList.some((type) => type === file.type || type === extension);
  });
};
