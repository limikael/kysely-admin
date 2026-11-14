export function normalizeTitle(str) {
    return str
        .replace(/[^\p{L}\p{N}]+/gu, ' ')
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export function objectWhereMatch(obj, where) {
    if (!where)
        where={};

    for (let key of Object.keys(where))
        if (obj[key]!==where[key])
            return false;

    return true;
}