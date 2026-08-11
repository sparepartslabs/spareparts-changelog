import type { ChangeEntry, ReleaseArtifact } from "../domain/release.js";
export declare function render(identity: string, entries: ChangeEntry[], omittedCount?: number): ReleaseArtifact;
