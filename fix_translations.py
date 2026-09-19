import os
import json
import re

with open('messages/en.json', 'r', encoding='utf-8') as f:
    en_dict = json.load(f)

def get_translation(namespace, key):
    val = en_dict.get(namespace, {})
    for part in key.split('.'):
        if part in val:
            val = val[part]
        else:
            return key
    if isinstance(val, str):
        return val
    return key

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove next-intl imports
    content = re.sub(r'import\s+\{.*\}\s+from\s+[\'"]next-intl(/server)?[\'"];\n?', '', content)
    
    # Remove useTranslations hook declarations
    content = re.sub(r'const\s+t\s*=\s*useTranslations\(\s*[\'"]([^\'"]+)[\'"]\s*\);\n?', '', content)
    content = re.sub(r'const\s+t\s*=\s*await\s+getTranslations\(\s*[\'"]([^\'"]+)[\'"]\s*\);\n?', '', content)

    # JSX: {t("key")}
    def replacer_jsx(match):
        key = match.group(1)
        val = key
        for ns in en_dict:
            res = get_translation(ns, key)
            if res != key:
                val = res
                break
        return f'"{val}"'
        
    content = re.sub(r'\{t\([\'"]([^\'"]+)[\'"]\)\}', replacer_jsx, content)
    
    # Raw function call: t("key") (must ensure word boundary or whitespace/punctuation before)
    # Using \b to match word boundary so get("foo") is NOT matched.
    def replacer_str(match):
        key = match.group(1)
        val = key
        for ns in en_dict:
            res = get_translation(ns, key)
            if res != key:
                val = res
                break
        return f'"{val}"'
        
    content = re.sub(r'\bt\([\'"]([^\'"]+)[\'"]\)', replacer_str, content)
    
    # Sometimes it's useLocale()
    content = re.sub(r'const\s+locale\s*=\s*useLocale\(\);\n?', '', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, _, files in os.walk('app'):
    for f in files:
        if f.endswith('.tsx') or f.endswith('.ts'):
            replace_in_file(os.path.join(root, f))
            
for root, _, files in os.walk('components'):
    for f in files:
        if f.endswith('.tsx') or f.endswith('.ts'):
            replace_in_file(os.path.join(root, f))
