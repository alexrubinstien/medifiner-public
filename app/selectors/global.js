export default {
  getBasicInfo: state => state.global.basicInfo.data,
  findView: state => state.global.view,
  getProvider: state => state.global.provider,
  getFormStatus: state => state.global.updateForm,
  getMobileMap: state => state.global.showMobileMap,
  getSortOrder: state => state.global.sortOrder,
  getAlertBannerContent: state => state.global.alertBanner.content,
  getAlertBannerStatus: state => state.global.alertBanner.active,
};
