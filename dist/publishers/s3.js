import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { sanitize } from "../config/secrets.js";
export class S3Publisher {
    config;
    client;
    constructor(config, client = new S3Client({ region: config.region, endpoint: config.endpoint, forcePathStyle: config.forcePathStyle })) {
        this.config = config;
        this.client = client;
    }
    async publish(a) { try {
        await this.client.send(new PutObjectCommand({ Bucket: this.config.bucket, Key: this.config.key, Body: Buffer.from(a.markdown), ContentType: "text/markdown; charset=utf-8" }));
        return { destination: "s3", status: "succeeded", location: `s3://${this.config.bucket}/${this.config.key}`, message: "Published" };
    }
    catch (e) {
        return { destination: "s3", status: "failed", errorCode: "remote", message: sanitize(e) };
    } }
}
