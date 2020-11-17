// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Activity } from 'botframework-schema';
import { AuthenticationConfiguration } from './authenticationConfiguration';
import { ClaimsIdentity } from './claimsIdentity';
import { ServiceClientCredentialsFactory } from './serviceClientCredentialsFactory';

import {
    AuthenticateRequestResult,
    BotFrameworkAuthentication,
    ProactiveCredentialsResult,
} from './botFrameworkAuthentication';

export class ParameterizedBotFrameworkAuthentication extends BotFrameworkAuthentication {
    constructor(
        private readonly validateAuthority: boolean,
        private readonly toChannelFromBotLoginUrl: string,
        private readonly toChannelFromBotOAuthScope: string,
        private readonly toBotFromChannelTokenIssuer: string,
        private readonly oAuthUrl: string,
        private readonly toBotFromChannelOpenIdMetadataUrl: string,
        private readonly toBotFromEmulatorOpenIdMetadataUrl: string,
        private readonly callerId: string,
        private readonly credentialFactory: ServiceClientCredentialsFactory,
        private readonly authConfiguration: AuthenticationConfiguration
    ) {
        super();
    }

    authenticateRequest(activity: Activity, authHeader: string): Promise<AuthenticateRequestResult> {
        throw new Error('Method not implemented.');
    }

    getProactiveCredentials(claimsIdentity: ClaimsIdentity, audience: string): Promise<ProactiveCredentialsResult> {
        throw new Error('Method not implemented.');
    }
}
