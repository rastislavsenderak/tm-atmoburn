/* tm-log - tiny persistent rotating logger for greasemonkey/tampermonkey scripts, version 1.0.2 */
(function (global) {
    'use strict';

    // ----- Config (can be changed later via TMLOG.setMaxBytes / setDateFormat)
    let LOG_KEY = 'tmlog.entries';      // array of strings
    let SIZE_KEY = 'tmlog.bytes';       // number
    let CAPTURE_KEY = 'tmlog.capture';  // boolean
    let MAX_BYTES = 100_000;            // rotate above this

    // ----- Storage adapter
    const hasGM = typeof GM_getValue === 'function' && typeof GM_setValue === 'function';

    const lsGet = (key, def) => {
        try {
            const v = localStorage.getItem(key);
            return v == null ? def : JSON.parse(v);
        } catch {
            return def;
        }
    };
    const lsSet = (key, val) => {
        try {
            localStorage.setItem(key, JSON.stringify(val));
        } catch {
        }
    };
    const gmGet = (key, def) => {
        try {
            return GM_getValue(key, def);
        } catch {
            return def;
        }
    };
    const gmSet = (key, val) => {
        try {
            GM_setValue(key, val);
        } catch {
        }
    };

    const store = hasGM ? {get: gmGet, set: gmSet} : {get: lsGet, set: lsSet};

    // ----- Byte length -----
    const te = (typeof TextEncoder !== 'undefined') ? new TextEncoder() : null;
    const byteLen = (s) => te ? te.encode(s).length : new Blob([s]).size;

    // ----- State helpers -----
    const loadState = () => ({
        entries: store.get(LOG_KEY, []),
        bytes: +store.get(SIZE_KEY, 0),
        capture: !!store.get(CAPTURE_KEY, true),
    });

    const saveState = (entries, bytes) => {
        store.set(LOG_KEY, entries);
        store.set(SIZE_KEY, bytes);
    };

    const rotateIfNeeded = (entries, bytes) => {
        if (bytes <= MAX_BYTES) return {entries, bytes};
        while (entries.length && bytes > MAX_BYTES) {
            const removed = entries.shift();
            bytes -= byteLen(removed);
        }
        return {entries, bytes};
    };

    const appendLine = (line) => {
        const st = loadState();
        const entries = st.entries;
        let bytes = st.bytes;

        const stripped = line ? line.trim() : '';
        bytes += byteLen(stripped);
        entries.push(stripped);

        const r = rotateIfNeeded(entries, bytes);
        saveState(r.entries, r.bytes);
    };

    // Core logger
    const logCore = (level, ...args) => {
        if (!loadState().capture) return;
        const msg = args.map(a => {
            if (typeof a === 'string') return a;
            if (a instanceof Error) return JSON.stringify({name: a.name, message: a.message, stack: a.stack});
            try {
                return JSON.stringify(a, Object.getOwnPropertyNames(a));
            } catch {
                return String(a);
            }
        }).join(' ');
        appendLine(`[${new Date().toISOString()}] [${String(level || 'L').toUpperCase()}] ${msg}`);
    };

    // ----- API (exposed)
    global.TMLOG = {
        log: (level, ...a) => logCore(level, ...a),
        info: (...a) => logCore('I', ...a),
        warn: (...a) => logCore('W', ...a),
        error: (...a) => logCore('E', ...a),
        debug: (...a) => logCore('D', ...a),
        clear: () => saveState([], 0),
        download: () => {
            const content = (loadState().entries || []).join('\n');
            const blob = new Blob([content], {type: 'text/plain'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const ts = new Date().toISOString().replace(/[:.]/g, '-');
            a.href = url;
            a.download = `tmlog-${location.hostname || 'page'}-${ts}.txt`;
            document.documentElement.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        },
        status: () => {
            const s = loadState();
            return {count: s.entries.length, bytes: s.bytes, maxBytes: MAX_BYTES, capture: s.capture, gm: hasGM};
        },
        setCapture: (on) => store.set(CAPTURE_KEY, !!on),
        isCapturing: () => !!loadState().capture,
        setMaxBytes: (n) => {
            MAX_BYTES = Math.max(10_000, +n || MAX_BYTES);
        },
        setKeyPrefix: (prefix) => { // Optional: change storage keys prefix if you want multiple independent logs
            if (!prefix) return;
            LOG_KEY = `${prefix}.entries`;
            SIZE_KEY = `${prefix}.bytes`;
            CAPTURE_KEY = `${prefix}.capture`;
        },
    };
})(typeof window !== 'undefined' ? window : this);
