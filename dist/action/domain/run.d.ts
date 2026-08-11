import type { ReleaseRequest } from "./release.js";
import type { RunResult } from "./result.js";
import { type S3Sender } from "../publishers/s3.js";
import { type Fetcher } from "../publishers/linkedin.js";
export interface RunDeps {
    root?: string;
    s3Client?: S3Sender;
    fetch?: Fetcher;
}
export declare function run(request: ReleaseRequest, deps?: RunDeps): Promise<RunResult>;
