import os

folders = ['app', 'components']

replacements = [
    ('import { Link } from "@/i18n/navigation";', 'import Link from "next/link";'),
    ('import { useRouter } from "@/i18n/navigation";', 'import { useRouter } from "next/navigation";'),
    ('import { redirect } from "@/i18n/navigation";', 'import { redirect } from "next/navigation";'),
    ('import { Link, usePathname } from "@/i18n/navigation";', 'import Link from "next/link";\nimport { usePathname } from "next/navigation";'),
    ('import { useRouter, Link } from "@/i18n/navigation";', 'import { useRouter } from "next/navigation";\nimport Link from "next/link";'),
    ('import { Link, useRouter } from "@/i18n/navigation";', 'import Link from "next/link";\nimport { useRouter } from "next/navigation";')
]

for folder in folders:
    for root, _, files in os.walk(folder):
        for f in files:
            if f.endswith('.tsx') or f.endswith('.ts'):
                path = os.path.join(root, f)
                with open(path, 'r', encoding='utf-8') as file:
                    content = file.read()
                
                if '@/i18n/navigation' in content:
                    for old, new in replacements:
                        content = content.replace(old, new)
                    
                    with open(path, 'w', encoding='utf-8') as file:
                        file.write(content)
