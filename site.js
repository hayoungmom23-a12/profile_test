/* ============================================================
 * SITE_CONFIG — 연락처·URL·사진·후기의 단일 관리 지점
 * 이 파일의 값만 바꾸면 사이트 전체에 반영됩니다.
 *
 * [교체 규칙]
 * - 실제 정보가 준비되기 전에는 아래 placeholder를 임의 값으로 채우지 마세요.
 * - 실제 값이 들어오면 동일한 placeholder 문자열을 실제 값으로 교체하세요.
 * - 사진은 실제 시공 사진 URL로만 교체하세요 (AI·스톡을 실제처럼 사용 금지).
 * - 후기는 실제 문구가 입력되면 자동으로 노출되고, placeholder 상태에서는 숨김 유지됩니다.
 * ============================================================ */
const SITE_CONFIG = {
  contacts: {
    // 실제 번호를 입력하면 전체 표시와 tel: 링크, 구조화 데이터에 자동 반영됩니다.
    phone: "[PHONE_NUMBER]",
    kakao: "[KAKAO_CHANNEL_URL]",
    naverTalk: "[NAVER_TALK_URL]",
    estimateForm: "[ESTIMATE_FORM_URL]"
  },
  images: {
    // 예: "images/site-01.jpg" 또는 실제 호스팅 URL — 상대경로 권장
    project01: "[PROJECT_IMAGE_01]",
    project02: "[PROJECT_IMAGE_02]",
    project03: "[PROJECT_IMAGE_03]",
    project04: "[PROJECT_IMAGE_04]",
    project05: "[PROJECT_IMAGE_05]"
  },
  // 후기가 아직 없습니다. 실제 후기가 준비되면 아래 형식으로 추가하세요:
  // reviews: [
  //   { quote: "실제 후기 문구", source: "공개 가능한 출처 표기" }
  // ],
  // placeholder 상태에서는 반드시 빈 배열을 유지하세요 (가상 후기 생성 금지).
  reviews: [
    // { quote: "[CUSTOMER_REVIEW_01]", source: "[REVIEW_SOURCE_01]" },
    // { quote: "[CUSTOMER_REVIEW_02]", source: "[REVIEW_SOURCE_02]" },
    // { quote: "[CUSTOMER_REVIEW_03]", source: "[REVIEW_SOURCE_03]" }
  ]
};

/* 서비스 목록의 정본은 index.html의 chips <li>이며,
   아래는 문서화를 위한 미러입니다. 문구 수정 시 양쪽을 함께 맞춰주세요. */
const SITE_CONTENT = {
  services: {
    leak: ["누수복구", "옥상 방수", "단열·결로공사"],
    small: ["번호키", "수전", "세면대", "양변기 교체", "타일·줄눈 보수", "방충망", "도어클로저", "손잡이·경첩", "스위치·콘센트", "천장 건조대", "크랙 보수", "도색"],
    partial: ["욕실", "타일", "욕조", "수전", "환풍기", "주방", "싱크대", "싱크볼", "샤시", "도배", "장판"],
    etc: ["철거", "공구 판매", "현장 상황에 따른 덩굴 제거", "쓰레기 정리"]
  }
};

(function () {
  "use strict";

  function isPlaceholder(value) {
    return typeof value !== "string" || value.trim() === "" || /^\[.*\]$/.test(value.trim());
  }
  function isConfigured(value) {
    return !isPlaceholder(value);
  }
  function toTelHref(phone) {
    const digits = String(phone).replace(/[^0-9+]/g, "");
    if (!digits) return "#";
    return "tel:" + digits;
  }
  function markDisabled(link, label) {
    link.setAttribute("href", "#");
    link.setAttribute("aria-disabled", "true");
    link.classList.add("is-placeholder");
    if (!link.querySelector(".placeholder-flag")) {
      const flag = document.createElement("span");
      flag.className = "placeholder-flag";
      flag.textContent = "연결 준비 중";
      const text = link.querySelector(".btn-text");
      if (text) text.appendChild(flag);
    }
    link.addEventListener("click", function (e) {
      e.preventDefault();
    });
    if (label) link.setAttribute("aria-label", label + " (연결 준비 중)");
  }

  function applyContacts() {
    const c = SITE_CONFIG.contacts;

    // 전화: 모든 data-contact="phone"에 동일 반영 + 표시 텍스트 동기화
    const phoneLinks = document.querySelectorAll('[data-contact="phone"]');
    const phoneTexts = document.querySelectorAll("[data-phone-text]");
    if (isConfigured(c.phone)) {
      const href = toTelHref(c.phone);
      phoneLinks.forEach(function (a) {
        a.setAttribute("href", href);
        a.removeAttribute("aria-disabled");
        a.classList.remove("is-placeholder");
        a.setAttribute("aria-label", "전화 상담 " + c.phone);
      });
      phoneTexts.forEach(function (el) { el.textContent = c.phone; });
      const note = document.querySelector('[data-contact-note="phone"]');
      if (note) note.textContent = "전화가 가장 빠릅니다. 누르면 바로 연결됩니다.";
    } else {
      phoneLinks.forEach(function (a) { markDisabled(a, "전화 상담 [PHONE_NUMBER]"); });
      phoneTexts.forEach(function (el) { el.textContent = "[PHONE_NUMBER]"; });
    }

    // 카카오 / 네이버 톡톡 / 견적 폼
    const map = [
      { key: "kakao", kind: "kakao", label: "카카오톡 상담", external: true },
      { key: "naverTalk", kind: "naver", label: "네이버 톡톡", external: true },
      { key: "estimateForm", kind: "estimate", label: "무료 견적 신청", external: true }
    ];
    map.forEach(function (m) {
      const value = c[m.key];
      const links = document.querySelectorAll('[data-contact="' + m.kind + '"]');
      const hints = document.querySelectorAll('[data-contact-hint="' + m.kind + '"]');
      if (isConfigured(value)) {
        links.forEach(function (a) {
          a.setAttribute("href", value);
          a.removeAttribute("aria-disabled");
          a.classList.remove("is-placeholder");
          a.setAttribute("aria-label", m.label + "으로 이동");
          if (m.external) {
            a.setAttribute("target", "_blank");
            a.setAttribute("rel", "noopener noreferrer");
          }
          const flag = a.querySelector(".placeholder-flag");
          if (flag) flag.remove();
        });
        hints.forEach(function (el) { el.textContent = "연결하기"; });
      } else {
        links.forEach(function (a) { markDisabled(a, m.label); });
        // hint에는 어떤 placeholder인지 그대로 노출 (교체 위치 명확화)
        const token = { kakao: "[KAKAO_CHANNEL_URL]", naver: "[NAVER_TALK_URL]", estimate: "[ESTIMATE_FORM_URL]" }[m.kind];
        hints.forEach(function (el) { el.textContent = token; });
      }
    });
  }

  function applyStructuredData() {
    const schemaElement = document.getElementById("local-business-schema");
    if (!schemaElement) return;
    try {
      const schema = JSON.parse(schemaElement.textContent);
      if (isConfigured(SITE_CONFIG.contacts.phone)) {
        schema.telephone = SITE_CONFIG.contacts.phone;
      } else {
        delete schema.telephone;
      }
      schemaElement.textContent = JSON.stringify(schema);
    } catch (error) {
      // 마크업에 포함된 JSON-LD가 손상돼도 화면과 상담 링크는 계속 동작하게 둡니다.
    }
  }

  function renderImageSlot(slot) {
    const key = slot.getAttribute("data-image-slot");
    const label = slot.getAttribute("data-image-label") || "시공 사진";
    const ratio = slot.getAttribute("data-image-ratio") || "16 / 10";
    const value = SITE_CONFIG.images[key];

    if (isConfigured(value)) {
      const img = document.createElement("img");
      img.className = "img-real";
      img.src = value;
      img.alt = "성진 인테리어 디자인 실제 시공 사진: " + label;
      img.loading = "lazy";
      img.decoding = "async";
      img.style.aspectRatio = ratio;
      slot.replaceWith(img);
    } else {
      const box = document.createElement("div");
      box.className = "img-slot";
      box.style.aspectRatio = ratio;
      box.setAttribute("role", "img");
      box.setAttribute("aria-label", label + " 자리. 실제 사진 연결 예정 placeholder.");
      const tokenText = "[" + ({ project01: "PROJECT_IMAGE_01", project02: "PROJECT_IMAGE_02", project03: "PROJECT_IMAGE_03", project04: "PROJECT_IMAGE_04", project05: "PROJECT_IMAGE_05" }[key] || key) + "]";
      const strong = document.createElement("strong");
      strong.textContent = label;
      const token = document.createElement("span");
      token.className = "token";
      token.textContent = tokenText;
      const small = document.createElement("small");
      small.textContent = "실제 시공 사진 교체 예정 · AI·스톡 이미지 사용 안 함";
      box.appendChild(strong);
      box.appendChild(token);
      box.appendChild(small);
      slot.replaceWith(box);
    }
  }

  function applyImages() {
    document.querySelectorAll("[data-image-slot]").forEach(renderImageSlot);
  }

  function applyReviews() {
    const section = document.getElementById("reviews");
    const list = document.getElementById("review-list");
    if (!section || !list) return;
    const real = (SITE_CONFIG.reviews || []).filter(function (r) {
      return r && isConfigured(r.quote) && isConfigured(r.source);
    });
    // 실제 후기가 하나도 없으면 섹션 숨김 유지 (가짜 후기 생성 금지)
    if (real.length === 0) {
      section.setAttribute("hidden", "");
      list.innerHTML = "";
      return;
    }
    list.innerHTML = "";
    real.forEach(function (r) {
      const card = document.createElement("figure");
      card.className = "review-card";
      const q = document.createElement("blockquote");
      q.textContent = r.quote;
      const cap = document.createElement("figcaption");
      cap.textContent = "— " + r.source;
      card.appendChild(q);
      card.appendChild(cap);
      list.appendChild(card);
    });
    section.removeAttribute("hidden");
  }

  function applyYear() {
    const y = document.getElementById("year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyContacts();
    applyStructuredData();
    applyImages();
    applyReviews();
    applyYear();
  });
})();

