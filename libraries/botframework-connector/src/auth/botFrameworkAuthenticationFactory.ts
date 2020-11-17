// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AuthenticationConfiguration } from './authenticationConfiguration';
import { BotFrameworkAuthentication } from './botFrameworkAuthentication';
import { GovernmentCloudBotFrameworkAuthentication } from './governmentCloudBotFrameworkAuthentication';
import { GovernmentConstants } from './governmentConstants';
import { ParameterizedBotFrameworkAuthentication } from './parameterizedBotFrameworkAuthentication';
import { PublicCloudBotFrameworkAuthentication } from './publicCloudBotFrameworkAuthentication';
import { ServiceClientCredentialsFactory } from './serviceClientCredentialsFactory';

export class BotFrameworkAuthenticationFactory {
    static create(
        channelService?: string,
        validateAuthority?: boolean,
        toChannelFromBotLoginUrl?: string,
        toChannelFromBotOAuthScope?: string,
        toBotFromChannelTokenIssuer?: string,
        oAuthUrl?: string,
        toBotFromChannelOpenIdMetadataUrl?: string,
        toBotFromEmulatorOpenIdMetadataUrl?: string,
        callerId?: string,
        credentialFactory?: ServiceClientCredentialsFactory,
        authConfiguration?: AuthenticationConfiguration
    ): BotFrameworkAuthentication {
        if (
            channelService ||
            toChannelFromBotLoginUrl ||
            toChannelFromBotOAuthScope ||
            toBotFromChannelTokenIssuer ||
            oAuthUrl ||
            toBotFromChannelOpenIdMetadataUrl ||
            toBotFromEmulatorOpenIdMetadataUrl ||
            callerId
        ) {
            return new ParameterizedBotFrameworkAuthentication(
                validateAuthority,
                toChannelFromBotLoginUrl,
                toChannelFromBotOAuthScope,
                toBotFromChannelTokenIssuer,
                oAuthUrl,
                toBotFromChannelOpenIdMetadataUrl,
                toBotFromEmulatorOpenIdMetadataUrl,
                callerId,
                credentialFactory,
                authConfiguration
            );
        } else {
            if (!channelService) {
                return new PublicCloudBotFrameworkAuthentication(credentialFactory, authConfiguration);
            } else if (channelService === GovernmentConstants.ChannelService) {
                return new GovernmentCloudBotFrameworkAuthentication(credentialFactory, authConfiguration);
            } else {
                throw new TypeError('The provided ChannelService value is not supported');
            }
        }
    }
}
