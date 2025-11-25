import { createFileRoute } from "@tanstack/react-router";
import sharp from "sharp";
import { minio } from "@/server/lib/minio";

// Helper function to convert stream to buffer
const streamToBuffer = (stream: NodeJS.ReadableStream): Promise<Buffer> => {
	return new Promise((resolve, reject) => {
		const chunks: Uint8Array[] = [];
		stream.on("data", (chunk) => chunks.push(chunk));
		stream.on("end", () => resolve(Buffer.concat(chunks)));
		stream.on("error", (err) => reject(err));
	});
};

// Helper function to convert PNG images to WebP for optimization
const convertPngToWebp = async (
	buffer: Buffer,
): Promise<{ buffer: Buffer; isConverted: boolean }> => {
	try {
		// Check if the buffer is a PNG by using sharp metadata
		const metadata = await sharp(buffer).metadata();
		if (metadata.format === "png") {
			const webpBuffer = await sharp(buffer).webp({ quality: 85 }).toBuffer();
			return { buffer: webpBuffer, isConverted: true };
		}
		return { buffer, isConverted: false };
	} catch (error) {
		console.error("Error converting image to WebP:", error);
		// Return original buffer on error
		return { buffer, isConverted: false };
	}
};

// Helper function to get content type from extension
const getContentType = (ext: string): string =>
	ext === "jpg"
		? "image/jpeg"
		: ext === "png"
			? "image/png"
			: ext === "webp"
				? "image/webp"
				: ext === "svg"
					? "image/svg+xml"
					: "image/jpeg";

// Helper function to process and store image
const processAndStoreImage = async (
	imagePath: string,
	buffer: Buffer,
	bucketName: string,
) => {
	const { buffer: processedBuffer, isConverted } =
		await convertPngToWebp(buffer);
	const ext = imagePath.split(".").pop()?.toLowerCase() || "";
	let contentType = getContentType(ext);

	if (isConverted) {
		contentType = "image/webp";
		// Store optimized version
		await minio.putObject(
			bucketName,
			imagePath,
			processedBuffer,
			processedBuffer.length,
		);
		return { buffer: processedBuffer, contentType };
	}

	return { buffer, contentType };
};

export const Route = createFileRoute("/api/images/$")({
	server: {
		handlers: {
			GET: async ({ request, params }) => {
				// Get the wildcard path from the URL
				const url = new URL(request.url);
				const imagePath = url.pathname.replace("/api/images/", "");
				const bucketName = "images";

				if (!imagePath) {
					return new Response("Image path is required", { status: 400 });
				}

				try {
					// Try to get image from MinIO
					const objectStream = await minio.getObject(bucketName, imagePath);
					const imageBuffer = await streamToBuffer(objectStream);

					// Serve cached image with appropriate content type
					const ext = imagePath.split(".").pop()?.toLowerCase() || "";
					const contentType = getContentType(ext);

					return new Response(new Uint8Array(imageBuffer), {
						headers: {
							"Content-Type": contentType,
							"Cache-Control": "public, max-age=31536000, immutable",
						},
					});
				} catch (_error) {
					// If not in MinIO, fetch from ddragon and cache it
					try {
						// Translate .webp requests to .png for Riot's Data Dragon API
						let riotPath = imagePath;
						if (riotPath.endsWith(".webp")) {
							riotPath = riotPath.slice(0, -5) + ".png";
						}
						const thirdPartyImageUrl = `https://ddragon.leagueoflegends.com/${riotPath}`;
						const response = await fetch(thirdPartyImageUrl);

						if (!response.ok) {
							throw new Error("Network response was not ok");
						}

						const arrayBuffer = await response.arrayBuffer();
						const imageBuffer = Buffer.from(new Uint8Array(arrayBuffer));

						// Process, convert if needed, and store in MinIO
						const { buffer, contentType } = await processAndStoreImage(
							imagePath,
							imageBuffer,
							bucketName,
						);

						return new Response(new Uint8Array(buffer), {
							headers: {
								"Content-Type": contentType,
								"Cache-Control": "public, max-age=31536000, immutable",
							},
						});
					} catch (fetchError) {
						console.error("Error fetching image:", fetchError);
						return new Response("Image not found", { status: 404 });
					}
				}
			},
		},
	},
});
