window.dashPdfComponentsFunctions = Object.assign(window.dashPdfComponentsFunctions || {}, {
  gallery: {
    status: state => state.error ? `Error: ${state.error}` : state.loading ? "Generating…" : `Ready: ${state.size} bytes`,
  },
});
