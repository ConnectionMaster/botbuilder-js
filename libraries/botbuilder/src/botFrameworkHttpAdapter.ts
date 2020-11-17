// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { TurnContext } from 'botbuilder-core';
import { WebRequest, WebResponse } from './interfaces';

export interface BotFrameworkHttpAdapter {
    process(req: WebRequest, res: WebResponse, logic: (turnContext: TurnContext) => Promise<void>): Promise<void>;
}
