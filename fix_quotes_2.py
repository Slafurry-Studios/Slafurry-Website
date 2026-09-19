import os

replacements = {
    'components/home/ProjectCarousel.tsx': [
        ('        "Projects"', '        Projects')
    ],
    'components/home/Hero.tsx': [
        ('            "Indie Game Developers"', '            Indie Game Developers'),
        ('              "Play Our Games"', '              Play Our Games'),
        ('              "Upcoming Project"', '              Upcoming Project')
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
