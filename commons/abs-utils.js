/* abs-utils - common utility functions without dependencies, shared by several scripts; version 1.1.0 */
(function (global) {
    'use strict';

    // --- from two locations (with x,y,z attributes) compute direction (o'clock) and elevation (degrees)
    global.absElevations = function (p1, p2) {

        function _rad2deg(angle) {
            return angle * 57.29577951308232; // angle / Math.PI * 180
        }

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dz = p2.z - p1.z;

        let horiz = '-'
        if (dx !== 0 || dy !== 0) {
            horiz = Math.round((_rad2deg(Math.atan2(-dy, dx)) - 90 + 180) / 360 * 12);
            if (horiz < 0) {
                horiz += 12;
            } else if (horiz < 1) {
                horiz = 12;
            }
        }

        let vert = 0;
        if (dz !== 0) {
            const dxy = Math.round(Math.sqrt(dx * dx + dy * dy));
            if (dxy === 0) {
                vert = dz > 0 ? 90 : -90;
            } else {
                vert = Math.round(_rad2deg(Math.atan2(dz, dxy)));
                if (vert < -90) {
                    vert = -180 - vert;
                } else if (vert > 90) {
                    vert = 180 - vert;
                }
            }
        }

        return [horiz, vert];
    }

    // --- compute distance in km
    global.absDistance = function (a, b) {
        const [dx, dy, dz] = [a.x - b.x, a.y - b.y, a.z - b.z];
        return Math.round(4000.0 * Math.sqrt(dx * dx + dy * dy + dz * dz));
    }

    // --- safely parse integer from string, ignore commas etc
    global.safeInteger = function (s) {
        return s ? parseInt(s.replace(/,/g, '')) || null : null;
    }

    // --- safely parse float from string, ignore commas etc
    global.safeFloat = function (s) {
        return s ? parseFloat(s.replace(/,/g, '')) || null : null;
    }

    // --- print number with commas
    global.numberWithCommas = function (x) {
        return x == null ? "" : x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    }

    // Format Date to string, for example "2025-02-28 20:41".
    global.formatDateTime = function (dt) {
        if (!(dt instanceof Date)) return "?";
        const year = dt.getFullYear();
        const month = String(dt.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(dt.getDate()).padStart(2, '0');
        const hours = String(dt.getHours()).padStart(2, '0');
        const minutes = String(dt.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    // Returns first word from a string, or null if !s.
    global.firstWordOf = function (s) {
        return s ? s.trim().split(/\s+/)[0] : null;
    }

    // Returns last word from a string, or null if !s.
    global.lastWordOf = function (s) {
        return s ? s.trim().split(/\s+/).pop() : null;
    }

    // Returns true if inputeDate (of type Date, or null) is older than nowDate (of type Date) by more than maxDifSeconds (in seconds).
    global.isOlderThan = function (inputDate, nowDate, maxDifSeconds) {
        if (!inputDate) return true; // date not set or unknown we want to by true/older
        const cutoff = new Date(nowDate - maxDifSeconds * 1000);
        return inputDate < cutoff;
    }

    // Simple assertion function, pretty generic; throws "Error" (with optional message) when "condition" is not true.
    global.assert = function (condition, message = 'Assertion failed') {
        if (!condition) throw new Error(message);
    }


})(typeof window !== 'undefined' ? window : this);
