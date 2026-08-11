import type { ChangeEntry, SourceCommit } from "../domain/release.js";
export declare function categorize(commits: SourceCommit[]): {
    entries: ChangeEntry[];
    omitted: number;
};
