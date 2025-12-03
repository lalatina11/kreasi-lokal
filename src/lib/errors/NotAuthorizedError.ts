class NotAuhorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotAuhorizedError";
  }
}

export default NotAuhorizedError;
