# -*- coding: utf-8 -*-
file_path = r'c:\laragon\www\my_training_project\styles.css'

with open(file_path, 'rb') as f:
    raw = f.read()

# Normalize to LF
normalized = raw.replace(b'\r\n', b'\n')
text = normalized.decode('utf-8')

# CSS to insert
rainbow_css = '''
/* ==================== RAINBOW BUTTON (signature CTA) ==================== */
/* Animated multi-color gradient with a sweeping sheen ("lighting") overlay.
   Tuned to look vivid in both dark and light themes. Uses the same
   aurora-palette hex values already established in the codebase. */
.aurora-btn-rainbow {
    position: relative;
    overflow: hidden;
    isolation: isolate;
    color: #fff !important;
    border-color: transparent;
    background: linear-gradient(
        110deg,
        #ec4899 0%,
        /* pink   */
        #a855f7 16%,
        /* violet */
        #6366f1 32%,
        /* indigo */
        #06b6d4 48%,
        /* cyan   */
        #10b981 64%,
        /* green  */
        #fbbf24 80%,
        /* amber  */
        #ec4899 100%
        /* loop back to pink */
    );
    background-size: 280% 100%;
    background-position: 0% 50%;
    box-shadow:
        0 8px 24px rgba(236, 72, 153, 0.45),
        0 0 28px rgba(124, 58, 237, 0.28),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
    animation: rainbowShift 6s linear infinite;
}

/* Sweeping light highlight ("lighting" pass) */
.aurora-btn-rainbow::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
        100deg,
        transparent 30%,
        rgba(255, 255, 255, 0.45) 50%,
        transparent 70%
    );
    background-size: 250% 100%;
    background-position: 200% 0;
    pointer-events: none;
    mix-blend-mode: overlay;
    animation: rainbowSheen 2.8s linear infinite;
    z-index: 0;
}

/* Keep button content above the sheen */
.aurora-btn-rainbow > * {
    position: relative;
    z-index: 1;
}

.aurora-btn-rainbow:hover {
    transform: translateY(-2px);
    color: #fff !important;
    box-shadow:
        0 14px 36px rgba(236, 72, 153, 0.55),
        0 0 40px rgba(124, 58, 237, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.4);
    animation-duration: 3s;
}

.aurora-btn-rainbow:hover::before {
    animation-duration: 1.4s;
}

.aurora-btn-rainbow:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 3px;
}

@keyframes rainbowShift {
    0% {
        background-position: 0% 50%;
    }

    100% {
        background-position: 280% 50%;
    }
}

@keyframes rainbowSheen {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -100% 0;
    }
}

@media (prefers-reduced-motion: reduce) {
    .aurora-btn-rainbow,
    .aurora-btn-rainbow::before {
        animation: none !important;
    }

    .aurora-btn-rainbow {
        background-size: 100% 100%;
    }
}
'''

# Insertion anchor: just before the LANGUAGE SWITCHER section
anchor = '/* ==================== LANGUAGE SWITCHER ==================== */'

if anchor in text and '.aurora-btn-rainbow' not in text:
    text = text.replace(anchor, rainbow_css + '\n' + anchor, 1)
    # Restore CRLF for Windows consistency
    new_bytes = text.replace('\n', '\r\n').encode('utf-8')
    with open(file_path, 'wb') as f:
        f.write(new_bytes)
    print('OK: rainbow CSS inserted (CRLF).')
elif '.aurora-btn-rainbow' in text:
    print('SKIP: rainbow CSS already present.')
else:
    print('ERROR: anchor not found.')
