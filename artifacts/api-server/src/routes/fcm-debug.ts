// FCM Debug Routes - لتسجيل الأخطاء من التطبيق
import { Router } from "express";

const router = Router();

// ─── تسجيل خطأ FCM من التطبيق ───────────────────────────────────────────
router.post("/log-error", async (req, res) => {
  const body = req.body as {
    error?: {
      message?: string;
      code?: string;
      name?: string;
      stack?: string;
    };
    context?: string;
    extraData?: Record<string, unknown>;
    deviceInfo?: {
      userAgent?: string;
      platform?: string;
      vendor?: string;
      isPWA?: boolean;
      language?: string;
    };
    appInfo?: {
      baseUrl?: string;
      timestamp?: number;
      date?: string;
    };
  };

  try {
    const { error, context, extraData, deviceInfo, appInfo } = body;

    console.log("");
    console.log("╔══════════════════════════════════════════════════════════════════════╗");
    console.log("║           📱 [FCM ERROR] خطأ FCM من التطبيق المحمول                ║");
    console.log("╠══════════════════════════════════════════════════════════════════════╣");
    console.log(`║ ⏰ الوقت: ${appInfo?.date || new Date().toISOString()}`);
    console.log(`║ 📍 السياق: ${context || 'غير محدد'}`);
    console.log("╠══════════════════════════════════════════════════════════════════════╣");
    console.log("║                         📋 معلومات الجهاز                             ║");
    console.log("╠══════════════════════════════════════════════════════════════════════╣");
    console.log(`║ 🔧 User Agent: ${(deviceInfo?.userAgent || 'غير معروف').substring(0, 50)}`);
    console.log(`║ 💻 Platform: ${deviceInfo?.platform || 'غير محدد'}`);
    console.log(`║ 🏪 Vendor: ${deviceInfo?.vendor || 'غير محدد'}`);
    console.log(`║ 📱 PWA Mode: ${deviceInfo?.isPWA ? 'نعم ✅' : 'لا ❌'}`);
    console.log(`║ 🌍 اللغة: ${deviceInfo?.language || 'غير محددة'}`);
    console.log("╠══════════════════════════════════════════════════════════════════════╣");
    console.log("║                          ❌ تفاصيل الخطأ                              ║");
    console.log("╠══════════════════════════════════════════════════════════════════════╣");
    console.log(`║ ❌ الكود: ${error?.code || 'غير محدد'}`);
    console.log(`║ 📛 الاسم: ${error?.name || 'غير محدد'}`);
    console.log(`║ 💬 الرسالة: ${(error?.message || 'غير محددة').substring(0, 60)}`);
    if (error?.stack) {
      console.log("╠══════════════════════════════════════════════════════════════════════╣");
      console.log("║ 📋 Stack Trace:");
      const stackLines = error.stack.split('\n');
      for (const line of stackLines.slice(0, 10)) { // Limit to 10 lines
        console.log(`║    ${line.trim().substring(0, 65)}`);
      }
    }
    if (extraData && Object.keys(extraData).length > 0) {
      console.log("╠══════════════════════════════════════════════════════════════════════╣");
      console.log("║ 📊 بيانات إضافية:");
      for (const [key, value] of Object.entries(extraData)) {
        const valueStr = String(value).substring(0, 60);
        console.log(`║    ${key}: ${valueStr}`);
      }
    }
    console.log("╚══════════════════════════════════════════════════════════════════════╝");
    console.log("");

    res.json({ success: true, logged: true });
  } catch (err) {
    console.error("[FCM DEBUG] Error logging failed:", err);
    res.status(500).json({ error: "فشل في تسجيل الخطأ" });
  }
});

// ─── اختبار الاتصال ───────────────────────────────────────────────────────
router.get("/test", (_req, res) => {
  res.json({ 
    success: true, 
    message: "FCM Debug API is working",
    timestamp: new Date().toISOString()
  });
});

export default router;
