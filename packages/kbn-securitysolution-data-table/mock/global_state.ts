/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { TableId } from '../common/types';
import { defaultHeaders } from './header';
// import {
//   DEFAULT_INDEX_PATTERN,
//   DEFAULT_DATA_VIEW_ID,
//   DEFAULT_SIGNALS_INDEX,
// } from '../common/constants';

// export const mockSourcererState = {
//   ...initialSourcererState,
//   signalIndexName: `${DEFAULT_SIGNALS_INDEX}-spacename`,
//   defaultDataView: {
//     ...initialSourcererState.defaultDataView,
//     browserFields: mockBrowserFields,
//     id: DEFAULT_DATA_VIEW_ID,
//     indexFields: mockIndexFields,
//     loading: false,
//     patternList: [...DEFAULT_INDEX_PATTERN, `${DEFAULT_SIGNALS_INDEX}-spacename`],
//     runtimeMappings: mockRuntimeMappings,
//     title: [...DEFAULT_INDEX_PATTERN, `${DEFAULT_SIGNALS_INDEX}-spacename`].join(','),
//   },
// };

// FIXME add strong typings
export const mockGlobalState: any = {
  app: {
    notesById: {},
    errors: [
      { id: 'error-id-1', title: 'title-1', message: ['error-message-1'] },
      { id: 'error-id-2', title: 'title-2', message: ['error-message-2'] },
    ],
  },
  dataTable: {
    tableById: {
      [TableId.test]: {
        columns: defaultHeaders,
        defaultColumns: defaultHeaders,
        dataViewId: 'security-solution-default',
        deletedEventIds: [],
        expandedDetail: {},
        filters: [],
        indexNames: ['.alerts-security.alerts-default'],
        isSelectAllChecked: false,
        itemsPerPage: 25,
        itemsPerPageOptions: [10, 25, 50, 100],
        loadingEventIds: [],
        selectedEventIds: {},
        showCheckboxes: false,
        sort: [
          {
            columnId: '@timestamp',
            columnType: 'date',
            esTypes: ['date'],
            sortDirection: 'desc',
          },
        ],
        graphEventId: '',
        sessionViewConfig: null,
        selectAll: false,
        id: TableId.test,
        title: '',
        initialized: true,
        updated: 1663882629000,
        isLoading: false,
        queryFields: [],
        totalCount: 0,
      },
    },
  },
  // sourcerer: {
  //   ...mockSourcererState,
  //   defaultDataView: {
  //     ...mockSourcererState.defaultDataView,
  //     title: `${mockSourcererState.defaultDataView.title},fakebeat-*`,
  //   },
  //   kibanaDataViews: [
  //     {
  //       ...mockSourcererState.defaultDataView,
  //       title: `${mockSourcererState.defaultDataView.title},fakebeat-*`,
  //     },
  //   ],
  //   sourcererScopes: {
  //     ...mockSourcererState.sourcererScopes,
  //     [SourcererScopeName.default]: {
  //       ...mockSourcererState.sourcererScopes[SourcererScopeName.default],
  //       selectedDataViewId: mockSourcererState.defaultDataView.id,
  //       selectedPatterns: getScopePatternListSelection(
  //         mockSourcererState.defaultDataView,
  //         SourcererScopeName.default,
  //         mockSourcererState.signalIndexName,
  //         true
  //       ),
  //     },
  //     [SourcererScopeName.detections]: {
  //       ...mockSourcererState.sourcererScopes[SourcererScopeName.detections],
  //       selectedDataViewId: mockSourcererState.defaultDataView.id,
  //       selectedPatterns: getScopePatternListSelection(
  //         mockSourcererState.defaultDataView,
  //         SourcererScopeName.detections,
  //         mockSourcererState.signalIndexName,
  //         true
  //       ),
  //     },
  //     [SourcererScopeName.timeline]: {
  //       ...mockSourcererState.sourcererScopes[SourcererScopeName.timeline],
  //       selectedDataViewId: mockSourcererState.defaultDataView.id,
  //       selectedPatterns: getScopePatternListSelection(
  //         mockSourcererState.defaultDataView,
  //         SourcererScopeName.timeline,
  //         mockSourcererState.signalIndexName,
  //         true
  //       ),
  //     },
  //   },
  // },
  globalUrlParam: {},
};
