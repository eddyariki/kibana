/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

export enum Direction {
  asc = 'asc',
  desc = 'desc',
}

export type SortDirectionTable = 'none' | 'asc' | 'desc' | Direction;
export interface SortColumnTable {
  columnId: string;
  columnType: string;
  esTypes?: string[];
  sortDirection: SortDirectionTable;
}

export enum TableId {
  usersPageEvents = 'users-page-events',
  hostsPageEvents = 'hosts-page-events',
  networkPageEvents = 'network-page-events',
  hostsPageSessions = 'hosts-page-sessions-v2', // the v2 is to cache bust localstorage settings as default columns were reworked.
  alertsOnRuleDetailsPage = 'alerts-rules-details-page',
  alertsOnAlertsPage = 'alerts-page',
  test = 'table-test', // Reserved for testing purposes
  alternateTest = 'alternateTest',
  rulePreview = 'rule-preview',
  kubernetesPageSessions = 'kubernetes-page-sessions',
}
