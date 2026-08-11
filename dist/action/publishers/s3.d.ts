import { PutObjectCommand } from "@aws-sdk/client-s3";
import type { ReleaseArtifact, S3Config } from "../domain/release.js";
import type { DestinationResult } from "../domain/result.js";
import type { Publisher } from "./publisher.js";
export interface S3Sender {
    send(command: PutObjectCommand): Promise<unknown>;
}
export declare class S3Publisher implements Publisher {
    private config;
    private client;
    constructor(config: S3Config, client?: S3Sender);
    publish(a: ReleaseArtifact): Promise<DestinationResult>;
}
