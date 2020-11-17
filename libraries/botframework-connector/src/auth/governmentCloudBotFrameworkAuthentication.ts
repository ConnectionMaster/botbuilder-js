// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AuthenticationConfiguration } from './authenticationConfiguration';
import { BuiltinBotFrameworkAuthentication } from './builtinBotFrameworkAuthentication';
import { CallerIdConstants } from 'botframework-schema';
import { GovernmentConstants } from './governmentConstants';
import { ServiceClientCredentialsFactory } from './serviceClientCredentialsFactory';

export class GovernmentCloudBotFrameworkAuthentication extends BuiltinBotFrameworkAuthentication {
    constructor(credentialFactory: ServiceClientCredentialsFactory, authConfiguration: AuthenticationConfiguration) {
        super(
            GovernmentConstants.ToChannelFromBotOAuthScope,
            GovernmentConstants.ToChannelFromBotLoginUrl,
            CallerIdConstants.USGovChannel,
            GovernmentConstants.ChannelService,
            credentialFactory,
            authConfiguration
        );
    }
}
