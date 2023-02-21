/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/* eslint-disable eslint-comments/no-unused-disable */

import { isEmpty } from 'lodash/fp';
import type { Storage } from '@kbn/kibana-utils-plugin/public';
import type { ColumnHeaderOptions, TableIdLiteral } from '../../common/types';
import type { DataTablesStorage } from './types';
import type { DataTableModel } from '../../store/data_table/model';

export const LOCAL_STORAGE_TABLE_KEY = 'securityDataTable';
const LOCAL_STORAGE_TIMELINE_KEY_LEGACY = 'timelines';
const EMPTY_TABLE = {} as {
  [K in TableIdLiteral]: DataTableModel;
};

/**
 * Migrates the values of the data table from the legacy timelines key to the securityDataTable key
 */
export const migrateLegacyTimelinesToSecurityDataTable = (legacyTimelineTables: any) => {
  if (!legacyTimelineTables) {
    return EMPTY_TABLE;
  }

  return Object.keys(legacyTimelineTables).reduce((acc, timelineTableId) => {
    const timelineModel = legacyTimelineTables[timelineTableId];
    return {
      ...acc,
      [timelineTableId]: {
        defaultColumns: timelineModel.defaultColumns,
        dataViewId: timelineModel.dataViewId,
        excludedRowRendererIds: timelineModel.excludedRowRendererIds,
        filters: timelineModel.filters,
        indexNames: timelineModel.indexNames,
        loadingEventIds: timelineModel.loadingEventIds,
        isSelectAllChecked: timelineModel.isSelectAllChecked,
        itemsPerPage: timelineModel.itemsPerPage,
        itemsPerPageOptions: timelineModel.itemsPerPageOptions,
        showCheckboxes: timelineModel.showCheckboxes,
        graphEventId: timelineModel.graphEventId,
        sessionViewConfig: timelineModel.sessionViewConfig,
        selectAll: timelineModel.selectAll,
        id: timelineModel.id,
        title: timelineModel.title,
        initialized: timelineModel.initialized,
        updated: timelineModel.updated,
        sort: timelineModel.sort,
        selectedEventIds: timelineModel.selectedEventIds,
        deletedEventIds: timelineModel.deletedEventIds,
        expandedDetail: timelineModel.expandedDetail,
        totalCount: timelineModel.totalCount || 0,
        ...(Array.isArray(timelineModel.columns)
          ? {
              columns: timelineModel.columns
                .map(migrateColumnWidthToInitialWidth)
                .map(migrateColumnLabelToDisplayAsText),
            }
          : {}),
      },
    };
  }, {} as { [K in TableIdLiteral]: DataTableModel });
};

/**
 * Migrates the value of the column's `width` property to `initialWidth`
 * when `width` is valid, and `initialWidth` is invalid
 */
export const migrateColumnWidthToInitialWidth = (
  column: ColumnHeaderOptions & { width?: number }
) => ({
  ...column,
  ...(Number.isInteger(column.width) && !Number.isInteger(column.initialWidth)
    ? { initialWidth: column.width }
    : column.initialWidth
    ? { initialWidth: column.initialWidth }
    : {}),
});

/**
 * Migrates the value of the column's `label` property to `displayAsText`
 * when `label` is valid, and `displayAsText` is `undefined`
 */
export const migrateColumnLabelToDisplayAsText = (
  column: ColumnHeaderOptions & { label?: string }
) => ({
  ...column,
  ...(!isEmpty(column.label) && column.displayAsText == null
    ? { displayAsText: column.label }
    : column.displayAsText
    ? { displayAsText: column.displayAsText }
    : {}),
});

export const getDataTablesInStorageByIds = (storage: Storage, tableIds: TableIdLiteral[]) => {
  let allDataTables = storage.get(LOCAL_STORAGE_TABLE_KEY);
  const legacyTimelineTables = storage.get(LOCAL_STORAGE_TIMELINE_KEY_LEGACY);

  if (!allDataTables) {
    if (legacyTimelineTables) {
      allDataTables = migrateLegacyTimelinesToSecurityDataTable(legacyTimelineTables);
    } else {
      return EMPTY_TABLE;
    }
  }

  return tableIds.reduce((acc, tableId) => {
    const tableModel = allDataTables[tableId];
    if (!tableModel) {
      return {
        ...acc,
      };
    }

    return {
      ...acc,
      [tableId]: {
        ...tableModel,
        ...(tableModel.sort != null && !Array.isArray(tableModel.sort)
          ? { sort: [tableModel.sort] }
          : {}),
      },
    };
  }, {} as { [K in TableIdLiteral]: DataTableModel });
};

export const getAllDataTablesInStorage = (storage: Storage) => {
  let allDataTables = storage.get(LOCAL_STORAGE_TABLE_KEY);
  const legacyTimelineTables = storage.get(LOCAL_STORAGE_TIMELINE_KEY_LEGACY);
  if (!allDataTables) {
    if (legacyTimelineTables) {
      allDataTables = migrateLegacyTimelinesToSecurityDataTable(legacyTimelineTables);
    } else {
      return EMPTY_TABLE;
    }
  }
  return allDataTables;
};

export const addTableInStorage = (storage: Storage, id: TableIdLiteral, table: DataTableModel) => {
  const tableToStore = getSerializingTableToStore(table);
  const tables = getAllDataTablesInStorage(storage);
  storage.set(LOCAL_STORAGE_TABLE_KEY, {
    ...tables,
    [id]: tableToStore,
  });
};

const getSerializingTableToStore = (table: DataTableModel) => {
  // discard unneeded fields to make sure the object serialization works
  const { isLoading, loadingText, queryFields, unit, ...tableToStore } = table;
  return tableToStore;
};

export type { DataTablesStorage };
