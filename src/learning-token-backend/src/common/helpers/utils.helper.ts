// THE GLOBAL RETURNER
export const response = (statusCode: number, message: string, result?: any) => {
    return {
        statusCode: statusCode,
        message: message,
        result: result ?? null
    }
}
