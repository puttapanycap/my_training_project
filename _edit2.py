# -*- coding: utf-8 -*-
import os

file_path = r'c:\laragon\www\my_training_project\index.html'

with open(file_path, 'rb') as f:
    raw = f.read()

# Try both LF and CRLF
for nl in [b'\r\n', b'\n']:
    raw_variant = raw.replace(b'\r\n', b'\n')  # normalize to LF first
    text = raw_variant.decode('utf-8')
    old_block = '''                                    <!-- Submit -->
                                    <div class="col-12">
                                        <button type="submit" class="btn aurora-btn aurora-btn-primary aurora-btn-glow w-100"
                                            id="registerSubmit">
                                            <span class="spinner" aria-hidden="true"></span>
                                            <i class="fas fa-user-plus me-2 submit-icon"></i>
                                            <span class="submit-text" data-i18n data-th="สมัครสมาชิก"
                                                data-en="Create account">สมัครสมาชิก</span>
                                        </button>
                                    </div>

'''
    if old_block in text:
        new_text = text.replace(old_block, '', 1)
        # Write back with original line endings (CRLF for Windows)
        if nl == b'\r\n':
            new_bytes = new_text.replace('\n', '\r\n').encode('utf-8')
        else:
            new_bytes = new_text.encode('utf-8')
        with open(file_path, 'wb') as f:
            f.write(new_bytes)
        print('OK: submit button removed (using %s).' % ('CRLF' if nl == b'\r\n' else 'LF'))
        break
else:
    print('ERROR: submit block not found.')
    text = raw.decode('utf-8')
    idx = text.find('<!-- Submit -->')
    if idx >= 0:
        print('--- around <!-- Submit --> (idx=%d) ---' % idx)
        print(repr(text[idx:idx+600]))
