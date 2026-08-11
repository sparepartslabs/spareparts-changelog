import type { ReleaseArtifact } from "./release.js";
export type Destination = "repository" | "s3" | "linkedin";
export interface DestinationResult {
  destination: Destination;
  status: "skipped" | "unchanged" | "succeeded" | "failed";
  location?: string;
  errorCode?: string;
  message: string;
}
export interface RunResult {
  artifact: ReleaseArtifact;
  repositoryChanged: boolean;
  destinations: DestinationResult[];
  successful: boolean;
}
