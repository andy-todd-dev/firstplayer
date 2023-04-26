const pwaManifest = {
  registerType: "autoUpdate",
  manifest: {
    name: "First Player",
    short_name: "First Player",
    description: "An app to pick a first player for a board game",
    start_url: ".",
    display: "standalone",
  },
  devOptions: {
    enabled: true,
  },
};

export default pwaManifest;
