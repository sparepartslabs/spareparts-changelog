export type Category = "breaking" | "added" | "fixed" | "improved" | "changed" | "removed" | "security";
export interface SourceCommit {
    hash: string;
    subject: string;
    body: string;
    position: number;
}
export interface ChangeEntry {
    sourceHash: string;
    category: Category;
    summary: string;
    scope?: string;
    breaking: boolean;
    userVisible: boolean;
    position: number;
}
export interface ReleaseArtifact {
    identity: string;
    entries: ChangeEntry[];
    omittedCount: number;
    markdown: string;
    contentDigest: string;
}
export interface S3Config {
    enabled: boolean;
    bucket?: string;
    key?: string;
    region?: string;
    endpoint?: string;
    forcePathStyle?: boolean;
}
export interface LinkedInConfig {
    enabled: boolean;
    author?: string;
    accessToken?: string;
}
export type AIVendor = "anthropic" | "openai" | "gemini";
export interface AIConfig {
    provider: string;
    instructions?: string;
    anthropicApiKey?: string;
    openaiApiKey?: string;
    geminiApiKey?: string;
}
export interface ReleaseRequest {
    from: string;
    to: string;
    identity: string;
    changelogPath: string;
    writeRepository: boolean;
    ai: AIConfig;
    s3: S3Config;
    linkedin: LinkedInConfig;
}
