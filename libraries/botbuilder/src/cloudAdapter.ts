// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * @module botbuilder
 */

import { BotFrameworkHttpAdapter } from './botFrameworkHttpAdapter';
import { CloudAdapterBase } from './cloudAdapterBase';
import { StatusCodeError } from './statusCodeError';
import { StatusCodes } from 'botbuilder-core';
import { readRequest, writeResponse } from './httpHelper';
import { assert, tests } from 'botbuilder-stdlib';

import {
    BotLogic,
    Emitter,
    Request,
    Response,
    assertBotLogic,
    assertEmitter,
    assertRequest,
    assertResponse,
} from './interfaces';

import {
    AuthenticationConfiguration,
    BotFrameworkAuthentication,
    BotFrameworkAuthenticationFactory,
    PasswordServiceClientCredentialFactory,
} from 'botframework-connector';

export class CloudAdapter extends CloudAdapterBase implements BotFrameworkHttpAdapter {
    /**
     * Construct a CloudAdapter.
     *
     * @param {BotFrameworkAuthentication} botFrameworkAuthentication the bot framework authentication, optional
     */
    constructor(botFrameworkAuthentication?: BotFrameworkAuthentication);
    constructor(maybeBotFrameworkAuthentication?: unknown) {
        let botFrameworkAuthentication: BotFrameworkAuthentication;
        if (maybeBotFrameworkAuthentication) {
            BotFrameworkAuthentication.assert(maybeBotFrameworkAuthentication, ['botFrameworkAuthentication']);
            botFrameworkAuthentication = maybeBotFrameworkAuthentication;
        } else {
            botFrameworkAuthentication = BotFrameworkAuthenticationFactory.create(
                undefined,
                false,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                new PasswordServiceClientCredentialFactory(),
                new AuthenticationConfiguration()
            );
        }

        super(botFrameworkAuthentication);
    }

    /**
     * Process an incoming HTTP request
     *
     * @param {Request & Emitter} req an HTTP request
     * @param {Response} res an HTTP response
     * @param {BotLogic} logic the bot logic
     * @returns {Promise<void>} a promise representing the asynchronous handling of the request/response lifecycle
     */
    async process(req: Request & Emitter, res: Response, logic: BotLogic): Promise<void>;
    async process(req: unknown, res: unknown, logic: unknown): Promise<void> {
        assertRequest(req, ['req']);
        assertEmitter(req, ['req']);
        assertResponse(res, ['res']);
        assertBotLogic(logic, ['logic']);

        const activity = await readRequest(req);
        if (!activity) {
            res.status(StatusCodes.BAD_REQUEST);
            res.end();
            return;
        }

        try {
            const maybeAuthHeaders = req.headers.Authorization ?? req.headers.authorization ?? [];
            const authHeader = tests.isString(maybeAuthHeaders) ? maybeAuthHeaders : maybeAuthHeaders[0] ?? '';

            const invokeResponse = await this.processActivity(authHeader, activity, logic);
            writeResponse(res, invokeResponse);
        } catch (err) {
            res.status(err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR);
            res.end();
        }
    }
}
