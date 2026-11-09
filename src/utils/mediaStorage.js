// IndexedDB and Media Processing Storage Helper for Media CMS
const DB_NAME = 'bdhs_media_db';
const DB_VERSION = 2;
const STORE_NAME = 'videos';
const PHOTO_STORE_NAME = 'photos';

function openMediaDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(PHOTO_STORE_NAME)) {
        db.createObjectStore(PHOTO_STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function storeVideoFile(id, fileOrBlob) {
  try {
    const db = await openMediaDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({ id, data: fileOrBlob, timestamp: Date.now() });
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB storeVideoFile failed:', err);
    return false;
  }
}

export async function getVideoFile(id) {
  try {
    const db = await openMediaDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => {
        if (req.result && req.result.data) {
          resolve(req.result.data);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB getVideoFile failed:', err);
    return null;
  }
}

export async function deleteVideoFile(id) {
  try {
    const db = await openMediaDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return false;
  }
}

/**
 * Extracts automated thumbnail and duration from an uploaded video file
 */
export function extractVideoMeta(file) {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    const url = URL.createObjectURL(file);
    video.src = url;

    const timeout = setTimeout(() => {
      URL.revokeObjectURL(url);
      resolve({
        durationStr: '03:00',
        thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80'
      });
    }, 6000);

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1.0, video.duration > 2 ? 1.0 : (video.duration ? video.duration / 2 : 0.5));
    };

    video.onseeked = () => {
      clearTimeout(timeout);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 360;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, 640, 360);
        const thumb = canvas.toDataURL('image/jpeg', 0.85);

        const totalSecs = Math.floor(video.duration || 0);
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        const durationStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        URL.revokeObjectURL(url);
        resolve({ durationStr, thumbnail: thumb });
      } catch {
        URL.revokeObjectURL(url);
        resolve({
          durationStr: '03:00',
          thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80'
        });
      }
    };

    video.onerror = () => {
      clearTimeout(timeout);
      URL.revokeObjectURL(url);
      resolve({
        durationStr: '03:00',
        thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80'
      });
    };
  });
}

export async function storePhotoFile(id, dataUrlOrBlob) {
  try {
    const db = await openMediaDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(PHOTO_STORE_NAME, 'readwrite');
      const store = tx.objectStore(PHOTO_STORE_NAME);
      const req = store.put({ id, data: dataUrlOrBlob, timestamp: Date.now() });
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB storePhotoFile failed:', err);
    return false;
  }
}

export async function getPhotoFile(id) {
  try {
    const db = await openMediaDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(PHOTO_STORE_NAME, 'readonly');
      const store = tx.objectStore(PHOTO_STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result?.data || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB getPhotoFile failed:', err);
    return null;
  }
}

export async function deletePhotoFile(id) {
  try {
    const db = await openMediaDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(PHOTO_STORE_NAME, 'readwrite');
      const store = tx.objectStore(PHOTO_STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return false;
  }
}

/**
 * Crops any image to a centered square and resizes to targetSize x targetSize
 */
export function processSquarePhoto(file, targetSize = 400) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type?.startsWith('image/')) {
      return reject(new Error('অনুগ্রহ করে সঠিক ছবি ফাইল (JPG/PNG/WebP) নির্বাচন করুন।'));
    }
    if (file.size > 5 * 1024 * 1024) {
      return reject(new Error('ছবির আকার সর্বোচ্চ ৫ মেগাবাইট (5MB) হতে পারবে।'));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = targetSize;
          canvas.height = targetSize;
          const ctx = canvas.getContext('2d');

          const minSide = Math.min(img.width, img.height);
          const sx = (img.width - minSide) / 2;
          // Bias slightly towards upper-center (portrait framing) when image is tall
          const sy = img.height > img.width ? Math.min((img.height - minSide) * 0.25, (img.height - minSide) / 2) : (img.height - minSide) / 2;

          ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, targetSize, targetSize);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.84);
          resolve(dataUrl);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error('ছবিটি প্রসেস করা যায়নি।'));
      img.src = event.target?.result;
    };
    reader.onerror = () => reject(new Error('ফাইল পড়তে ব্যর্থ হয়েছে।'));
    reader.readAsDataURL(file);
  });
}

/**
 * Processes, center-crops to square, caches in mediaStorage IndexedDB, and returns compact DataURL
 */
export async function uploadMemberPhoto(id, file, targetSize = 400) {
  const dataUrl = await processSquarePhoto(file, targetSize);
  if (id) {
    await storePhotoFile(id, dataUrl);
  }
  return dataUrl;
}

