import type { ReleaseArtifact, LinkedInConfig } from "../domain/release.js";
import type { DestinationResult } from "../domain/result.js";
import type { Publisher } from "./publisher.js";
export type Fetcher = typeof fetch;
export declare class LinkedInPublisher implements Publisher {
    private config;
    private request;
    constructor(config: LinkedInConfig, request?: Fetcher);
    publish(a: ReleaseArtifact): Promise<DestinationResult>;
}
