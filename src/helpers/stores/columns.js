import config from '~helpers/configHelper';
import { writable, derived } from 'svelte/store';
import {
  TRANSMISSION_BASE_COLUMNS,
  COLUMN_MAP,
  UI_COLUMN,
} from '~helpers/constants/columns';

const UI_COLUMNS_STORAGE_KEY = 'ui-columns';
const UI_COLUMN_VALUES = Object.values(UI_COLUMN);
const UI_COLUMN_IDS = UI_COLUMN_VALUES.map((column) => column.id);

function storeColumns(columns) {
  const columnIds = Object.keys(COLUMN_MAP).map((column) =>
    parseInt(column, 10)
  );
  const columnsInvalid = columns.some(
    (column) => !columnIds.includes(column.id)
  );
  if (columnsInvalid) {
    throw new Error('Invalid column passed for storing');
  }

  const data = JSON.stringify(columns);
  window.localStorage.setItem(UI_COLUMNS_STORAGE_KEY, data);
}

function migrateStoredColumns(storedColumns) {
  const storedColumnsClone = JSON.parse(JSON.stringify(storedColumns));

  // Find all the columns that are still supported, remove any ones that have been removed
  const cleanedStoredColumns = storedColumnsClone.filter(({ id }) =>
    UI_COLUMN_IDS.includes(id)
  );

  // Find all columns that aren't included in the stored version
  const storedColumnIds = storedColumnsClone.map((column) => column.id);
  const missingColumns = UI_COLUMN_VALUES.filter(({ id }) => {
    return !storedColumnIds.includes(id);
  });

  const newColumns = [...cleanedStoredColumns, ...missingColumns];
  storeColumns(newColumns);
  return newColumns;
}

function getUiColumns() {
  try {
    let columns = JSON.parse(
      window.localStorage.getItem(UI_COLUMNS_STORAGE_KEY)
    );
    if (!columns) throw new Error('No columns stored yet');
    return migrateStoredColumns(columns);
  } catch (e) {
    return config.COLUMNS;
  }
}

function uiColumnToTransmissionColumns(column) {
  return COLUMN_MAP[column.id];
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
      storeColumns(columns);
      set(columns);
    },
    active: derived({ subscribe, update, set }, ($columns) =>
      $columns.filter((column) => column.enabled)
    ),
    sizes: derived({ subscribe, update, set }, ($columns) =>
      $columns.reduce((acc, column) => {
        acc[column.id] = column.width;
        return acc;
      }, {})
    ),
    totalSize: derived({ subscribe, update, set }, ($columns) =>
      $columns
        .filter((column) => column.enabled)
        .reduce((acc, column) => acc + column.width, 0)
    ),
    getColumnLabel: (id) => {
      return UI_COLUMN_VALUES.find((column) => column.id === id)?.label;
    },
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
