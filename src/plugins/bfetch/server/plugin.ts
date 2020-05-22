/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import {
  CoreStart,
  PluginInitializerContext,
  CoreSetup,
  Plugin,
  Logger,
  KibanaRequest,
} from 'src/core/server';
import { schema } from '@kbn/config-schema';
import { Subject } from 'rxjs';
import {
  StreamingResponseHandler,
  BatchRequestData,
  BatchResponseItem,
  ErrorLike,
  removeLeadingSlash,
  normalizeError,
} from '../common';
import { createNDJSONStream } from './streaming';

// eslint-disable-next-line
export interface BfetchServerSetupDependencies {}

// eslint-disable-next-line
export interface BfetchServerStartDependencies {}

export interface BatchProcessingRouteParams<BatchItemData, BatchItemResult> {
  onBatchItem: (data: BatchItemData) => Promise<BatchItemResult>;
}

export interface BfetchServerSetup {
  addBatchProcessingRoute: <BatchItemData extends object, BatchItemResult extends object>(
    path: string,
    handler: (request: KibanaRequest) => BatchProcessingRouteParams<BatchItemData, BatchItemResult>
  ) => void;
  addStreamingResponseRoute: <Payload, Response>(
    path: string,
    params: (request: KibanaRequest) => StreamingResponseHandler<Payload, Response>
  ) => void;
}

// eslint-disable-next-line
export interface BfetchServerStart {}

export class BfetchServerPlugin
  implements
    Plugin<
      BfetchServerSetup,
      BfetchServerStart,
      BfetchServerSetupDependencies,
      BfetchServerStartDependencies
    > {
  constructor(private readonly initializerContext: PluginInitializerContext) {}

  public setup(core: CoreSetup, plugins: BfetchServerSetupDependencies): BfetchServerSetup {
    const logger = this.initializerContext.logger.get();
    const router = core.http.createRouter();
    const addStreamingResponseRoute = this.addStreamingResponseRoute({ router, logger });
    const addBatchProcessingRoute = this.addBatchProcessingRoute(addStreamingResponseRoute);

    return {
      addBatchProcessingRoute,
      addStreamingResponseRoute,
    };
  }

  public start(core: CoreStart, plugins: BfetchServerStartDependencies): BfetchServerStart {
    return {};
  }

  public stop() {}

  private addStreamingResponseRoute = ({
    router,
    logger,
  }: {
    router: ReturnType<CoreSetup['http']['createRouter']>;
    logger: Logger;
  }): BfetchServerSetup['addStreamingResponseRoute'] => (path, handler) => {
    router.post(
      {
        path: `/${removeLeadingSlash(path)}`,
        validate: {
          body: schema.any(),
        },
      },
      async (context, request, response) => {
        const handlerInstance = handler(request);
        const data = request.body;
        const headers = {
          'Content-Type': 'application/x-ndjson',
          Connection: 'keep-alive',
          'Transfer-Encoding': 'chunked',
          'Cache-Control': 'no-cache',
        };
        return response.ok({
          headers,
          body: createNDJSONStream(data, handlerInstance, logger),
        });
      }
    );
  };

  private addBatchProcessingRoute = (
    addStreamingResponseRoute: BfetchServerSetup['addStreamingResponseRoute']
  ): BfetchServerSetup['addBatchProcessingRoute'] => <
    BatchItemData extends object,
    BatchItemResult extends object,
    E extends ErrorLike = ErrorLike
  >(
    path: string,
    handler: (request: KibanaRequest) => BatchProcessingRouteParams<BatchItemData, BatchItemResult>
  ) => {
    addStreamingResponseRoute<
      BatchRequestData<BatchItemData>,
      BatchResponseItem<BatchItemResult, E>
    >(path, (request) => {
      const handlerInstance = handler(request);
      return {
        getResponseStream: ({ batch }) => {
          const subject = new Subject<BatchResponseItem<BatchItemResult, E>>();
          let cnt = batch.length;
          batch.forEach(async (batchItem, id) => {
            try {
              const result = await handlerInstance.onBatchItem(batchItem);
              subject.next({ id, result });
            } catch (err) {
              const error = normalizeError<E>(err);
              subject.next({ id, error });
            } finally {
              cnt--;
              if (!cnt) subject.complete();
            }
          });
          return subject;
        },
      };
    });
  };
}
