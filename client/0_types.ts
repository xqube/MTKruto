/**
 * MTKruto - Cross-runtime JavaScript library for building Telegram clients
 * Copyright (C) 2023-2024 Roj <https://roj.im/>
 *
 * This file is part of MTKruto.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { enums, functions, types } from "../2_tl.ts";
import { Storage } from "../3_storage.ts";
import { ConnectionState, EntityGetter, ID, ParseMode, Update } from "../3_types.ts";

type Functions = typeof functions;
type Keys = keyof Functions;
// deno-lint-ignore no-explicit-any
type AnyFunc = (...args: any) => any;
type Promisify<T extends AnyFunc> = (...args: Parameters<T>) => Promise<ReturnType<T>>;
export type Api = { [K in Keys]: Functions[K] extends { __F: AnyFunc } ? Promisify<Functions[K]["__F"]> : { [K_ in keyof Functions[K]]: Functions[K][K_] extends { __F: AnyFunc } ? Promisify<Functions[K][K_]["__F"]> : Functions[K][K_] } };

interface ApiFactory {
  (dcId?: number): { api: Api; connect: () => Promise<void>; disconnect: () => Promise<void> };
}

export interface C {
  id: number;
  api: Api;
  storage: Storage;
  messageStorage: Storage;
  guaranteeUpdateDelivery: boolean;
  setConnectionState: (connectionState: ConnectionState) => void;
  resetConnectionState: () => void;
  getSelfId: () => Promise<number>;
  getInputPeer: (id: ID) => Promise<enums.InputPeer>;
  getInputChannel: (id: ID) => Promise<types.InputChannel>;
  getInputUser: (id: ID) => Promise<types.InputUser>;
  getEntity: EntityGetter;
  handleUpdate: (update: Update) => void;
  parseMode: ParseMode;
  apiFactory: ApiFactory;
  ignoreOutgoing: boolean | null;
  cdn: boolean;
  dropPendingUpdates?: boolean;
  invoke<T extends (functions.Function<unknown> | types.Type) = functions.Function<unknown>>(function_: T, businessConnectionId: string | undefined): Promise<T extends functions.Function<unknown> ? T["__R"] : void>;
}
