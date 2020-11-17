// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Activity } from 'botframework-schema';
import { ClaimsIdentity } from './claimsIdentity';
import { ServiceClientCredentials } from '@azure/ms-rest-js';
import { assert, Assertion } from 'botbuilder-stdlib';

export interface ProactiveCredentialsResult {
    credentials: ServiceClientCredentials;
    scope: string;
}

export interface AuthenticateRequestResult extends ProactiveCredentialsResult {
    claimsIdentity: ClaimsIdentity;
    callerId: string;
}

export abstract class BotFrameworkAuthentication {
    static assert: Assertion<BotFrameworkAuthentication> = assert.instanceOf(
        'BotFrameworkAuthentication',
        BotFrameworkAuthentication
    );

    static isType = assert.toTest(BotFrameworkAuthentication.assert);

    abstract authenticateRequest(
        activity: Activity,
        authHeader: string | undefined
    ): Promise<AuthenticateRequestResult>;

    abstract getProactiveCredentials(
        claimsIdentity: ClaimsIdentity,
        audience: string | undefined
    ): Promise<ProactiveCredentialsResult>;
}
