import React from "react";
import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
	cleanup();
	localStorage.clear();
	vi.clearAllMocks();
	vi.restoreAllMocks();
});

vi.mock("next/link", () => ({
	default: ({
		href,
		children,
		...props
	}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
		href: unknown;
		children: React.ReactNode;
	}) => {
		const resolvedHref =
			typeof href === "string"
				? href
				: typeof href === "object" &&
					  href !== null &&
					  "pathname" in href &&
					  typeof href.pathname === "string"
					? href.pathname
					: "";
		return (
			<a href={resolvedHref} {...props}>
				{children}
			</a>
		);
	},
}));

vi.mock("next/image", () => ({
	default: ({
		alt,
		src,
		...props
	}: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) => (
		<img alt={alt} src={src} {...props} />
	),
}));

Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

function createStorageMock() {
	let store: Record<string, string> = {};

	return {
		getItem: vi.fn((key: string) => (key in store ? store[key] : null)),
		setItem: vi.fn((key: string, value: string) => {
			store[key] = String(value);
		}),
		removeItem: vi.fn((key: string) => {
			delete store[key];
		}),
		clear: vi.fn(() => {
			store = {};
		}),
		key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
		get length() {
			return Object.keys(store).length;
		},
	};
}

Object.defineProperty(globalThis, "localStorage", {
	configurable: true,
	value: createStorageMock(),
});

Object.defineProperty(navigator, "clipboard", {
	configurable: true,
	writable: true,
	value: {
		writeText: vi.fn(),
	},
});

class ResizeObserverMock {
	observe() {}
	unobserve() {}
	disconnect() {}
}

Object.defineProperty(globalThis, "ResizeObserver", {
	writable: true,
	value: ResizeObserverMock,
});

Object.defineProperty(globalThis, "PointerEvent", {
	writable: true,
	value: MouseEvent,
});

window.HTMLElement.prototype.scrollIntoView = vi.fn();
