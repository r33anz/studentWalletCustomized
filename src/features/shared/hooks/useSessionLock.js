import { useState, useEffect, useCallback, useRef } from "react";

var LOCK_TIMEOUT_MS = 10 * 60 * 1000;
var ACTIVITY_EVENTS = ["mousedown", "keydown", "touchstart", "scroll"];

export function useSessionLock() {
  var [isLocked, setIsLocked] = useState(false);
  var timerRef = useRef(null);

  var resetTimer = useCallback(function () {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(function () {
      setIsLocked(true);
    }, LOCK_TIMEOUT_MS);
  }, []);

  var unlock = useCallback(function () {
    setIsLocked(false);
    resetTimer();
  }, [resetTimer]);

  useEffect(function () {
    resetTimer();

    var handleActivity = function () {
      if (!isLocked) resetTimer();
    };

    ACTIVITY_EVENTS.forEach(function (event) {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return function () {
      if (timerRef.current) clearTimeout(timerRef.current);
      ACTIVITY_EVENTS.forEach(function (event) {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [resetTimer, isLocked]);

  return { isLocked: isLocked, unlock: unlock };
}
