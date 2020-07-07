import _ from 'lodash';

export default class Task {
    constructor(opts) {
        const  { url, requestOptions } = opts;
        if ( url && _.isString(url)) {
            this.url = url;
        }

        if (requestOptions ) {
            this.requestOptions = requestOptions;
        }

        this.normalization = true;
        this._errorHandler = this._errorHandler.bind(this);
    }

    _uesSSL() {
        const reg = /^http:/i;
        if (this.url) {
            this.url = this.url.replace(reg, 'https:');
        }
    }

    _encode() {
        
    }

    _successHandler() {

    }

    _errorHandler(error) {
        this.onError(error);
    }
    
    setNormalization(val) { this.normalization = val }
    onError() {}
}