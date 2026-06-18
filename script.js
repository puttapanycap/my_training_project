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
