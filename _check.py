# -*- coding: utf-8 -*-
import os

file_path = r'c:\laragon\www\my_training_project\index.html'

with open(file_path, 'rb') as f:
    raw = f.read()

# Try UTF-8 decode
try:
    text = raw.decode('utf-8')
    print('UTF-8 decode: OK, length', len(text))
    # Find the navbar button
    idx = text.find('aurora-btn-rainbow')
    if idx >= 0:
        print('--- around aurora-btn-rainbow (idx=%d) ---' % idx)
        print(text[idx-50:idx+250])
except UnicodeDecodeError as e:
    print('UTF-8 decode FAILED:', e)
    # Try to find where the bad bytes are
    # Likely the file is double-encoded: original UTF-8 was decoded as latin-1 then re-encoded
    bad_idx = e.start
    print('Bad bytes around index:', raw[max(0,bad_idx-20):bad_idx+20])
    print('Bad bytes hex:', raw[max(0,bad_idx-20):bad_idx+20].hex())
