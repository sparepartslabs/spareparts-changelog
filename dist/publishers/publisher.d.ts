import type { ReleaseArtifact } from "../domain/release.js";
import type { DestinationResult } from "../domain/result.js";
export interface Publisher {
    publish(artifact: ReleaseArtifact): Promise<DestinationResult>;
}
