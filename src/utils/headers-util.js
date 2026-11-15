
import { SignJWT, jwtVerify } from 'jose';

const encoder = new TextEncoder();

function getKey(secret) {
    if (!secret)
        throw new Error('A JWT secret or key is required');

    return typeof secret === 'string'
        ? encoder.encode(secret)
        : secret;
}


// ------------------------------------------------------------
// Cookies
// ------------------------------------------------------------

export function headersGetCookie(headers, name) {
    const cookie = headers.get('Cookie');

    if (!cookie)
        return null;

    for (const part of cookie.split(';')) {
        const index = part.indexOf('=');

        if (index === -1)
            continue;

        const key = part.slice(0, index).trim();

        if (key === name) {
            return {
                name,
                value: part.slice(index + 1).trim()
            };
        }
    }

    return null;
}


export function headersSetCookie(headers, name, options = {}) {
    const {
        value,
        httpOnly = false,
        secure = false,
        sameSite = 'Lax',
        path = '/',
        domain,
        maxAge,
        expires
    } = options;

    if (value === undefined)
        throw new Error('Cookie value is required');

    let cookie = `${name}=${value}`;

    if (path)
        cookie += `; Path=${path}`;

    if (domain)
        cookie += `; Domain=${domain}`;

    if (maxAge !== undefined)
        cookie += `; Max-Age=${maxAge}`;

    if (expires)
        cookie += `; Expires=${expires.toUTCString()}`;

    if (httpOnly)
        cookie += '; HttpOnly';

    if (secure)
        cookie += '; Secure';

    if (sameSite)
        cookie += `; SameSite=${sameSite}`;

    headers.append('Set-Cookie', cookie);

    return { name, value };
}


export function headersDeleteCookie(headers, name, options = {}) {
    return headersSetCookie(headers, name, {
        ...options,
        value: '',
        maxAge: 0,
        expires: new Date(0)
    });
}


// ------------------------------------------------------------
// JWT cookies
// ------------------------------------------------------------

export async function headersSetJwt(headers, name, options = {}) {
    let {
        value,
        secret,
        algorithm = 'HS256',
        expiresIn,
        issuer,
        audience,
        subject,
        ...cookieOptions
    } = options;

    if (!value || typeof value !== 'object' || Array.isArray(value))
        throw new Error('JWT value must be an object');

    if (!expiresIn)
        throw new Error('JWT expiresIn is required');

    const jwt = new SignJWT(value)
        .setProtectedHeader({ alg: algorithm });

    if (value.iat === undefined)
        jwt.setIssuedAt();

    if (value.exp === undefined) {
        if (typeof expiresIn=="number")
            expiresIn=expiresIn+"s";

        jwt.setExpirationTime(expiresIn);
    }

    if (issuer)
        jwt.setIssuer(issuer);

    if (audience)
        jwt.setAudience(audience);

    if (subject)
        jwt.setSubject(subject);

    const token = await jwt.sign(getKey(secret));

    return headersSetCookie(headers, name, {
        ...cookieOptions,
        value: token
    });
}


export async function headersGetJwt(headers, name, options = {}) {
    const {
        secret,
        algorithms = ['HS256'],
        issuer,
        audience
    } = options;

    const cookie = headersGetCookie(headers, name);

    if (!cookie)
        return null;

    try {
        const { payload } = await jwtVerify(
            cookie.value,
            getKey(secret),
            {
                algorithms,
                issuer,
                audience
            }
        );

        return {
            name,
            value: payload
        };
    }
    catch (e) {
        console.log(e);
        return null;
    }
}
