// Like setTimeout, but when the page is hidden the callback is postponed until
// it becomes visible again. This avoids hammering the daemon from background tabs.
// Returns a function that cancels the scheduled call.
export const scheduleWhenVisible = (callback, delay) => {
  let cancelled = false;

  const handleVisibilityChange = () => {
    if (document.hidden) return;
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    run();
  };

  const run = () => {
    if (cancelled) return;
    if (document.hidden) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return;
    }
    callback();
  };

  const timeout = setTimeout(run, delay);

  return () => {
    cancelled = true;
    clearTimeout(timeout);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
};

// Cheap structural equality for plain JSON data coming from the RPC.
export const isSameData = (a, b) => JSON.stringify(a) === JSON.stringify(b);
