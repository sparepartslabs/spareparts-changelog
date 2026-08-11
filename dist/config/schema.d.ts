import type { ReleaseRequest } from "../domain/release.js";
export declare function parseBoolean(value: string | undefined, fallback: boolean): boolean;
export declare function validateRequest(r: ReleaseRequest, root?: string): void;
