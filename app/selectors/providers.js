export default {
  getProviders: state => state.providers.list.list.features,
  getActiveProvider: state => state.providers.activeProvider,
  getParams: state => state.providers.query,
};
