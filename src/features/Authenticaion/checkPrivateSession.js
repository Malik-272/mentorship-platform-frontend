async function detectPrivateSession() {
  const ua = navigator.userAgent.toLowerCase();

  // Chrome / Edge
  if (navigator.storage && navigator.storage.estimate) {
    const { quota } = await navigator.storage.estimate();
    if (quota && quota < 120_000_000) return true;
  }

  // Firefox
  if (ua.includes('firefox')) {
    return await new Promise(resolve => {
      const db = indexedDB.open('test');
      db.onerror = () => resolve(true);
      db.onsuccess = () => resolve(false);
    });
  }

  // Safari
  try {
    localStorage.setItem('test', '1');
    localStorage.removeItem('test');
  } catch (e) {
    return true;
  }

  return false;
}

export default detectPrivateSession;