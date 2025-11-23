import { minio } from "@/features/shared/minio";
import { createFileRoute } from "@tanstack/react-router";

// Helper function to convert stream to buffer
const streamToBuffer = (stream: NodeJS.ReadableStream): Promise<Buffer> => {
	return new Promise((resolve, reject) => {
		const chunks: Uint8Array[] = [];
		stream.on("data", (chunk) => chunks.push(chunk));
		stream.on("end", () => resolve(Buffer.concat(chunks)));
		stream.on("error", (err) => reject(err));
	});
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

					// Determine content type from file extension
					const ext = imagePath.split(".").pop()?.toLowerCase() || "";
					const contentType =
						ext === "jpg"
							? "image/jpeg"
							: ext === "png"
								? "image/png"
								: ext === "webp"
									? "image/webp"
									: ext === "svg"
										? "image/svg+xml"
										: "image/jpeg";

					// Convert Buffer to Uint8Array for Response
					return new Response(new Uint8Array(imageBuffer), {
						headers: {
							"Content-Type": contentType,
							"Cache-Control": "public, max-age=31536000, immutable",
						},
					});
				} catch (error) {
					// If not in MinIO, fetch from ddragon and cache it
					try {
						const thirdPartyImageUrl = `https://ddragon.leagueoflegends.com/${imagePath}`;
						const response = await fetch(thirdPartyImageUrl);

						if (!response.ok) {
							throw new Error("Network response was not ok");
						}

						const arrayBuffer = await response.arrayBuffer();
						const imageBuffer = Buffer.from(arrayBuffer);

						// Determine content type from file extension
						const ext = imagePath.split(".").pop()?.toLowerCase() || "";
						const contentType =
							ext === "jpg"
								? "image/jpeg"
								: ext === "png"
									? "image/png"
									: ext === "webp"
										? "image/webp"
										: ext === "svg"
											? "image/svg+xml"
											: "image/jpeg";

						// Store in MinIO for future requests (without optimization for now)
						await minio.putObject(
							bucketName,
							imagePath,
							imageBuffer,
							imageBuffer.length,
						);

						// Convert Buffer to Uint8Array for Response
						return new Response(new Uint8Array(imageBuffer), {
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
