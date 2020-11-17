// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AuthenticationConfiguration } from './authenticationConfiguration';
import { AuthenticationConstants } from './authenticationConstants';
import { BuiltinBotFrameworkAuthentication } from './builtinBotFrameworkAuthentication';
import { CallerIdConstants } from 'botframework-schema';
import { ServiceClientCredentialsFactory } from './serviceClientCredentialsFactory';

export class PublicCloudBotFrameworkAuthentication extends BuiltinBotFrameworkAuthentication {
    constructor(credentialFactory: ServiceClientCredentialsFactory, authConfiguration: AuthenticationConfiguration) {
        super(
            AuthenticationConstants.ToChannelFromBotOAuthScope,
            AuthenticationConstants.ToChannelFromBotLoginUrlPrefix,
            CallerIdConstants.PublicAzureChannel,
            undefined,
            credentialFactory,
            authConfiguration
        );
    }
}
