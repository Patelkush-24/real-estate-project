import api from "./api";

// Free hosting puts the backend to sleep. The first request after a pause can time out or
// fail on a phone, so we try again a few times instead of giving up and showing nothing.
export async function getWithRetry(url, config = {}, tries = 12, delayMs = 4000) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      return await api.get(url, { timeout: 20000, ...config });
    } catch (e) {
      last = e;
      const status = e.response?.status;
      if (status && status < 500) throw e;            // a real 4xx will not fix itself
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw last;
}
