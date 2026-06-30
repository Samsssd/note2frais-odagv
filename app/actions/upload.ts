"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

/**
 * Upload a receipt photo to S3 and return its public CloudFront URL.
 * The object key is always prefixed with the app's storage folder.
 */
export async function uploadReceipt(
  file: File,
  filename: string,
): Promise<{ url: string | null; error: string | null }> {
  try {
    const region = process.env.AWS_REGION;
    const bucket = process.env.AWS_S3_BUCKET_NAME;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const prefix = process.env.APP_STORAGE_PREFIX;
    const cloudfrontDomain = process.env.AWS_CLOUDFRONT_DOMAIN;

    if (
      !region ||
      !bucket ||
      !accessKeyId ||
      !secretAccessKey ||
      !prefix ||
      !cloudfrontDomain
    ) {
      return { url: null, error: "Configuration de stockage manquante." };
    }

    const s3 = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });

    // Build a collision-safe key under the app storage prefix.
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const ext = safeName.split(".").pop() || "jpg";
    const base = safeName.replace(/\.[^.]+$/, "");
    const key = `${prefix}/${base}-${unique}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type || "image/jpeg",
      }),
    );

    const url = `https://${cloudfrontDomain}/${key}`;
    return { url, error: null };
  } catch (e) {
    return {
      url: null,
      error: e instanceof Error ? e.message : "Échec de l'envoi du fichier.",
    };
  }
}
