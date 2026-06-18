/**
 * Language Switcher (TH / EN)
 * Default language: Thai (th)
 *
 * Usage:
 *   Add data-i18n attribute to any element whose text should be translated.
 *   Then add data-th="..." and data-en="..." attributes with the translations.
 *
 *   Example:
 *     <span data-i18n data-th="สวัสดี" data-en="Hello">สวัสดี</span>
 *
 * The currently selected language is persisted in localStorage under
 * the key "preferred-language".
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'preferred-language';
    const DEFAULT_LANG = 'th';
    const SUPPORTED_LANGS = ['th', 'en'];

    /**
     * Get the current language from localStorage,
     * falling back to the default language.
     */
    function getCurrentLang() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored && SUPPORTED_LANGS.indexOf(stored) !== -1) {
                return stored;
            }
        } catch (e) {
            // localStorage may be unavailable (e.g. private mode)
        }
        return DEFAULT_LANG;
    }

    /**
     * Save the chosen language to localStorage.
     */
    function saveLang(lang) {
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch (e) {
            // Ignore storage errors
        }
    }

    /**
     * Apply translations to all elements with the data-i18n attribute.
     */
    function applyLang(lang) {
        if (SUPPORTED_LANGS.indexOf(lang) === -1) {
            lang = DEFAULT_LANG;
        }

        // Update <html lang="..."> for accessibility and SEO
        document.documentElement.setAttribute('lang', lang);

        // Update all translatable elements
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(function (el) {
            const text = el.getAttribute('data-' + lang);
            if (text !== null && text !== undefined) {
                el.textContent = text;
            }
        });

        // Update the language label in the switcher button
        const label = document.getElementById('currentLangLabel');
        if (label) {
            label.textContent = lang.toUpperCase();
        }

        // Mark the active option in the dropdown
        document.querySelectorAll('.lang-switch').forEach(function (item) {
            if (item.getAttribute('data-lang') === lang) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    /**
     * Switch the current language and persist the choice.
     */
    function setLang(lang) {
        saveLang(lang);
        applyLang(lang);
    }

    /**
     * Initialize the language switcher once the DOM is ready.
     */
    function init() {
        const currentLang = getCurrentLang();
        applyLang(currentLang);

        document.querySelectorAll('.lang-switch').forEach(function (item) {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                const lang = this.getAttribute('data-lang');
                if (lang) {
                    setLang(lang);
                    // Close the dropdown after selection
                    const dropdown = bootstrap.Dropdown.getInstance(
                        document.getElementById('langDropdown')
                    );
                    if (dropdown) {
                        dropdown.hide();
                    }
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

/**
 * Comparison Table Category Filter
 *
 * Filters the rows of the pricing comparison table by clicking the
 * category pills above the table. Each table row that is not a
 * category header or the action row must have a `data-category`
 * attribute matching one of the filter values.
 *
 * Supported filter values: "all", "core", "reports", "custom",
 * "api", "security", "support".
 */
(function () {
    'use strict';

    function init() {
        const filter = document.getElementById('comparisonFilter');
        const table = document.querySelector('.comparison-table');
        if (!filter || !table) {
            return;
        }

        const buttons = filter.querySelectorAll('[data-filter]');
        const categoryRows = table.querySelectorAll('tr.category-row');
        const dataRows = table.querySelectorAll('tr[data-category]');
        const actionRow = table.querySelector('tr.action-row');

        function applyFilter(value) {
            // Toggle button active state
            buttons.forEach(function (btn) {
                if (btn.getAttribute('data-filter') === value) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            // Show/hide data rows
            dataRows.forEach(function (row) {
                const match = value === 'all' || row.getAttribute('data-category') === value;
                row.style.display = match ? '' : 'none';
            });

            // Show/hide category headers - only show those that have at
            // least one visible row in the current filter.
            categoryRows.forEach(function (catRow) {
                const cat = catRow.getAttribute('data-category');
                if (value === 'all') {
                    catRow.style.display = '';
                } else {
                    catRow.style.display = (cat === value) ? '' : 'none';
                }
            });

            // Always show the action row
            if (actionRow) {
                actionRow.style.display = '';
            }
        }

        buttons.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const value = this.getAttribute('data-filter');
                if (value) {
                    applyFilter(value);
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

/**
 * Partners Line Graph & KPI Counters
 *
 * Renders an animated SVG line graph showing partner and participant
 * growth. The dataset can be switched via range pills (6 months /
 * 1 year / all time). KPI tiles count up their numeric value the
 * first time the section enters the viewport.
 */
(function () {
    'use strict';

    // ---- Datasets ----
    // Each value is the count for that month. Months are
    // 0=Jan, 1=Feb ... 11=Dec.
    const DATASETS = {
        '6m': {
            labels: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.'],
            labelsEn: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            partners: [1480, 1620, 1750, 1900, 2080, 2240],
            participants: [1850, 1980, 2100, 2260, 2380, 2480]
        },
        '1y': {
            labels: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
            labelsEn: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            partners: [1200, 1280, 1350, 1430, 1520, 1620, 1750, 1900, 2000, 2120, 2200, 2240],
            participants: [1500, 1600, 1700, 1820, 1940, 2050, 2160, 2260, 2320, 2400, 2450, 2480]
        },
        'all': {
            labels: [
                'ม.ค.24', 'ก.พ.24', 'มี.ค.24', 'เม.ย.24', 'พ.ค.24', 'มิ.ย.24',
                'ก.ค.24', 'ส.ค.24', 'ก.ย.24', 'ต.ค.24', 'พ.ย.24', 'ธ.ค.24',
                'ม.ค.25', 'ก.พ.25', 'มี.ค.25', 'เม.ย.25', 'พ.ค.25', 'มิ.ย.25',
                'ก.ค.25', 'ส.ค.25', 'ก.ย.25', 'ต.ค.25', 'พ.ย.25', 'ธ.ค.25'
            ],
            labelsEn: [
                'Jan 24', 'Feb 24', 'Mar 24', 'Apr 24', 'May 24', 'Jun 24',
                'Jul 24', 'Aug 24', 'Sep 24', 'Oct 24', 'Nov 24', 'Dec 24',
                'Jan 25', 'Feb 25', 'Mar 25', 'Apr 25', 'May 25', 'Jun 25',
                'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25'
            ],
            partners: [320, 380, 450, 520, 610, 700, 800, 900, 1010, 1110, 1200, 1280,
                       1350, 1430, 1520, 1620, 1750, 1900, 2000, 2120, 2200, 2240, 2290, 2340],
            participants: [410, 490, 580, 670, 770, 880, 990, 1100, 1230, 1350, 1500, 1600,
                          1700, 1820, 1940, 2050, 2160, 2260, 2320, 2400, 2450, 2480, 2510, 2540]
        }
    };

    // SVG geometry (viewBox 800 x 320, x range 30..770, y range 60..300)
    const VB_W = 800;
    const VB_H = 320;
    const X_MIN = 30;
    const X_MAX = 770;
    const Y_MIN = 60;   // top of plot area (max value)
    const Y_MAX = 300;  // bottom of plot area (min value)

    function getLocale() {
        try {
            const stored = localStorage.getItem('preferred-language');
            if (stored === 'en') return 'en';
        } catch (e) { /* ignore */ }
        return 'th';
    }

    /**
     * Compute a "nice" round scale (min, max, step) for the Y axis
     * given the actual data range. Always includes some headroom.
     */
    function niceScale(dataMin, dataMax) {
        const range = dataMax - dataMin;
        const pad = Math.max(range * 0.15, 50);
        const niceMin = Math.max(0, Math.floor((dataMin - pad) / 100) * 100);
        const niceMax = Math.ceil((dataMax + pad) / 100) * 100;
        const step = Math.max(100, Math.round((niceMax - niceMin) / 5 / 100) * 100);
        // Snap to a clean step
        const adjustedMax = niceMin + step * 5;
        return { min: niceMin, max: adjustedMax, step: step };
    }

    function valueToY(v, min, max) {
        const t = (v - min) / (max - min);
        return Y_MAX - t * (Y_MAX - Y_MIN);
    }

    function indexToX(i, n) {
        if (n <= 1) return (X_MIN + X_MAX) / 2;
        return X_MIN + (i / (n - 1)) * (X_MAX - X_MIN);
    }

    /**
     * Build a smooth Catmull-Rom-like cubic Bezier path through the
     * given (x, y) points.
     */
    function smoothPath(points) {
        if (!points.length) return '';
        if (points.length === 1) {
            return 'M ' + points[0][0] + ' ' + points[0][1];
        }
        const d = ['M ' + points[0][0].toFixed(2) + ' ' + points[0][1].toFixed(2)];
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i - 1] || points[i];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[i + 2] || p2;
            const tension = 0.18;
            const cp1x = p1[0] + (p2[0] - p0[0]) * tension;
            const cp1y = p1[1] + (p2[1] - p0[1]) * tension;
            const cp2x = p2[0] - (p3[0] - p1[0]) * tension;
            const cp2y = p2[1] - (p3[1] - p1[1]) * tension;
            d.push('C ' + cp1x.toFixed(2) + ' ' + cp1y.toFixed(2) +
                   ', ' + cp2x.toFixed(2) + ' ' + cp2y.toFixed(2) +
                   ', ' + p2[0].toFixed(2) + ' ' + p2[1].toFixed(2));
        }
        return d.join(' ');
    }

    function areaPath(linePath, n) {
        // Append a closing segment to fill the area down to the X axis.
        const lastX = indexToX(n - 1, n).toFixed(2);
        const firstX = indexToX(0, n).toFixed(2);
        return linePath + ' L ' + lastX + ' ' + Y_MAX +
               ' L ' + firstX + ' ' + Y_MAX + ' Z';
    }

    function svgEl(name, attrs) {
        const ns = 'http://www.w3.org/2000/svg';
        const el = document.createElementNS(ns, name);
        if (attrs) {
            Object.keys(attrs).forEach(function (k) {
                el.setAttribute(k, attrs[k]);
            });
        }
        return el;
    }

    function formatNumber(n) {
        return n.toLocaleString('en-US');
    }

    function init() {
        const section = document.querySelector('.aurora-partners');
        const svg = document.querySelector('.line-graph');
        const filter = document.getElementById('partnerGraphFilter');
        const xLabels = document.getElementById('graphXLabels');
        const tooltip = document.getElementById('lineTooltip');
        if (!section || !svg || !filter || !xLabels) return;

        const partnersLine = document.getElementById('partnersLine');
        const participantsLine = document.getElementById('participantsLine');
        const partnersArea = document.getElementById('partnersArea');
        const participantsArea = document.getElementById('participantsArea');
        const partnersDots = document.getElementById('partnersDots');
        const participantsDots = document.getElementById('participantsDots');
        const hoverLayer = document.getElementById('hoverLayer');
        if (!partnersLine || !participantsLine) return;

        let currentRange = '1y';
        let hasAnimated = false;

        function render(range, animate) {
            const data = DATASETS[range] || DATASETS['1y'];
            const n = data.partners.length;
            const locale = getLocale();
            const labelSet = locale === 'en' ? data.labelsEn : data.labels;

            // Compute value scale from the data so labels stay in sync
            const dataMin = Math.min(
                Math.min.apply(null, data.partners),
                Math.min.apply(null, data.participants)
            );
            const dataMax = Math.max(
                Math.max.apply(null, data.partners),
                Math.max.apply(null, data.participants)
            );
            const scale = niceScale(dataMin, dataMax);

            // Y-axis labels (5 lines)
            const yLabels = document.getElementById('graphYLabels');
            if (yLabels) {
                yLabels.innerHTML = '';
                for (let i = 0; i <= 5; i++) {
                    const v = scale.min + scale.step * (5 - i);
                    const y = Y_MIN + (i / 5) * (Y_MAX - Y_MIN);
                    const text = svgEl('text', { x: 0, y: y + 4 });
                    text.textContent = formatNumber(v);
                    yLabels.appendChild(text);
                }
            }

            // Compute points
            const partnerPts = data.partners.map(function (v, i) {
                return [indexToX(i, n), valueToY(v, scale.min, scale.max)];
            });
            const participantPts = data.participants.map(function (v, i) {
                return [indexToX(i, n), valueToY(v, scale.min, scale.max)];
            });

            // Build paths
            const partnerPath = smoothPath(partnerPts);
            const participantPath = smoothPath(participantPts);
            partnersLine.setAttribute('d', partnerPath);
            participantsLine.setAttribute('d', participantPath);
            partnersArea.setAttribute('d', areaPath(partnerPath, n));
            participantsArea.setAttribute('d', areaPath(participantPath, n));

            // Dots
            partnersDots.innerHTML = '';
            participantsDots.innerHTML = '';
            partnerPts.forEach(function (pt, i) {
                const c = svgEl('circle', {
                    cx: pt[0], cy: pt[1], r: 3.5,
                    fill: '#7c3aed',
                    stroke: '#fff', 'stroke-width': 1.5,
                    class: 'data-dot dot-partners'
                });
                c.dataset.index = i;
                partnersDots.appendChild(c);
            });
            participantPts.forEach(function (pt, i) {
                const c = svgEl('circle', {
                    cx: pt[0], cy: pt[1], r: 3.5,
                    fill: '#06b6d4',
                    stroke: '#fff', 'stroke-width': 1.5,
                    class: 'data-dot dot-participants'
                });
                c.dataset.index = i;
                participantsDots.appendChild(c);
            });

            // Hover targets (vertical slice rects for easy mouseover)
            hoverLayer.innerHTML = '';
            const sliceWidth = (X_MAX - X_MIN) / Math.max(n - 1, 1);
            for (let i = 0; i < n; i++) {
                const x = i === 0 ? X_MIN : i === n - 1 ? X_MAX : indexToX(i, n) - sliceWidth / 2;
                const w = i === 0 || i === n - 1 ? sliceWidth / 2 : sliceWidth;
                const rect = svgEl('rect', {
                    x: x, y: Y_MIN,
                    width: w, height: Y_MAX - Y_MIN,
                    class: 'hover-target',
                    fill: 'transparent'
                });
                rect.dataset.index = i;
                hoverLayer.appendChild(rect);
            }

            // X-axis labels - thin to ~6 visible
            xLabels.innerHTML = '';
            const step = Math.max(1, Math.ceil(n / 6));
            for (let i = 0; i < n; i += step) {
                const span = document.createElement('span');
                span.textContent = labelSet[i];
                xLabels.appendChild(span);
            }
            // Always include last label
            if ((n - 1) % step !== 0) {
                const span = document.createElement('span');
                span.textContent = labelSet[n - 1];
                xLabels.appendChild(span);
            }

            // Tooltip references
            const ttMonth = tooltip ? tooltip.querySelector('.tt-month') : null;
            const ttPartnerVal = tooltip ? tooltip.querySelector('.tt-row.tt-partners .tt-value') : null;
            const ttParticipantVal = tooltip ? tooltip.querySelector('.tt-row.tt-participants .tt-value') : null;

            function showTooltip(i) {
                if (!tooltip || !ttMonth) return;
                ttMonth.textContent = labelSet[i];
                if (ttPartnerVal) ttPartnerVal.textContent = formatNumber(data.partners[i]);
                if (ttParticipantVal) ttParticipantVal.textContent = formatNumber(data.participants[i]);
                // Position over the data point
                const wrap = svg.parentElement;
                const wrapRect = wrap.getBoundingClientRect();
                const svgRect = svg.getBoundingClientRect();
                const scaleX = svgRect.width / VB_W;
                const scaleY = svgRect.height / VB_H;
                const cx = partnerPts[i][0] * scaleX + (svgRect.left - wrapRect.left);
                const cy = partnerPts[i][1] * scaleY + (svgRect.top - wrapRect.top);
                tooltip.style.left = cx + 'px';
                tooltip.style.top = cy + 'px';
                tooltip.classList.add('is-visible');
                tooltip.setAttribute('aria-hidden', 'false');
                // Highlight nearest dots
                svg.querySelectorAll('circle.data-dot').forEach(function (c) {
                    c.classList.toggle('is-active', parseInt(c.dataset.index, 10) === i);
                });
                svg.querySelectorAll('rect.hover-target').forEach(function (r) {
                    r.classList.toggle('is-active', parseInt(r.dataset.index, 10) === i);
                });
            }

            function hideTooltip() {
                if (!tooltip) return;
                tooltip.classList.remove('is-visible');
                tooltip.setAttribute('aria-hidden', 'true');
                svg.querySelectorAll('circle.data-dot').forEach(function (c) {
                    c.classList.remove('is-active');
                });
                svg.querySelectorAll('rect.hover-target').forEach(function (r) {
                    r.classList.remove('is-active');
                });
            }

            // Attach hover handlers
            svg.querySelectorAll('rect.hover-target').forEach(function (rect) {
                rect.addEventListener('mouseenter', function () {
                    showTooltip(parseInt(this.dataset.index, 10));
                });
                rect.addEventListener('mouseleave', hideTooltip);
                rect.addEventListener('touchstart', function (e) {
                    showTooltip(parseInt(this.dataset.index, 10));
                }, { passive: true });
            });
            svg.querySelectorAll('circle.data-dot').forEach(function (c) {
                c.addEventListener('mouseenter', function () {
                    showTooltip(parseInt(this.dataset.index, 10));
                });
                c.addEventListener('mouseleave', hideTooltip);
            });

            // Animate
            if (animate) {
                // Reset state
                svg.classList.remove('is-drawn');
                // Force reflow so the transition can replay
                void svg.getBoundingClientRect();
                requestAnimationFrame(function () {
                    svg.classList.add('is-drawn');
                });
            } else {
                svg.classList.add('is-drawn');
            }
        }

        // Filter pills
        filter.querySelectorAll('[data-range]').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const range = this.getAttribute('data-range');
                if (!range || range === currentRange) return;
                filter.querySelectorAll('[data-range]').forEach(function (b) {
                    b.classList.toggle('active', b === btn);
                });
                currentRange = range;
                render(range, true);
            });
        });

        // ---- KPI Counters ----
        function animateCounter(el) {
            if (el.dataset.counted === '1') return;
            el.dataset.counted = '1';
            const target = parseInt(el.getAttribute('data-target'), 10) || 0;
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = 1400;
            const start = performance.now();
            function tick(now) {
                const elapsed = now - start;
                const t = Math.min(elapsed / duration, 1);
                // easeOutCubic
                const eased = 1 - Math.pow(1 - t, 3);
                const val = Math.round(target * eased);
                el.textContent = formatNumber(val) + suffix;
                if (t < 1) {
                    requestAnimationFrame(tick);
                } else {
                    el.textContent = formatNumber(target) + suffix;
                }
            }
            requestAnimationFrame(tick);
        }

        function initCounters() {
            const kpis = section.querySelectorAll('.kpi-value');
            if (!('IntersectionObserver' in window)) {
                kpis.forEach(animateCounter);
                return;
            }
            const obs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            kpis.forEach(function (el) { obs.observe(el); });
        }

        // ---- Initial draw when section becomes visible ----
        function initGraph() {
            render(currentRange, false);
            if ('IntersectionObserver' in window) {
                const obs = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting && !hasAnimated) {
                            hasAnimated = true;
                            // Re-trigger draw animation
                            svg.classList.remove('is-drawn');
                            void svg.getBoundingClientRect();
                            requestAnimationFrame(function () {
                                svg.classList.add('is-drawn');
                            });
                            obs.disconnect();
                        }
                    });
                }, { threshold: 0.2 });
                obs.observe(section);
            }
        }

        initCounters();
        initGraph();

        // Re-translate X labels when language changes
        document.addEventListener('languagechange', function () {
            render(currentRange, false);
        });
    }

    // Re-render labels when the language switcher runs (it has no
    // event of its own, so we hook into the same localStorage write
    // by polling the lang label).
    const langLabel = document.getElementById('currentLangLabel');
    if (langLabel) {
        const obs = new MutationObserver(function () {
            document.dispatchEvent(new Event('languagechange'));
        });
        obs.observe(langLabel, { childList: true, characterData: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
