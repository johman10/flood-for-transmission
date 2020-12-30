import { writable, derived } from 'svelte/store';
import {
  DEFAULT_COLUMNS,
  TRANSMISSION_BASE_COLUMNS,
  COLUMN_MAP,
} from '~helpers/constants/columns';

const UI_COLUMNS_STORAGE_KEY = 'ui-columns';
const UI_COLUMN_NAMES = Object.keys(COLUMN_MAP);

function migrateStoredColumns(storedColumns) {
  let storedColumnsClone = JSON.parse(JSON.stringify(storedColumns));
  const storedColumnNames = storedColumns.map((column) => column.name);

  storedColumnsClone = storedColumnsClone.filter(
    ({ name }) => UI_COLUMN_NAMES.includes(name)
  );

  const missingColumnNamesInStorage = UI_COLUMN_NAMES.filter(
    (column) => !storedColumnNames.includes(column)
  );
  const missingColumns = missingColumnNamesInStorage.map(
    (missingColumnName) => ({
      name: missingColumnName,
      enabled: false,
      width: 100,
    })
  );
  storedColumnsClone = [...storedColumnsClone, ...missingColumns];

  return storedColumnsClone;
}

function getUiColumns() {
  try {
    let columns = JSON.parse(
      window.localStorage.getItem(UI_COLUMNS_STORAGE_KEY)
    );
    if (!columns) throw new Error('No columns stored yet');
    columns = migrateStoredColumns(columns);
    return columns;
  } catch (e) {
    return DEFAULT_COLUMNS;
  }
}

function uiColumnToTransmissionColumns(column) {
  return COLUMN_MAP[column.name];
}

function uiColumnsToTransmissionColumns(columns) {
  return columns.flatMap(uiColumnToTransmissionColumns);
}

function uiColumnStore() {
  const { subscribe, update, set } = writable(getUiColumns());

  return {
    subscribe,
    update,
    set: (columns) => {
      if (
        columns.some((column) => !Object.keys(COLUMN_MAP).includes(column.name))
      )
        throw new Error('Invalid column passed for storing');
      const data = JSON.stringify(columns);
      window.localStorage.setItem(UI_COLUMNS_STORAGE_KEY, data);
      set(columns);
    },
    active: derived({ subscribe, update, set }, ($columns) =>
      $columns.filter((column) => column.enabled)
    ),
    sizes: derived({ subscribe, update, set }, ($columns) =>
      $columns.reduce((acc, column) => {
        acc[column.name] = column.width;
        return acc;
      }, {})
    ),
    totalSize: derived({ subscribe, update, set }, ($columns) =>
      $columns
        .filter((column) => column.enabled)
        .reduce((acc, column) => acc + column.width, 0)
    ),
  };
}
export const uiColumns = uiColumnStore();

function transmissionColumnStore() {
  return derived([uiColumns.active], ([$uiColumns]) => {
    return [
      ...uiColumnsToTransmissionColumns($uiColumns),
      ...TRANSMISSION_BASE_COLUMNS,
    ].filter((value, index, list) => list.indexOf(value) === index);
  });
}
export const transmissionColumns = transmissionColumnStore();

function createColumnsStore() {
  return derived(
    [uiColumns, transmissionColumns],
    ([$uiColumn, $transmissionColumn]) => ({
      view: $uiColumn,
      transmission: $transmissionColumn,
    })
  );
}
export const columns = createColumnsStore();
