// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Activity, CallerIdConstants } from 'botframework-schema';
import { AuthenticationConfiguration } from './authenticationConfiguration';
import { AuthenticationConstants } from './authenticationConstants';
import { ClaimsIdentity } from './claimsIdentity';
import { DelegatingCredentialProvider } from './credentialProvider';
import { JwtTokenValidation } from './jwtTokenValidation';
import { ServiceClientCredentialsFactory } from './serviceClientCredentialsFactory';
import { SkillValidation } from './skillValidation';

import {
    AuthenticateRequestResult,
    BotFrameworkAuthentication,
    ProactiveCredentialsResult,
} from './botFrameworkAuthentication';

// An abstract class that holds some common auth logic for built in (Azure based) environments
export abstract class BuiltinBotFrameworkAuthentication extends BotFrameworkAuthentication {
    constructor(
        private readonly toChannelFromBotOAuthScope: string,
        private readonly loginEndpoint: string,
        private readonly callerId: string,
        private readonly channelService: string,
        private readonly credentialFactory?: ServiceClientCredentialsFactory,
        private readonly authConfiguration?: AuthenticationConfiguration
    ) {
        super();
    }

    /**
     * Extract app ID from claims identity.
     *
     * @param {ClaimsIdentity} claimsIdentity claims identity from which app ID is extracted
     * @returns {string} the app ID
     */
    static getAppId(claimsIdentity: ClaimsIdentity): string {
        let botAppIdClaim = claimsIdentity.claims.find((claim) => claim.type === AuthenticationConstants.AudienceClaim);

        if (!botAppIdClaim) {
            botAppIdClaim = claimsIdentity.claims.find((claim) => claim.type === AuthenticationConstants.AppIdClaim);
        }

        return botAppIdClaim?.value;
    }

    private async generateCallerId(claimsIdentity: ClaimsIdentity): Promise<string> {
        if (await this.credentialFactory.isAuthenticatedDisabled()) {
            return null;
        }

        if (SkillValidation.isSkillClaim(claimsIdentity.claims)) {
            return `${CallerIdConstants.BotToBotPrefix}${JwtTokenValidation.getAppIdFromClaims(claimsIdentity.claims)}`;
        }

        return this.callerId;
    }

    /**
     * Authenticate an activity request
     *
     * @param {Activity} activity the activity to authenticate
     * @param {string} authHeader the HTTP auth header value
     * @returns {Promise<AuthenticateRequestResult>} a promise that resolves to authentication request results
     */
    async authenticateRequest(activity: Activity, authHeader: string): Promise<AuthenticateRequestResult> {
        const claimsIdentity = await JwtTokenValidation.authenticateRequest(
            activity,
            authHeader,
            new DelegatingCredentialProvider(this.credentialFactory),
            this.channelService,
            this.authConfiguration
        );

        const scope = SkillValidation.isSkillClaim(claimsIdentity.claims)
            ? JwtTokenValidation.getAppIdFromClaims(claimsIdentity.claims)
            : this.toChannelFromBotOAuthScope;

        const callerId = await this.generateCallerId(claimsIdentity);

        const appId = BuiltinBotFrameworkAuthentication.getAppId(claimsIdentity);

        const credentials = await this.credentialFactory.createCredentials(appId, scope, this.loginEndpoint, true);

        return { callerId, claimsIdentity, credentials, scope };
    }

    /**
     * Get proactive credentials for the given claims and audience
     *
     * @param {ClaimsIdentity} claimsIdentity the claims for the proactive credentials
     * @param {string} audience the audience for the proactive credentials
     * @returns {Promise<ProactiveCredentialsResult>} a promise that resolves to proactive credentials request results
     */
    async getProactiveCredentials(
        claimsIdentity: ClaimsIdentity,
        audience: string
    ): Promise<ProactiveCredentialsResult> {
        const scope = audience ?? this.toChannelFromBotOAuthScope;

        const appId = BuiltinBotFrameworkAuthentication.getAppId(claimsIdentity);

        const credentials = await this.credentialFactory.createCredentials(appId, scope, this.loginEndpoint, true);

        return { credentials, scope };
    }
}
