import os
import re

replacements = {
    'app/admin/login/page.tsx': [
        ('"Check Out Our Games"', 'Admin Login'),
        ('"Sign in to manage the studio dashboard."', 'Sign in to manage the studio dashboard.'),
        ('"Your email"', 'Email'),
        ('"Password"', 'Password'),
        ('"Sign in"', 'Sign in')
    ],
    'components/home/AboutSection.tsx': [
        ('"About"', 'About'),
        ('"INDIE GAME DEVELOPERS"', 'INDIE GAME DEVELOPERS')
    ],
    'app/(main)/contact/page.tsx': [
        ('"Check Out Our Games"', 'Contact Us'),
        ('"Say Hello"', 'Say Hello'),
        ('"General questions, fan mail"', 'General questions, fan mail'),
        ('"Business Inquiries"', 'Business Inquiries'),
        ('"Partnerships, press, publishing"', 'Partnerships, press, publishing')
    ],
    'app/(main)/not-found.tsx': [
        ('"Achievements"', '404'),
        ('"Check Out Our Games"', 'Page Not Found'),
        ('"Looks like you\'re lost. Maybe this page got caught in a joke that went too far."', "Looks like you're lost. Maybe this page got caught in a joke that went too far."),
        ('"The page you\'re looking for doesn\'t exist or may have been moved."', "The page you're looking for doesn't exist or may have been moved."),
        ('"Back to Home"', 'Back to Home'),
        ('"View Our Games"', 'View Our Games')
    ],
    'app/(main)/press/page.tsx': [
        ('"Press Kit"', 'Press Kit')
    ],
    'components/achievements/AchievementCTA.tsx': [
        ('"Achievements"', 'Achievements')
    ]
}

for filepath, reps in replacements.items():
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    for old, new in reps:
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
