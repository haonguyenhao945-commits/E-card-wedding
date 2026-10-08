(() => {
  const STAGE_W = 390;
  const STAGE_H = 844;
  const stage = document.getElementById('stage');
  const letter = document.getElementById('letter');
  const root = document.documentElement;

  /* ---------- Co giãn khung thiết kế (rộng 390) theo thiết bị ----------
     - Điện thoại (rộng ≤ 480px): khoá theo CHIỀU RỘNG, hệ số = rộng màn hình / 390, luôn phủ kín chiều ngang.
       Chiều cao khung tự co giãn theo màn hình (--stage-h); tranh bìa 390×844 nằm giữa khi khung cao hơn.
     - Màn hình lớn (tablet, desktop): giữ khung 390×844 ở giữa, hai bên nền #1E1E1E. */
  const PHONE_MAX = 480;
  function fit() {
    const vw = window.innerWidth, vh = window.innerHeight;
    const set = (k, v) => root.style.setProperty(k, v);
    if (vw <= PHONE_MAX) {
      const s = vw / STAGE_W;
      const h = vh / s;
      set('--s', s.toFixed(4));
      set('--stage-h', h.toFixed(2) + 'px');
      set('--oy', (h > STAGE_H ? (h - STAGE_H) / 2 : 0).toFixed(2) + 'px');
      set('--stage-top', '0px'); set('--stage-ty', '0px'); set('--stage-origin', '50% 0');
    } else {
      const s = Math.min(vw / STAGE_W, vh / STAGE_H);
      set('--s', s.toFixed(4));
      set('--stage-h', STAGE_H + 'px');
      set('--oy', '0px');
      set('--stage-top', '50%'); set('--stage-ty', '-50%'); set('--stage-origin', 'center');
    }
  }
  fit();
  window.addEventListener('resize', fit);

  /* ---------- Ngôn ngữ (Tiếng Việt / English) ----------
     Mỗi chuỗi có data-i18n (nội dung) / data-i18n-aria / data-i18n-alt. Nút ở trang bìa chuyển qua lại,
     lựa chọn được nhớ lại cho lần sau. Nội dung tiếng Anh là bản dịch gợi ý, cần chủ thiệp duyệt lại. */
  const STRINGS = {
    vi: {
      title: 'Duy & Hảo — Thiệp cưới', h1: 'Thiệp cưới Duy & Hảo',
      open: 'mở thiệp', openAria: 'Mở thiệp',
      langName: 'Tiếng Việt', langAria: 'Switch to English',
      heroAlt: 'Thiệp mời đám cưới Duy & Hảo',
      groom: 'Quý Nam', bride: 'Út Nữ',
      announce: 'Trân trọng báo tin', brideSide: 'Nhà gái', groomSide: 'Nhà Trai',
      hint: 'Chạm để xem thông tin chi tiết',
      cdAria: 'Đếm ngược đến ngày cưới',
      days: 'Ngày', hours: 'Giờ', minutes: 'Phút', seconds: 'Giây',
      thanks: 'Thank you!',
      back: 'Quay lại', heroAltBride: 'Thiệp mời đám cưới nhà gái — Duy & Hảo',
      ev1: 'THÁNH LỄ HÔN PHỐI được cử hành vào lúc', ev2: 'LỄ VU QUY được cử hành vào lúc', ev3: 'TIỆC THÂN MẬT được cử hành vào lúc',
      sat: 'Thứ Bảy,\n19.12.2026', place1: 'Giáo xứ Thánh Tâm - Lộc Tiến',
      place2: 'Tại Tư Gia - 1041 Trần Phú,\nPhường 3 Bảo Lộc, Lâm Đồng',
      arrive: '11:00 - Đón khách', start: '11:30 - Khai tiệc',
      heroAltGroom: 'Thiệp mời đám cưới nhà trai — Duy & Hảo',
      evT1: 'LỄ TÂN HÔN được cử hành vào lúc', sun: 'Chủ Nhật,\n20.12.2026',
      placeT1: 'Tại Tư Gia - Số 22, Đường 14A, Ấp Củ Chi, Xã Tân An Hội, TP.HCM',
      placeT2: 'Hoa Viên Dốc Phố\n22 Đường số 35, Xã Tân An Hội, TP.HCM',
    },
    en: {
      title: 'Duy & Hảo — Wedding Invitation', h1: 'Duy & Hảo — Wedding Invitation',
      open: 'open invitation', openAria: 'Open the invitation',
      langName: 'English', langAria: 'Chuyển sang tiếng Việt',
      heroAlt: 'Wedding invitation of Duy & Hảo',
      groom: 'Groom', bride: 'Bride',
      announce: 'With joy, we announce', brideSide: "Bride's family", groomSide: "Groom's family",
      hint: 'Tap to see the details',
      cdAria: 'Countdown to the wedding day',
      days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds',
      thanks: 'Thank you!',
      back: 'Back', heroAltBride: "The bride's family wedding invitation — Duy & Hảo",
      ev1: 'HOLY MATRIMONY MASS will be held at', ev2: 'THE VU QUY CEREMONY will be held at', ev3: 'THE INTIMATE RECEPTION will be held at',
      sat: 'Saturday,\n19.12.2026', place1: 'Thánh Tâm Catholic Church - Lộc Tiến',
      place2: 'At the family home - 1041 Trần Phú, Ward 3, Bảo Lộc, Lâm\u00a0Đồng', // \u00a0: không tách "Lâm Đồng" ra hai dòng
      arrive: '11:00 - Guests arrive', start: '11:30 - Reception starts',
      heroAltGroom: "The groom's family wedding invitation — Duy & Hảo",
      evT1: 'THE WEDDING CEREMONY will be held at', sun: 'Sunday,\n20.12.2026',
      placeT1: 'At the family home - 22 Street 14A, Củ\u00a0Chi Hamlet, Tân\u00a0An\u00a0Hội Commune, HCMC',
      placeT2: 'Hoa Viên Dốc Phố\n22 Street No. 35, Tân\u00a0An\u00a0Hội Commune, HCMC', // tên riêng giữ nguyên tiếng Việt
    },
  };
  let lang = 'vi';
  try { const saved = localStorage.getItem('lang'); if (saved === 'vi' || saved === 'en') lang = saved; } catch (e) { /* bỏ qua */ }

  // Chuỗi có \n sẽ thành <br>
  function setText(el, str) {
    el.textContent = '';
    str.split('\n').forEach((line, i) => {
      if (i) el.append(document.createElement('br'));
      el.append(document.createTextNode(line));
    });
  }

  function applyLang(next, animate) {
    lang = next;
    const t = STRINGS[lang];
    root.lang = lang;
    document.title = t.title;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      setText(el, t[el.dataset.i18n]);
      if (animate && !el.closest('.cta')) { el.classList.remove('lang-pop'); void el.offsetWidth; el.classList.add('lang-pop'); }
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', t[el.dataset.i18nAria]));
    document.querySelectorAll('[data-i18n-alt]').forEach((el) => el.setAttribute('alt', t[el.dataset.i18nAlt]));
    try { localStorage.setItem('lang', lang); } catch (e) { /* bỏ qua */ }
  }
  applyLang(lang, false);
  document.getElementById('lang').addEventListener('click', () => applyLang(lang === 'vi' ? 'en' : 'vi', true));

  /* ---------- Đếm ngược tới Thánh lễ Hôn phối: 04:30 Thứ Bảy 19.12.2026 (giờ VN) ---------- */
  const TARGET = new Date('2026-12-19T04:30:00+07:00').getTime();
  const cd = { d: document.querySelectorAll('[data-cd="d"]'), h: document.querySelectorAll('[data-cd="h"]'), m: document.querySelectorAll('[data-cd="m"]'), s: document.querySelectorAll('[data-cd="s"]') };
  const pad = (n) => String(n).padStart(2, '0');
  const put = (nodes, v) => nodes.forEach((n) => { n.textContent = v; });
  function tick() {
    const left = Math.max(0, TARGET - Date.now());
    const sec = Math.floor(left / 1000);
    put(cd.d, pad(Math.floor(sec / 86400)));
    put(cd.h, pad(Math.floor(sec % 86400 / 3600)));
    put(cd.m, pad(Math.floor(sec % 3600 / 60)));
    put(cd.s, pad(sec % 60));
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- Mở thiệp ----------
     Bấm dấu sáp/CTA → nắp phong bì lật lên (is-open) → ngay khi nắp vừa lật xong
     đẩy cả trang trong từ dưới lên (is-inside), không dừng thêm. */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FLIP_DONE_MS = reduceMotion ? 0 : 1300; // nắp gần lật xong (delay .25s + lật 1.25s) thì trang 2 bắt đầu đẩy lên
  let opened = false;
  function openInvitation() {
    if (opened) return;
    opened = true;
    stage.classList.add('is-open');
    document.getElementById('seal').tabIndex = -1;
    document.getElementById('cta').tabIndex = -1;
    setTimeout(() => {
      stage.classList.add('is-inside');
      letter.setAttribute('aria-hidden', 'false');
      letter.tabIndex = 0;
      letter.scrollTop = 0;
      letter.focus({ preventScroll: true });
      // Bắt đầu theo dõi cuộn khi trang 2 đã gần lên tới nơi, để hero hiện ra đúng lúc trang đến
      setTimeout(startScrollReveal, reduceMotion ? 0 : 900);
      // Khi trang trong đã lên hẳn và phong bì đã rời đi: ẩn các lớp phong bì phía sau để mép trang không lộ màu bên dưới
      setTimeout(() => stage.classList.add('is-settled'), reduceMotion ? 0 : 2600);
    }, FLIP_DONE_MS);
  }
  /* ---------- Hiện dần theo cuộn ----------
     - .split     : văn bản tách thành từng dòng, mỗi dòng đẩy từ dưới lên (trong khung cắt)
     - .rv-group  : nhóm nhiều đoạn chữ; các dòng cùng hàng hiện cùng lúc, hàng sau nối tiếp
     - .rv-up     : ảnh tên viết tay đẩy từ dưới lên
     - .rv / .rv-stagger / .rv-fade : hiện dần thông thường
     - .rv-after  : hiện sau ảnh nền đứng trước nó (đồng hồ đếm ngược sau ảnh nền) */
  function splitLines(el) {
    const text = el.textContent.replace(/\s+/g, ' ').trim();
    const frag = document.createDocumentFragment();
    el.childNodes.forEach((n) => {
      if (n.nodeType === 3) {
        n.textContent.split(/[ \t\r\n]+/).filter(Boolean).forEach((w) => { // chỉ tách theo khoảng trắng thường, giữ nguyên \u00a0
          const s = document.createElement('span');
          s.className = 'w';
          s.style.display = 'inline-block';
          s.textContent = w;
          frag.append(s, document.createTextNode(' '));
        });
      } else if (n.nodeName === 'BR') frag.append(document.createElement('br'));
    });
    el.textContent = '';
    el.append(frag);

    const lines = [];
    let cur = [], lastTop = null;
    [...el.children].forEach((c) => {
      if (c.tagName === 'BR') { if (cur.length) lines.push(cur); cur = []; lastTop = null; return; }
      const top = c.offsetTop;
      if (lastTop !== null && Math.abs(top - lastTop) > 3) { lines.push(cur); cur = []; }
      cur.push(c.textContent);
      lastTop = top;
    });
    if (cur.length) lines.push(cur);

    el.textContent = '';
    const sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = text;
    el.append(sr);
    lines.forEach((ws) => {
      const ln = document.createElement('span');
      ln.className = 'ln';
      ln.setAttribute('aria-hidden', 'true');
      const inn = document.createElement('span');
      inn.className = 'ln-in';
      inn.textContent = ws.join(' ');
      ln.append(inn);
      el.append(ln);
    });
  }

  // Độ trễ theo hàng trong một nhóm: các dòng có cùng vị trí dọc thì cùng hàng
  function assignRowDelays(group, step) {
    const scale = stage.getBoundingClientRect().width / STAGE_W || 1;
    const items = [...group.querySelectorAll('.ln-in')].map((n) => ({ n, y: n.getBoundingClientRect().top / scale }));
    const rows = [];
    items.sort((p, q) => p.y - q.y).forEach(({ n, y }) => {
      let r = rows.findIndex((ry) => Math.abs(ry - y) < 6);
      if (r < 0) { rows.push(y); r = rows.length - 1; }
      n.style.setProperty('--ld', (r * step).toFixed(2) + 's');
    });
  }

  const revealed = new WeakSet();
  // Thiết lập hiệu ứng hiện dần cho một vùng cuộn (rootEl); mỗi vùng chỉ thiết lập một lần
  function setupReveal(rootEl) {
    if (revealed.has(rootEl)) return;
    revealed.add(rootEl);
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => {
      const splits = [...rootEl.querySelectorAll('.split')];
      splits.forEach(splitLines);
      rootEl.querySelectorAll('.rv-group').forEach((g) => assignRowDelays(g, 0.12));
      splits.filter((el) => !el.closest('.rv-group')).forEach((el) => assignRowDelays(el, 0.12));
      rootEl.querySelectorAll('.rv-stagger').forEach((p) => [...p.children].forEach((c, i) => c.style.setProperty('--i', i)));

      const targets = [
        ...rootEl.querySelectorAll('.rv, .rv-stagger:not(.rv-after), .rv-fade, .rv-up, .rv-group'),
        ...splits.filter((el) => !el.closest('.rv-group')),
      ];
      const show = (el) => {
        el.classList.add('is-in');
        // data-reveal-after: khối khác chỉ hiện sau khi phần tử này đã hiện (đồng hồ đếm ngược sau ảnh nền)
        const next = el.dataset.revealAfter && rootEl.querySelector(el.dataset.revealAfter);
        if (next) setTimeout(() => next.classList.add('is-in'), reduceMotion ? 0 : 900);
      };
      if (!('IntersectionObserver' in window)) { targets.forEach(show); return; }
      const io = new IntersectionObserver((entries) => {
        // Các khối cùng lọt vào màn hình trong một lượt: sắp theo vị trí trên → dưới, hàng nào xuống dưới thì trễ hơn
        // (các khối nằm cùng độ cao coi là cùng một hàng)
        const scale = stage.getBoundingClientRect().width / STAGE_W || 1;
        const batch = entries.filter((e) => e.isIntersecting)
          .map((e) => ({ el: e.target, y: e.target.getBoundingClientRect().top / scale }))
          .sort((p, q) => p.y - q.y);
        let row = -1, lastY = -1e9;
        batch.forEach(({ el, y }) => {
          if (y - lastY > 10) { row += 1; lastY = y; }
          el.style.setProperty('--rd', (Math.min(row, 8) * 0.14).toFixed(2) + 's');
          show(el);
          io.unobserve(el);
        });
      }, { root: rootEl, rootMargin: '0px 0px -4% 0px', threshold: 0.1 });
      targets.forEach((t) => io.observe(t));
    });
  }
  const startScrollReveal = () => setupReveal(letter);

  /* ---------- Trang con "Nhà gái" / "Nhà trai" ----------
     Bấm nút tương ứng → trang con trượt vào từ bên phải; nút quay lại (hoặc nút Back / Esc) đóng lại. */
  const SUBS = {
    bride: { el: document.getElementById('sub-bride'), hash: '#nha-gai' },
    groom: { el: document.getElementById('sub-groom'), hash: '#nha-trai' },
  };
  const subBack = document.getElementById('sub-back');
  let activeSub = null;
  function openSub(key, push = true) {
    if (activeSub || !SUBS[key]) return;
    const { el, hash } = SUBS[key];
    activeSub = key;
    stage.classList.add('is-sub', 'is-sub-' + key);
    el.setAttribute('aria-hidden', 'false');
    el.scrollTop = 0;
    el.tabIndex = 0;
    el.focus({ preventScroll: true });
    setTimeout(() => setupReveal(el), reduceMotion ? 0 : 250);
    if (push) { try { history.pushState({ view: key }, '', hash); } catch (e) { /* bỏ qua */ } }
  }
  function closeSub(fromPop = false) {
    if (!activeSub) return;
    const key = activeSub;
    activeSub = null;
    stage.classList.remove('is-sub', 'is-sub-' + key);
    SUBS[key].el.setAttribute('aria-hidden', 'true');
    if (!fromPop && history.state && history.state.view === key) { try { history.back(); } catch (e) { /* bỏ qua */ } }
  }
  document.querySelectorAll('[data-open-sub]').forEach((b) => b.addEventListener('click', () => openSub(b.dataset.openSub)));
  subBack.addEventListener('click', () => closeSub());
  window.addEventListener('popstate', () => { if (activeSub) closeSub(true); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && activeSub) closeSub(); });

  document.getElementById('seal').addEventListener('click', openInvitation);
  document.getElementById('cta').addEventListener('click', openInvitation);
})();
