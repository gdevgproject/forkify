import { TIMEOUT_SEC } from '../config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok)
      throw new Error(
        `Failed to fetch: ${data.message} (${res.statusText}  ${res.status} 🧨)`
      );
    return data;
  } catch (err) {
    throw err;
  }
};
