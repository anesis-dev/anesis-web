"use client";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<html lang="en">
			<body className="antialiased">
				<main
					style={{
						minHeight: "100dvh",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						gap: "1rem",
						padding: "2rem 1.25rem",
						textAlign: "center",
						fontFamily:
							"ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
					}}
				>
					<h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
						Something went wrong
					</h1>
					<p style={{ fontSize: "0.875rem", opacity: 0.7, maxWidth: "34rem" }}>
						An unexpected error occurred while rendering this page. Try again,
						or reload if the problem persists.
					</p>
					{error.digest && (
						<p style={{ fontSize: "0.75rem", opacity: 0.5 }}>
							Reference: {error.digest}
						</p>
					)}
					<button
						type="button"
						onClick={reset}
						style={{
							borderRadius: "0.5rem",
							border: "1px solid currentColor",
							padding: "0.5rem 1rem",
							fontSize: "0.875rem",
							cursor: "pointer",
							background: "transparent",
							color: "inherit",
						}}
					>
						Try again
					</button>
				</main>
			</body>
		</html>
	);
}
