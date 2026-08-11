import type { AIConfig, AIVendor, ChangeEntry, SourceCommit } from "../domain/release.js";
export type AIFetcher = typeof fetch;
export interface ProviderSelection {
    vendor: AIVendor;
    model: string;
    apiKey: string;
}
export declare function selectProvider(config: AIConfig): ProviderSelection;
export declare function buildPrompt(evidence: ChangeEntry[], commits: SourceCommit[], instructions?: string): string;
export declare function generateChanges(commits: SourceCommit[], config: AIConfig, request?: AIFetcher): Promise<{
    entries: ChangeEntry[];
    omitted: number;
}>;
