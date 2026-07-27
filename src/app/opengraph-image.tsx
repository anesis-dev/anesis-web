import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					padding: "80px",
					background: "linear-gradient(135deg, #09090b 0%, #18181b 100%)",
					color: "#fafafa",
					fontFamily: "sans-serif",
				}}
			>
				<div
					style={{
						fontSize: 88,
						fontWeight: 700,
						letterSpacing: "-0.03em",
						display: "flex",
					}}
				>
					Anesis
				</div>
				<div
					style={{
						marginTop: 24,
						fontSize: 36,
						lineHeight: 1.35,
						color: "#a1a1aa",
						maxWidth: 900,
						display: "flex",
					}}
				>
					Template-first project scaffolding — a CLI and registry for starters,
					addons, and stacks.
				</div>
				<div
					style={{
						marginTop: "auto",
						fontSize: 28,
						color: "#71717a",
						display: "flex",
					}}
				>
					{site.url.replace(/^https?:\/\//, "")}
				</div>
			</div>
		),
		size,
	);
}
