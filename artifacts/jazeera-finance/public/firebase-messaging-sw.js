// Firebase Messaging Service Worker
// Handles push notifications even when the browser is closed

importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

// Firebase configuration - same as frontend app
const firebaseConfig = {
  apiKey: "AIzaSyAd85bumxjsb9ldEdiJ2tUgCqrGytXWaHA",
  authDomain: "al-jazeera-finance.firebaseapp.com",
  projectId: "al-jazeera-finance",
  storageBucket: "al-jazeera-finance.firebasestorage.app",
  messagingSenderId: "376337241315",
  appId: "1:376337241315:web:113f322ca4f5bd806d21d6"
};

// Initialize Firebase in service worker
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// ─── Initialize Firebase Messaging ─────────────────────────────────────────
self.addEventListener("install", (event) => {
  console.log("[FCM SW] Installing Service Worker...");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[FCM SW] Activating Service Worker...");
  event.waitUntil(clients.claim());
});

// ─── Handle background messages ───────────────────────────────────────────
messaging.onBackgroundMessage((payload) => {
  console.log("[FCM SW] Background message received:", payload);

  const notificationTitle = payload.notification?.title || "إشعار جديد";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: payload.notification?.icon || "/icons/icon-192.png",
    badge: "/icons/badge-72.png",
    tag: payload.data?.eventType || "default",
    vibrate: [200, 100, 200],
    dir: "rtl",
    lang: "ar",
    renotify: true,
    requireInteraction: payload.data?.eventType === "otp",
    data: {
      url: payload.data?.url || "/admin/visitors",
      timestamp: Date.now(),
      ...payload.data,
    },
    actions: [
      { action: "open", title: "📱 فتح لوحة الإدارة" },
      { action: "dismiss", title: "❌ تجاهل" },
    ],
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// ─── Handle notification click ───────────────────────────────────────────
self.addEventListener("notificationclick", (event) => {
  console.log("[FCM SW] Notification clicked:", event);
  console.log("[FCM SW] Action:", event.action);

  event.notification.close();

  const targetUrl = event.notification.data?.url || "/admin/visitors";

  if (event.action === "dismiss") {
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // البحث عن نافذة مفتوحة للوحة الإدارة
      for (const client of clientList) {
        if (client.url.includes("/admin") && "focus" in client) {
          client.focus();
          client.navigate(targetUrl);
          return;
        }
      }
      // فتح نافذة جديدة
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// ─── Handle notification close ───────────────────────────────────────────
self.addEventListener("notificationclose", (event) => {
  console.log("[FCM SW] Notification closed:", event);
});
