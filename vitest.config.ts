import { defineConfig } from "vitest/config"

// biome-ignore lint/style/noDefaultExport: config file.
export default defineConfig({
	test: {
		clearMocks: true,
		globalSetup: ["test/global-setup/database.ts"],
		setupFiles: ["test/setup-files/database.ts"],
		isolate: false,
		server: {
			deps: {
				inline: ["drizzle-kit/api"],
			},
		},
		typecheck: {
			enabled: true,
			// Required since Vite attempts to import `WebSocket` and `Workers`,
			// which aren't available in a Node.js environment.
			ignoreSourceErrors: true,
		},
		coverage: {
			// Leave disabled by default, will be enabled on-demand by the
			// test:coverage script.
			provider: "v8",
			all: true,
			reporter: ["json-summary", "json"],
			reportOnFailure: true,
		},
	},
})
