window.dashPdfRendererComponentsFunctions = Object.assign(window.dashPdfRendererComponentsFunctions || {}, {
  gallery: {
    status: state => state.error ? `Error: ${state.error}` : state.loading ? "Generating…" : `Ready: ${state.size} bytes`,
  },
});
