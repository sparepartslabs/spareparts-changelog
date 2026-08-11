import type { ReleaseArtifact } from "../domain/release.js";
export declare function updateChangelog(root: string, relative: string, a: ReleaseArtifact): Promise<boolean>;
