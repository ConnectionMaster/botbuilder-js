// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { TurnContext } from 'botbuilder-core';
import { assert, Assertion } from 'botbuilder-stdlib';

export type BotLogic<T = void> = (turnContext: TurnContext) => Promise<T>;

export const assertBotLogic: Assertion<BotLogic> = (val, path) => {
    assert.func(val, path);
};

export const isBotLogic = assert.toTest(assertBotLogic);
