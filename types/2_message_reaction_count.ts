import { fromUnixTimestamp } from "../1_utilities.ts";
import { types } from "../2_tl.ts";
import { EntityGetter } from "./_getters.ts";
import { ChatP, constructChatP } from "./1_chat_p.ts";
import { constructReactionCount, ReactionCount } from "./1_reaction_count.ts";

/** Information on the reactions made to a channel post. */
export interface MessageReactionCount {
  /** The chat containing the message. */
  chat: ChatP;
  /** The message's identifier. */
  messageId: number;
  /** This reaction state's point of time. */
  date: Date;
  /** The reactions made to the post. */
  reactions: ReactionCount[];
}

export async function constructMessageReactionCount(update: types.UpdateBotMessageReactions, getEntity: EntityGetter): Promise<MessageReactionCount | null> {
  const date = fromUnixTimestamp(update.date);
  const reactions = update.reactions.map((v) => constructReactionCount(v));
  const entity = await getEntity(update.peer);
  if (entity) {
    const chat = constructChatP(entity);
    const messageId = update.msg_id;
    const messageReactionCount = { chat, messageId, date, reactions };
    return messageReactionCount;
  } else {
    return null;
  }
}
