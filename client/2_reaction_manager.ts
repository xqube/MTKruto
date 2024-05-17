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

import { unreachable } from "../0_deps.ts";
import { Api, is, isOneOf, peerToChatId } from "../2_tl.ts";
import { constructMessageReaction, constructMessageReactionCount, constructMessageReactions, Update } from "../3_types.ts";
import { C } from "./1_types.ts";

type ReactionManagerUpdate =
  | Api.updateBotMessageReactions
  | Api.updateBotMessageReaction
  | Api.updateMessageReactions
  | Api.updateChannelMessageViews
  | Api.updateChannelMessageForwards;

export class ReactionManager {
  #c: C;

  constructor(c: C) {
    this.#c = c;
  }

  static canHandleUpdate(update: Api.Update): update is ReactionManagerUpdate {
    return isOneOf([
      "updateBotMessageReactions",
      "updateBotMessageReaction",
      "updateMessageReactions",
      "updateChannelMessageViews",
      "updateChannelMessageForwards",
    ], update);
  }

  async handleUpdate(update: ReactionManagerUpdate): Promise<Update | null> {
    if (is("updateBotMessageReactions", update)) {
      const messageReactionCount = await constructMessageReactionCount(update, this.#c.getEntity);
      if (messageReactionCount) {
        return { messageReactionCount };
      } else {
        return null;
      }
    } else if (is("updateBotMessageReaction", update)) {
      const messageReactions = await constructMessageReactions(update, this.#c.getEntity);
      if (messageReactions) {
        return { messageReactions };
      } else {
        return null;
      }
    } else if (is("updateMessageReactions", update)) {
      const chatId = peerToChatId(update.peer);
      const message = await this.#c.messageStorage.getMessage(chatId, update.msg_id);
      if (is("message", message)) {
        message.reactions = update.reactions;
        await this.#c.messageStorage.setMessage(chatId, update.msg_id, message);
        const views = message.views ?? 0;
        const forwards = message.forwards ?? 0;
        const recentReactions = update.reactions.recent_reactions ?? [];
        const reactions = update.reactions.results.map((v) => constructMessageReaction(v, recentReactions));
        return { messageInteractions: { chatId, messageId: update.msg_id, reactions, views, forwards } };
      } else {
        return null;
      }
    } else if (isOneOf(["updateChannelMessageViews", "updateChannelMessageForwards"], update)) {
      const chatId = peerToChatId({ ...update, _: "peerChannel" });
      const message = await this.#c.messageStorage.getMessage(chatId, update.id);
      if (is("message", message)) {
        if ("views" in update) {
          message.views = update.views;
        }
        if ("forwards" in update) {
          message.forwards = update.forwards;
        }
        const views = message.views ?? 0;
        const forwards = message.forwards ?? 0;
        const recentReactions = message.reactions?.recent_reactions ?? [];
        const reactions = message.reactions?.results.map((v) => constructMessageReaction(v, recentReactions)) ?? [];
        return { messageInteractions: { chatId, messageId: update.id, reactions, views, forwards } };
      } else {
        return null;
      }
    } else {
      unreachable();
    }
  }
}
