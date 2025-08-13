// Mock per Next.js fonts
module.exports = {
  Inter: () => ({
    style: {
      fontFamily: 'Inter, sans-serif',
    },
    className: 'inter-font',
  }),
  Roboto: () => ({
    style: {
      fontFamily: 'Roboto, sans-serif',
    },
    className: 'roboto-font',
  }),
  // Font generici per testing
  default: () => ({
    style: {
      fontFamily: 'system-ui, sans-serif',
    },
    className: 'default-font',
  }),
};
