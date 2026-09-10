(() => {
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  const navLinks = document.querySelectorAll('.main-nav a');
  const year = document.getElementById('year');

  if (year) year.textContent = new Date().getFullYear();

  const track = (event, params = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
  };

  const setHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  setHeader();
  window.addEventListener('scroll', setHeader, { passive: true });

  const closeMenu = () => {
    nav?.classList.remove('open');
    navToggle?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  navToggle?.addEventListener('click', () => {
    const isOpen = nav?.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
    document.body.classList.toggle('menu-open', Boolean(isOpen));
  });
  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  document.querySelectorAll('a[href="#apply"]').forEach(link => {
    link.addEventListener('click', () => track('apply_cta_click', { location: link.closest('section')?.id || 'page' }));
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }

  const SCENARIOS = {
    starter: {
      label: 'Старт', low: 5, high: 15,
      copy: 'Первые эфиры: ты осваиваешь формат, учишься удерживать разговор и находишь первых постоянных зрителей.'
    },
    growing: {
      label: 'Рост', low: 15, high: 45,
      copy: 'Ты уже понимаешь формат, формируешь постоянную аудиторию и последовательно улучшаешь эфиры.'
    },
    strong: {
      label: 'Сильный', low: 45, high: 120,
      copy: 'Стабильная аудитория, сильная коммуникация и регулярный LIVE-ритм могут создавать заметно более высокий результат.'
    },
    top: {
      label: 'Top', low: 120, high: 250,
      copy: 'Иллюстрация outlier-сценария для сильных creators. Это не типичный результат и не ориентир для старта.'
    }
  };

  const hoursRange = document.getElementById('hoursRange');
  const hoursOutput = document.getElementById('hoursOutput');
  const monthlyResult = document.getElementById('monthlyResult');
  const monthlyHours = document.getElementById('monthlyHours');
  const scenarioLabel = document.getElementById('scenarioLabel');
  const scenarioCopy = document.getElementById('scenarioCopy');
  const formulaText = document.getElementById('formulaText');
  const scenarioButtons = document.querySelectorAll('[data-scenario]');
  let selectedScenario = 'growing';

  const money = value => '$' + Math.round(value).toLocaleString('en-US');

  const setRangeFill = input => {
    if (!input) return;
    const min = Number(input.min);
    const max = Number(input.max);
    const val = Number(input.value);
    const pct = ((val - min) / (max - min)) * 100;
    input.style.background = `linear-gradient(to right, var(--rose) 0%, var(--rose) ${pct}%, rgba(255,255,255,.13) ${pct}%, rgba(255,255,255,.13) 100%)`;
  };

  const updateCalculator = ({ tracked = false } = {}) => {
    if (!hoursRange) return;
    const hours = Number(hoursRange.value);
    const scenario = SCENARIOS[selectedScenario];
    const monthHours = hours * 4.33;
    const low = monthHours * scenario.low;
    const high = monthHours * scenario.high;

    hoursOutput.textContent = `${hours} ч`;
    monthlyResult.textContent = `${money(low)}–${money(high)}`;
    monthlyHours.textContent = Math.round(monthHours).toLocaleString('ru-RU');
    scenarioLabel.textContent = scenario.label;
    scenarioCopy.textContent = scenario.copy;
    formulaText.textContent = `${hours} ч/нед × $${scenario.low}–${scenario.high}/ч × 4.33 недели`;
    setRangeFill(hoursRange);

    scenarioButtons.forEach(button => button.classList.toggle('active', button.dataset.scenario === selectedScenario));
    if (tracked) track('calculator_change', { hours, scenario: selectedScenario, low: Math.round(low), high: Math.round(high) });
  };

  hoursRange?.addEventListener('input', () => updateCalculator({ tracked: true }));
  scenarioButtons.forEach(button => button.addEventListener('click', () => {
    selectedScenario = button.dataset.scenario;
    updateCalculator({ tracked: true });
  }));
  updateCalculator();

  const params = new URLSearchParams(window.location.search);
  const attribution = {
    utm_source: params.get('utm_source') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_content: params.get('utm_content') || '',
    referral: params.get('ref') || params.get('referral') || ''
  };

  const form = document.getElementById('applyForm');
  const status = document.getElementById('formStatus');
  const success = document.getElementById('formSuccess');
  const referralDetected = document.getElementById('referralDetected');
  const referralValue = document.getElementById('referralValue');
  const telegramFallback = document.getElementById('telegramFallback');

  if (form) {
    Object.entries(attribution).forEach(([key, value]) => {
      const input = form.elements[key];
      if (input) input.value = value;
    });
  }

  if (attribution.referral && referralDetected && referralValue) {
    referralValue.textContent = attribution.referral;
    referralDetected.hidden = false;
  }

  const telegramHandle = String(document.body.dataset.telegramAdmin || '').replace(/^@/, '').trim();
  if (telegramFallback) {
    telegramFallback.href = telegramHandle && telegramHandle !== 'YOUR_TELEGRAM_USERNAME'
      ? `https://t.me/${encodeURIComponent(telegramHandle)}`
      : 'https://web.telegram.org/';
  }

  const buildMessage = data => [
    'Новая кандидатка — LUNE 🌙',
    '',
    `Возраст: ${data.age}`,
    `Город / страна: ${data.city}`,
    `Instagram / TikTok: ${data.social}`,
    `Telegram: ${data.telegram}`,
    data.utm_source ? `Source: ${data.utm_source}` : '',
    data.utm_campaign ? `Campaign: ${data.utm_campaign}` : '',
    data.utm_content ? `Content: ${data.utm_content}` : '',
    data.referral ? `Referral: ${data.referral}` : ''
  ].filter(Boolean).join('\n');

  form?.addEventListener('focusin', () => {
    if (!form.dataset.started) {
      form.dataset.started = '1';
      track('application_started', attribution);
    }
  }, { once: true });

  const referrerHandle = document.getElementById('referrerHandle');
  const copyReferral = document.getElementById('copyReferral');
  const referralStatus = document.getElementById('referralStatus');

  copyReferral?.addEventListener('click', async () => {
    const handle = String(referrerHandle?.value || '').trim().replace(/^@/, '');
    if (!handle) {
      referralStatus.textContent = 'Введи свой Telegram username — и мы создадим персональную ссылку.';
      referrerHandle?.focus();
      return;
    }
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('ref', handle);
    try {
      await navigator.clipboard.writeText(url.toString());
      referralStatus.textContent = 'Готово ✨ Реферальная ссылка скопирована.';
      track('referral_link_created', { referral: handle });
    } catch (_) {
      referralStatus.textContent = url.toString();
    }
  });

  form?.addEventListener('submit', async event => {
    event.preventDefault();
    const fd = new FormData(form);
    const payload = {
      age: Number(fd.get('age')),
      city: String(fd.get('city') || '').trim().slice(0, 120),
      social: String(fd.get('social') || '').trim().slice(0, 300),
      telegram: String(fd.get('telegram') || '').trim().slice(0, 120),
      consent: Boolean(fd.get('consent')),
      website: String(fd.get('website') || ''),
      ...attribution,
      page: window.location.href,
      referrer: document.referrer || ''
    };

    form.querySelectorAll('input').forEach(input => input.classList.remove('invalid'));
    let invalid = false;

    if (!Number.isFinite(payload.age) || payload.age < 18 || payload.age > 99) {
      form.elements.age?.classList.add('invalid'); invalid = true;
    }
    if (!payload.city) { form.elements.city?.classList.add('invalid'); invalid = true; }
    if (!payload.social) { form.elements.social?.classList.add('invalid'); invalid = true; }
    if (!payload.telegram) { form.elements.telegram?.classList.add('invalid'); invalid = true; }
    if (!payload.consent) invalid = true;

    if (invalid) {
      status.textContent = payload.age && payload.age < 18
        ? 'Участие доступно только девушкам 18+.'
        : 'Заполни, пожалуйста, обязательные поля и подтверди согласие.';
      track('application_validation_error');
      return;
    }

    const submit = form.querySelector('.form-submit');
    submit.disabled = true;
    submit.classList.add('loading');
    submit.innerHTML = 'ОТПРАВЛЯЕМ…';
    status.textContent = '';

    let delivered = false;
    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      delivered = true;
    } catch (_) {
      try { await navigator.clipboard.writeText(buildMessage(payload)); } catch (_) {}
    }

    track('application_submitted', { ...attribution, delivered });
    form.classList.add('submitted');
    success.hidden = false;

    if (!delivered) {
      const directUrl = telegramHandle && telegramHandle !== 'YOUR_TELEGRAM_USERNAME'
        ? `https://t.me/${encodeURIComponent(telegramHandle)}`
        : `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(buildMessage(payload))}`;
      telegramFallback.href = directUrl;
      success.querySelector('p').textContent = 'Контакты готовы. Нажми «Открыть Telegram», чтобы отправить сообщение администратору LUNE.';
    }
  });
})();
