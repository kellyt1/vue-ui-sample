const LocalStorageService = ( function() {
    
    var _service;
    
    function _getService() {
        if(!_service) {
          _service = this;
          return _service
      }
      return _service
    }

    function _setAuthTokens(keycloak) {
      localStorage.setItem('access_token', keycloak.token);
      localStorage.setItem('refresh_token', keycloak.refreshToken);
    }

    function _getAccessToken() {
      return localStorage.getItem('access_token');
    }

    function _getRefreshToken() {
    return localStorage.getItem('refresh_token');
    }

    function _setLoginUrl(url) {
      localStorage.setItem('login_url', url);
    }

    function _getLoginUrl() {
      return localStorage.getItem('login_url');
    }

    function _clearAuthTokens() {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }

    function _setApplicationDraft(app) {
        localStorage.setItem('draft_app', app);
    }

    function _getApplicationDraft() {
        return localStorage.getItem('draft_app');
    }

    function _clearApplicationDraft() {
        localStorage.removeItem('draft_app');
    }

   return {
      getService : _getService,
      setAuthTokens : _setAuthTokens,
      getAccessToken : _getAccessToken,
      getRefreshToken : _getRefreshToken,
      clearAuthTokens : _clearAuthTokens,
      setLoginUrl: _setLoginUrl,
      getLoginUrl: _getLoginUrl,
      setApplicationDraft: _setApplicationDraft,
      getApplicationDraft: _getApplicationDraft,
      clearApplicationDraft: _clearApplicationDraft
    }


   })();
   
   export default LocalStorageService;