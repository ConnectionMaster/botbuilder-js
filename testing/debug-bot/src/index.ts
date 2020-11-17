// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import dotenv from 'dotenv';
import restify from 'restify';

import { ActivityHandler, BotFrameworkAdapter, CloudAdapter, MessageFactory } from 'botbuilder';

import {
    AuthenticationConfiguration,
    BotFrameworkAuthenticationFactory,
    PasswordServiceClientCredentialFactory,
} from 'botframework-connector';

dotenv.config();
const { env } = process;

export class Bot extends ActivityHandler {
    constructor() {
        super();

        this.onMessage(async (context, next) => {
            const replyText = `Echo: ${context.activity.text}`;
            await context.sendActivity(MessageFactory.text(replyText, replyText));
            return next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded ?? [];
            const welcomeText = 'Hello and welcome!';

            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                }
            }

            return next();
        });
    }
}

const credentialFactory = new PasswordServiceClientCredentialFactory(env.APP_ID, env.APP_PASSWORD);

const authConfig = new AuthenticationConfiguration();

const authentication = BotFrameworkAuthenticationFactory.create(
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    credentialFactory,
    authConfig
);

const adapter = new CloudAdapter(authentication);

// const adapter = new BotFrameworkAdapter({
//     appId: env.APP_ID,
//     appPassword: env.APP_PASSWORD,
// });

adapter.onTurnError = async (context, error) => {
    console.error(error);
};

const bot = new Bot();

const server = restify.createServer();

server.post('/api/messages', (req, res) => {
    adapter.process(req, res, (context) => bot.run(context));
});

server.listen(3978, () => console.log(`server listening on 3978...`));
