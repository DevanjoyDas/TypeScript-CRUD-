class ApiError extends Error {
    public success : boolean = false;
    constructor(public statusCode:number,
        public message = "Something Went Wrong"){
            super(message);
            this.statusCode = statusCode;
            this.message = message;
        }
}

export {ApiError};