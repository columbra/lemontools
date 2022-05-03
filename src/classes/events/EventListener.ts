/**
 * @fileoverview Event listener structure
 * @since v3.0.0
 */

import type { ClientEvents } from "discord.js";
import type LemonTools from "../../LemonTools";

export default class EventListener<E extends keyof ClientEvents> {
  constructor(public event: E, public execute: EventListenerExecute<E>) {}
}

type EventListenerExecute<E extends keyof ClientEvents> = (
  params: EventListenerExecuteParams<E>,
  ...args: ClientEvents[E]
) => unknown;

interface EventListenerExecuteParams<E> {
  event: E;
  lemontools: LemonTools;
}
