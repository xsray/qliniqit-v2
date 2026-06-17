import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ENV } from "./_core/env";

const s3 = new S3Client({
  region: ENV.AWS_REGION,
  credentials: {
    accessKeyId: ENV.AWS_ACCESS_KEY_ID,
    secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY,
  },
});

export async function storagePut(
  key: string,
  body: Buffer,
  contentType: string
): Promise<{ url: string; key: string }> {
  await s3.send(
    new PutObjectCommand({
      Bucket: ENV.AWS_S3_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  const url = `https://${ENV.AWS_S3_BUCKET}.s3.${ENV.AWS_REGION}.amazonaws.com/${key}`;
  return { url, key };
}

export async function storageDelete(key: string): Promise<void> {
  await s3.send(new DeleteObjectCommand({ Bucket: ENV.AWS_S3_BUCKET, Key: key }));
}

export async function storagePresignedUrl(key: string, expiresIn = 3600): Promise<string> {
  return getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: ENV.AWS_S3_BUCKET, Key: key }),
    { expiresIn }
  );
}
