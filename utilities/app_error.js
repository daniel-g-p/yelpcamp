class AppError extends Error {
    constructor(message, status, url) {
        super();
        this.message = message;
        this.status = status;
        this.url = url;
    }
}

module.exports = AppError;