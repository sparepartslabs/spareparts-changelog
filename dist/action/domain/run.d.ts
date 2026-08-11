import type { ReleaseRequest } from "./release.js";
import type { RunResult } from "./result.js";
import { type AIFetcher } from "../ai/generator.js";
import { type S3Sender } from "../publishers/s3.js";
import { type Fetcher } from "../publishers/linkedin.js";
export interface RunDeps {
    root?: string;
    s3Client?: S3Sender;
    fetch?: Fetcher;
    aiFetch?: AIFetcher;
}
export declare function run(request: ReleaseRequest, deps?: RunDeps): Promise<RunResult>;
