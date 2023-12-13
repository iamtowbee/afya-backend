// apiError.js

class ApiError extends Error
{
  constructor(msg, statusCode = 500)
  {
    super(msg);
    // msg avoids overriding default err.message
    this.name = 'ApiError';
    this.msg = msg;
    this.statusCode = statusCode;
  }
}

module.exports = ApiError;