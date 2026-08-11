import type { SourceCommit } from "../domain/release.js";
export declare function readHistory(from: string, to: string, cwd?: string): Promise<SourceCommit[]>;
