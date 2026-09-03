/* Visual direction: مختبر الجذور الحية — interactions are calm, precise, friendly, and use only composited motion. */
const $ = window.jQuery;

const copy = {
  ar: {
    academy: "ACADEMY", home: "الرئيسية", paths: "المسارات التعليمية", plans: "أنظمة الدراسة", why: "لماذا Code Root؟", gallery: "الشهادات والمواد", how: "كيف نبدأ؟", faq: "الأسئلة الشائعة",
    headerCta: "احجز جلسة مجانية", eyebrow: "ابدأ رحلة طفلك مع Code Root Academy", heroFocus: "تعليم تقني يبدأ بفهم الطفل",
    heroTitle: "لكل طفل بداية مختلفة.<br /><em>ونبني له المسار المناسب.</em>",
    heroDescription: "في Code Root، مش بنبدأ بكورس... بنبدأ بتحديد مستوى طفلك، وبعدها بنبني له مساره التعليمي خطوة بخطوة.",
    primaryCta: "احجز جلسة تجريبية مجانية", secondaryCta: "اكتشف المسارات التعليمية", trust: "تعليم عملي <i></i> مسارات متدرجة <i></i> متابعة مستمرة",
    toast: "سيُتاح هذا الجزء مع المرحلة التالية."
  },
  en: {
    academy: "ACADEMY", home: "Home", paths: "Learning Paths", plans: "Study plans", why: "Why Code Root?", gallery: "Certificates & materials", how: "How We Start", faq: "FAQ",
    headerCta: "Book a free session", eyebrow: "Start with Code Root Academy", heroFocus: "Technology learning starts by understanding your child",
    heroTitle: "Every child starts differently.<br /><em>We build the right path.</em>",
    heroDescription: "At Code Root, we do not begin with a course. We assess your child first, then build a practical learning path step by step.",
    primaryCta: "Book a free trial session", secondaryCta: "Explore learning paths", trust: "Practical learning <i></i> Guided pathways <i></i> Continuous support",
    toast: "This section will be available in the next phase."
  }
};

let currentLanguage = document.documentElement.dataset.pageLanguage === "en" ? "en" : "ar";
let toastTimer;

function showToast(message) {
  $("#toastText").html(message);
  $("#toast").addClass("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => $("#toast").removeClass("is-visible"), 2600);
}

function closeMenu() {
  $("#menuToggle").removeClass("is-open").attr("aria-expanded", "false");
  $("#mobileMenu").removeClass("is-open").attr("aria-hidden", "true");
}

function applyLanguage() {
  const lang = copy[currentLanguage];
  const isArabic = currentLanguage === "ar";
  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = isArabic ? "rtl" : "ltr";
  document.title = isArabic ? "Code Root Academy | نبدأ من الجذر" : "Code Root Academy | Start from the root";
  $("[data-i18n]").each(function () { $(this).text(lang[$(this).data("i18n")]); });
  $("[data-i18n-html]").each(function () { $(this).html(lang[$(this).data("i18n-html")]); });
  $("#languageLabel").text(isArabic ? "EN" : "ع");
  $("#languageToggle").attr("aria-label", isArabic ? "Switch to English" : "التبديل إلى العربية");
  $("#menuToggle").attr("aria-label", isArabic ? "فتح القائمة" : "Open menu");
}

function setHeaderState() {
  $("#siteHeader").toggleClass("is-scrolled", window.scrollY > 14);
}

function setLanguageCounterpartLink() {
  const fileName = window.location.pathname.split("/").pop() || "";
  const counterparts = {
    "index.ar.html": "../en/index.en.html",
    "how.ar.html": "../en/how.en.html",
    "paths.ar.html": "../en/paths.en.html",
    "plans.ar.html": "../en/plans.en.html",
    "why.ar.html": "../en/why.en.html",
    "faq.ar.html": "../en/faq.en.html",
    "booking.ar.html": "../en/booking.en.html",
    "gallery.ar.html": "../en/gallery.en.html",
    "index.en.html": "../ar/index.ar.html",
    "how.en.html": "../ar/how.ar.html",
    "paths.en.html": "../ar/paths.ar.html",
    "plans.en.html": "../ar/plans.ar.html",
    "why.en.html": "../ar/why.ar.html",
    "faq.en.html": "../ar/faq.ar.html",
    "booking.en.html": "../ar/booking.ar.html",
    "gallery.en.html": "../ar/gallery.ar.html"
  };
  const target = counterparts[fileName];
  if (target) $("#languageToggle").attr("href", target);
}

function syncThemeAcrossLinks(mode) {
  const theme = mode === "dark" ? "dark" : "light";
  const currentUrl = new URL(window.location.href);
  document.querySelectorAll("a[href]").forEach(function (link) {
    const rawHref = link.getAttribute("href") || "";
    if (!rawHref || rawHref.startsWith("#") || /^(mailto:|tel:|javascript:)/i.test(rawHref)) return;
    try {
      const targetUrl = new URL(rawHref, window.location.href);
      const sameOrigin = targetUrl.protocol === currentUrl.protocol && (targetUrl.protocol === "file:" || targetUrl.origin === currentUrl.origin);
      if (!sameOrigin) return;
      targetUrl.searchParams.set("theme", theme);
      link.setAttribute("href", targetUrl.href);
    } catch (_) {}
  });
}

function setTheme(mode, persist = true) {
  const dark = mode === "dark";
  const body = document.body;
  const toggle = document.getElementById("themeToggle");
  body.classList.toggle("is-dark", dark);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  if (toggle) {
    toggle.setAttribute("aria-pressed", String(dark));
    const label = currentLanguage === "ar"
      ? (dark ? "تفعيل الوضع الأبيض" : "تفعيل الوضع الداكن")
      : (dark ? "Enable white mode" : "Enable dark mode");
    toggle.setAttribute("aria-label", label);
  }
  if (persist) {
    try { window.localStorage.setItem("coderoot-theme", dark ? "dark" : "light"); } catch (_) {}
  }
  syncThemeAcrossLinks(dark ? "dark" : "light");
}

function initializeTheme() {
  let mode = "light";
  try { mode = window.localStorage.getItem("coderoot-theme") || "light"; } catch (_) {}
  const requestedMode = new URLSearchParams(window.location.search).get("theme");
  if (requestedMode === "dark" || requestedMode === "light") mode = requestedMode;
  setTheme(mode);

  const toggle = document.getElementById("themeToggle");
  if (!toggle || toggle.dataset.themeBound === "true") return;
  toggle.dataset.themeBound = "true";
  toggle.addEventListener("click", function (event) {
    event.preventDefault();
    setTheme(document.body.classList.contains("is-dark") ? "light" : "dark");
  });
}

function initializeBackToTop() {
  $(".back-to-top").on("click", function (event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initializeCanvas() {
  const canvas = document.getElementById("circuitCanvas");
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  function draw() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const isMobile = width < 860;
    const rootX = isMobile ? width * .08 : width * .12;
    const rootY = isMobile ? height * .61 : height * .69;
    const paths = [
      [[rootX, rootY], [rootX + 58, rootY - 35], [rootX + 112, rootY - 35], [rootX + 138, rootY - 66]],
      [[rootX + 18, rootY + 25], [rootX + 72, rootY + 25], [rootX + 101, rootY + 49], [rootX + 156, rootY + 49]],
      [[rootX + 83, rootY + 96], [rootX + 83, rootY + 52], [rootX + 126, rootY + 13], [rootX + 190, rootY + 13]]
    ];
    ctx.lineWidth = 1.15;
    ctx.lineCap = "round";
    paths.forEach((points, index) => {
      ctx.beginPath();
      points.forEach(([x, y], pointIndex) => pointIndex === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
      ctx.strokeStyle = index === 1 ? "rgba(19, 140, 40, .20)" : "rgba(9, 75, 219, .16)";
      ctx.stroke();
      points.slice(1).forEach(([x, y], dotIndex) => {
        ctx.beginPath();
        ctx.arc(x, y, dotIndex === points.length - 2 ? 3.3 : 2.1, 0, Math.PI * 2);
        ctx.fillStyle = index === 1 ? "rgba(19, 140, 40, .62)" : "rgba(9, 75, 219, .46)";
        ctx.fill();
      });
    });
  }
  const onResize = () => window.requestAnimationFrame(draw);
  window.addEventListener("resize", onResize, { passive: true });
  draw();
}

function getAssistantReply(input) {
  const query = String(input || "").toLocaleLowerCase();
  const isArabic = currentLanguage === "ar";
  const contains = (terms) => terms.some((term) => query.includes(term));
  const whatsappUrl = "https://wa.me/201553588585";

  if (contains(isArabic ? ["سعر", "الاسعار", "الأسعار", "1200", "400", "فردي", "مجموعات", "اشتراك"] : ["price", "prices", "cost", "individual", "group", "400", "1200", "fee"])) {
    return { text: isArabic ? "لدينا نظام فردي بـ 1200 جنيه شهريًا، ونظام مجموعات صغيرة من 5 طلاب بـ 400 جنيه شهريًا للطالب. الجلسة ساعتان أسبوعيًا، بواقع 4 جلسات شهريًا." : "We offer an individual system for EGP 1,200 per month and small groups of 5 students for EGP 400 per student per month. Sessions are two hours weekly, four times per month." };
  }
  if (contains(isArabic ? ["مسار", "المسارات", "المبرمج", "python", "سكراتش", "scratch"] : ["path", "paths", "programmer", "python", "scratch", "course"])) {
    return { text: isArabic ? "لدينا ثلاثة مسارات: المبرمج الصغير للمبتدئين، المبرمج المتقدم لتطوير الويب، والمبرمج المحترف الذي يتضمن Python. داخل كل مسار يتعلم الطفل التفكير والبرمجة والذكاء الاصطناعي والإلكترونيات والتصميم معًا." : "There are three paths: Little Programmer for beginners, Advanced Programmer for web development, and Professional Programmer with Python. Every path connects thinking, coding, AI, electronics, and design." };
  }
  if (contains(isArabic ? ["حجز", "احجز", "جلسة", "تجريب", "تجربة"] : ["book", "booking", "trial", "session", "appointment"])) {
    return { text: isArabic ? "الجلسة التجريبية مجانية عبر Google Meet. املأ نموذج الحجز، وبعد التحقق سيفتح واتساب برسالة جاهزة ببيانات الطفل لتأكيد الحجز مع الأكاديمية." : "The trial session is free and held on Google Meet. Complete the booking form; after validation, WhatsApp opens with a prepared message to confirm the booking with the academy." };
  }
  if (contains(isArabic ? ["عمر", "سن", "5", "21"] : ["age", "ages", "old"])) {
    return { text: isArabic ? "المسارات تُرشح بعد الجلسة بحسب العمر والخبرة. أما جروب واتساب التعليمي المجاني فهو مناسب للأطفال والشباب من 5 إلى 21 سنة." : "Learning paths are recommended after the session based on age and experience. The free educational WhatsApp group is for children and young people ages 5–21." };
  }
  if (contains(isArabic ? ["اونلاين", "أونلاين", "meet", "جوجل", "google", "لابتوب", "انترنت", "إنترنت"] : ["online", "meet", "google", "laptop", "internet"])) {
    return { text: isArabic ? "كل الكورسات أونلاين بالكامل. الجلسات مباشرة وعملية عبر Google Meet، ويحتاج الطفل إلى لابتوب وإنترنت." : "All courses are fully online. Sessions are live and practical on Google Meet, and your child needs a laptop and internet connection." };
  }
  if (contains(isArabic ? ["جروب", "مجاني", "واتساب", "مشاركة المعرفة"] : ["group", "free", "whatsapp", "knowledge sharing"])) {
    return { text: isArabic ? "جروب واتساب التعليمي مجاني بالكامل، ويشارك منحًا وكورسات ومحتوى برمجة وAI وأدوات مفيدة ومسابقات. يناسب الأعمار من 5 إلى 21 سنة." : "The educational WhatsApp group is completely free. It shares grants, courses, programming and AI content, useful tools, and competitions for ages 5–21." };
  }
  if (contains(isArabic ? ["تواصل", "رقم", "فيسبوك", "يوتيوب", "ايميل", "إيميل"] : ["contact", "phone", "email", "facebook", "youtube"])) {
    return { text: isArabic ? "يمكنك التواصل على واتساب أو الرقم 01553588585، أو البريد CodeRootKids@gmail.com. ستجد أيضًا Facebook وYouTube في التذييل." : "You can contact us on WhatsApp or 01553588585, or email CodeRootKids@gmail.com. Facebook and YouTube are available in the footer." };
  }
  return {
    text: isArabic ? "أقدر أساعدك في المسارات، الأسعار، الحجز، الدراسة الأونلاين، أو الجروب المجاني. لو سؤالك خاص بطفلك، أرسله للأكاديمية على واتساب." : "I can help with learning paths, prices, booking, online learning, or the free group. For a question specific to your child, send it to the academy on WhatsApp.",
    action: { href: whatsappUrl, label: isArabic ? "تواصل عبر واتساب ↗" : "Chat on WhatsApp ↗" }
  };
}

function initializeAssistant() {
  const $widget = $("#assistantWidget");
  if (!$widget.length) return;
  const $panel = $("#assistantPanel");
  const $launcher = $("#assistantLauncher");
  const $messages = $("#assistantMessages");
  const $input = $("#assistantInput");

  function setOpen(open) {
    $widget.toggleClass("is-open", open);
    $panel.attr("aria-hidden", String(!open));
    $launcher.attr("aria-expanded", String(open));
    if (open) window.setTimeout(() => $input.trigger("focus"), 120);
  }
  function appendMessage(text, type, action) {
    const $message = $("<div>", { class: `assistant-message ${type === "user" ? "assistant-user" : "assistant-bot"}` });
    $("<p>").text(text).appendTo($message);
    if (action) $("<a>", { href: action.href, target: "_blank", rel: "noopener noreferrer", text: action.label }).appendTo($message);
    $messages.append($message);
    $messages.scrollTop($messages[0].scrollHeight);
  }
  function answer(question) {
    const text = String(question || "").trim();
    if (!text) return;
    appendMessage(text, "user");
    const reply = getAssistantReply(text);
    window.setTimeout(() => appendMessage(reply.text, "bot", reply.action), 180);
  }
  $launcher.on("click", () => setOpen(!$widget.hasClass("is-open")));
  $("#assistantClose").on("click", () => setOpen(false));
  $("#assistantForm").on("submit", function (event) { event.preventDefault(); const value = $input.val(); $input.val(""); answer(value); });
  $(document).on("click", "[data-assistant-prompt]", function () { setOpen(true); answer($(this).data("assistant-prompt")); });
  $(document).on("keydown", function (event) { if (event.key === "Escape" && $widget.hasClass("is-open")) setOpen(false); });
}

function initializeGallery() {
  const gallery = window.CODE_ROOT_GALLERY || { certifications: [], materials: [] };
  const isArabic = currentLanguage === "ar";
  const labels = {
    certifications: isArabic ? "شهادات وإنجازات Code Root" : "Code Root certificates and achievements",
    materials: isArabic ? "أمثلة للمواد التعليمية" : "Learning material example",
    emptyCertificates: isArabic ? "أضف أول صورة شهادة إلى مجلد certifications images لتظهر هنا." : "Add the first certificate image to certifications images and it will appear here.",
    emptyMaterials: isArabic ? "أضف أول صورة مادة إلى مجلد materials images لتظهر هنا." : "Add the first material image to materials images and it will appear here."
  };
  function formatName(name) {
    return String(name || "").replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  }
  function render(targetId, items, emptyText, fallbackAlt) {
    const $target = $(`#${targetId}`);
    if (!$target.length) return;
    $target.empty();
    if (!Array.isArray(items) || !items.length) {
      $("<div>", { class: "gallery-empty" }).append($("<span>").text("⌁"), $("<p>").text(emptyText)).appendTo($target);
      return;
    }
    items.forEach((item) => {
      const title = formatName(item.name) || fallbackAlt;
      const $card = $("<figure>", { class: "gallery-card" });
      $("<img>", { src: item.path, alt: title, loading: "lazy" }).appendTo($card);
      $("<figcaption>").text(title).appendTo($card);
      $card.appendTo($target);
    });
  }
  render("certificationGallery", gallery.certifications, labels.emptyCertificates, labels.certifications);
  render("materialsGallery", gallery.materials, labels.emptyMaterials, labels.materials);
}

$(function () {
  applyLanguage();
  setLanguageCounterpartLink();
  initializeTheme();
  initializeBackToTop();
  initializeAssistant();
  initializeGallery();
  initializeCanvas();
  setHeaderState();
  $(window).on("scroll", setHeaderState);
  $("#menuToggle").on("click", function () {
    const shouldOpen = !$(this).hasClass("is-open");
    $(this).toggleClass("is-open", shouldOpen).attr("aria-expanded", String(shouldOpen));
    $("#mobileMenu").toggleClass("is-open", shouldOpen).attr("aria-hidden", String(!shouldOpen));
  });
  $("[data-mobile-link]").on("click", closeMenu);
  $(document).on("click", "[data-action='coming']", function (event) {
    event.preventDefault();
    closeMenu();
    showToast(copy[currentLanguage].toast);
  });
  $("#bookingForm").on("submit", function (event) {
    event.preventDefault();
    const $form = $(this);
    let isValid = true;
    $form.find("[required]").each(function () {
      const $field = $(this);
      const hasValue = String($field.val() || "").trim().length > 0;
      $field.toggleClass("is-invalid", !hasValue);
      if (!hasValue) isValid = false;
    });
    if (!isValid) {
      const $firstInvalid = $form.find(".is-invalid").first();
      $firstInvalid.trigger("focus");
      return;
    }
    const labels = currentLanguage === "ar"
      ? { childName: "اسم الطفل", age: "عمر الطفل", childEmail: "البريد الإلكتروني", programmingLevel: "مستوى البرمجة", whatsapp: "رقم الواتساب", studySystem: "نظام الاشتراك" }
      : { childName: "Child’s name", age: "Child’s age", childEmail: "Email", programmingLevel: "Programming level", whatsapp: "WhatsApp", studySystem: "Study system" };
    const summary = Object.entries(labels).map(([name, label]) => {
      const value = String($form.find(`[name="${name}"]`).val() || "").trim();
      return `<div><dt>${label}</dt><dd>${$("<span>").text(value).html()}</dd></div>`;
    }).join("");
    $("#bookingSummary").html(summary);
    $("#bookingSuccess").addClass("is-visible");
    const messageTitle = currentLanguage === "ar" ? "طلب حجز جلسة مجانية - Code Root Academy" : "Free session booking request - Code Root Academy";
    const whatsappMessage = `${messageTitle}\n\n${Object.entries(labels).map(([name, label]) => `${label}: ${String($form.find(`[name="${name}"]`).val() || "").trim()}`).join("\n")}`;
    window.open(`https://wa.me/201553588585?text=${encodeURIComponent(whatsappMessage)}`, "_blank", "noopener");
  });
  $("#bookingForm input, #bookingForm select").on("input change", function () {
    $(this).removeClass("is-invalid");
    $("#bookingSuccess").removeClass("is-visible");
  });
  $(".faq-question").on("click", function () {
    const $item = $(this).closest(".faq-item");
    const shouldOpen = !$item.hasClass("is-open");
    $(".faq-item").removeClass("is-open").find(".faq-question").attr("aria-expanded", "false");
    if (shouldOpen) {
      $item.addClass("is-open");
      $(this).attr("aria-expanded", "true");
    }
  });
  $(document).on("click", "[data-group-share]", function () {
    const groupUrl = "https://chat.whatsapp.com/LXXaWR4Ib3V03b0ko9ZIo5";
    const groupText = currentLanguage === "ar"
      ? "انضموا إلى جروب واتساب التعليمي المجاني من أكاديمية Code Root للأطفال والشباب من 5 إلى 21 سنة."
      : "Join Code Root Academy’s free educational WhatsApp group for children and young people ages 5–21.";
    const shareData = { title: currentLanguage === "ar" ? "جروب Code Root التعليمي المجاني" : "Code Root free educational WhatsApp group", text: groupText, url: groupUrl };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(`${groupText}\n${groupUrl}`).then(() => showToast(currentLanguage === "ar" ? "تم نسخ رابط الجروب للمشاركة." : "The group link was copied for sharing."));
    } else {
      window.prompt(currentLanguage === "ar" ? "انسخ رابط الجروب للمشاركة:" : "Copy the group link to share:", groupUrl);
    }
  });
  $("#year").text(new Date().getFullYear());
  $(document).on("keydown", function (event) { if (event.key === "Escape") closeMenu(); });
});
