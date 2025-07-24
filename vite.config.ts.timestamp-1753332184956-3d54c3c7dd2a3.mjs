// vite.config.ts
import path from "path";
import { defineConfig, loadEnv } from "file:///app/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "/app";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    define: {
      "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, ".")
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvYXBwL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9hcHAvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG4gICAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCAnLicsICcnKTtcbiAgICByZXR1cm4ge1xuICAgICAgZGVmaW5lOiB7XG4gICAgICAgICdwcm9jZXNzLmVudi5BUElfS0VZJzogSlNPTi5zdHJpbmdpZnkoZW52LkdFTUlOSV9BUElfS0VZKSxcbiAgICAgICAgJ3Byb2Nlc3MuZW52LkdFTUlOSV9BUElfS0VZJzogSlNPTi5zdHJpbmdpZnkoZW52LkdFTUlOSV9BUElfS0VZKVxuICAgICAgfSxcbiAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgYWxpYXM6IHtcbiAgICAgICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuJyksXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThMLE9BQU8sVUFBVTtBQUMvTSxTQUFTLGNBQWMsZUFBZTtBQUR0QyxJQUFNLG1DQUFtQztBQUd6QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN0QyxRQUFNLE1BQU0sUUFBUSxNQUFNLEtBQUssRUFBRTtBQUNqQyxTQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsTUFDTix1QkFBdUIsS0FBSyxVQUFVLElBQUksY0FBYztBQUFBLE1BQ3hELDhCQUE4QixLQUFLLFVBQVUsSUFBSSxjQUFjO0FBQUEsSUFDakU7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLEdBQUc7QUFBQSxNQUNsQztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
