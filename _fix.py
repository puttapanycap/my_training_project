# -*- coding: utf-8 -*-
import os

file_path = r'c:\laragon\www\my_training_project\index.html'

with open(file_path, 'rb') as f:
    raw = f.read()

# The corrupted bytes are the Latin-1 interpretation of UTF-8 Thai characters
# Original correct Thai: "สมัครสมาชิก"
# Need to find the corrupted sequence and replace with correct UTF-8

# Corrupted sequence (the partial one in the file)
# "สมัครสมาชิก" in UTF-8 bytes:
correct_thai = 'สมัครสมาชิก'.encode('utf-8')
print('Correct Thai bytes:', correct_thai)
print('Correct Thai length:', len(correct_thai))

# The corrupted Latin-1 chars: à¸ªà¸¡à¸±à¸„à¸£à¸ªà¸¡à¸²à¸Šà¸´à¸
# This is the result of decoding 30 UTF-8 bytes as Latin-1 (missing last byte)
corrupted = 'à¸ªà¸¡à¸±à¸„à¸£à¸ªà¸¡à¸²à¸Šà¸´à¸'
# Encode it back to bytes
corrupted_bytes_partial = corrupted.encode('latin-1')
print('Corrupted bytes (partial, len=%d):' % len(corrupted_bytes_partial), corrupted_bytes_partial)

# The full corrupted version should be the UTF-8 bytes decoded as latin-1
# "สมัครสมาชิก" has 10 chars = 30 UTF-8 bytes
# Decoded as latin-1 = 30 latin-1 chars
full_corrupted = correct_thai.decode('latin-1')
print('Full corrupted (len=%d):' % len(full_corrupted), full_corrupted)

# Search for the corrupted sequence in the file as raw bytes
# Try both the partial and the full patterns
found = False
for pattern_str in [corrupted, full_corrupted]:
    pattern_bytes = pattern_str.encode('latin-1')
    if pattern_bytes in raw:
        print(f'Found pattern of length {len(pattern_str)} chars')
        # Replace
        new_raw = raw.replace(pattern_bytes, correct_thai, 2)  # Replace 2 occurrences (data-th and inner text)
        with open(file_path, 'wb') as f:
            f.write(new_raw)
        found = True
        print('Replaced successfully.')
        break

if not found:
    # Search for the actual corrupted UTF-8 bytes in the file
    # Each Thai char in UTF-8 starts with e0 b8
    # So the pattern is: e0 b8 <byte> repeating
    print('Pattern not found via latin-1. Searching byte-by-byte...')
    # Look for the e0 b8 sequences
    import re
    # Match a sequence of e0 b8 XX patterns
    pattern = re.compile(rb'(?:\xe0\xb8[\x80-\xbf]){5,}')
    matches = pattern.findall(raw)
    print(f'Found {len(matches)} sequences of e0 b8 XX patterns')
    for m in matches[:5]:
        # Decode as latin-1 to see what we got
        try:
            decoded = m.decode('latin-1')
            print(f'  Bytes: {m[:30]}... -> {decoded[:30]}...')
        except:
            pass
