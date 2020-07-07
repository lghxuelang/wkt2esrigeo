import { jsapi } from '@/utils/arcgis';

const registerToken = async (portalUrl, username, password) => {
    const [ServerInfo, esriId] = await jsapi.load(['esri/identity/ServerInfo', 'esri/identity/IdentityManager']);
    const serverInfo = new ServerInfo();
    serverInfo.server = portalUrl;
    serverInfo.tokenServiceUrl = `${portalUrl}sharing/rest/generateToken`;

    esriId.registerServers([serverInfo]);

    esriId
        .generateToken(serverInfo, {
            username: username,
            password: password,
        })
        .then(tokenResp => {
            if (tokenResp) {
                esriId.registerToken({
                    token: tokenResp.token,
                    ssl: true,
                    server: portalUrl,
                    userId: 'portaladmin',
                    expires: tokenResp.expires,
                });
                sessionStorage.setItem('username', username);
                sessionStorage.setItem('token', tokenResp.token);
            }
        });

}
const identityUtils = {
    registerToken
};
export default identityUtils;