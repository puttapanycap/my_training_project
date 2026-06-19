# -*- coding: utf-8 -*-
import os

file_path = r'c:\laragon\www\my_training_project\index.html'

with open(file_path, 'rb') as f:
    raw = f.read()

# Decode and re-encode to ensure UTF-8 consistency
text = raw.decode('utf-8')

# Original button block (with Thai in proper UTF-8)
old_block = '''                        <a class="btn aurora-btn aurora-btn-glow aurora-btn-sm" href="#register"
                            style="background: linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%); box-shadow: 0 8px 24px rgba(6, 182, 212, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.15);">
                            <i class="fas fa-rocket me-1"></i>
                            <span data-i18n="" data-th="สมัครใช้งาน" data-en="Get Started">สมัครใช้งาน</span>
                        </a>'''

new_block = '''                        <a class="btn aurora-btn aurora-btn-rainbow aurora-btn-sm" href="#register">
                            <i class="fas fa-rocket me-1"></i>
                            <span data-i18n data-th="สมัครสมาชิก" data-en="Sign up">สมัครสมาชิก</span>
                        </a>'''

if old_block in text:
    text = text.replace(old_block, new_block)
    with open(file_path, 'wb') as f:
        f.write(text.encode('utf-8'))
    print('OK: navbar CTA button replaced.')
else:
    print('ERROR: old block not found.')
    # Print the surrounding area for debugging
    idx = text.find('aurora-btn-glow aurora-btn-sm')
    if idx >= 0:
        print('--- around index', idx, '---')
        print(repr(text[idx-50:idx+300]))
