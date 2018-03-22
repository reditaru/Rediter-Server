import ServerError from './ServerError'

export function assertNotNull(obj, msg, status) {
    if (obj == null) {
        throw new ServerError(msg, status || ServerError.REQUEST_NULL_RESOURCE);
    }
}
export function assertNull(obj, msg, status) {
    if (obj != null) {
        throw new ServerError(msg, status || ServerError.OPRATION_ON_EXISTING_RESOURCE);
    }
}
export function assertEqual(source, target, msg, status) {
    if (source !== target) {
        throw new ServerError(msg, status || ServerError.OPRATION_ON_EXISTING_RESOURCE);
    }
}
export function assemblyResponseBody(obj) {
    return {
        success: true,
        code: 100,
        res: obj
    }
}
export function copyProperties(target, source, ...ignoreProperties) {
    Object.keys(source).forEach(value => {
        if (!ignoreProperties.includes(value)) {
            target[value] = source[value];
        }
    });
}
