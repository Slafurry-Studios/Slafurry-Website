import os
import re

files_to_edit = [
    'app/(main)/games/page.tsx',
    'components/achievements/AchievementCTA.tsx',
    'components/games/GameCard.tsx',
    'components/home/AboutSection.tsx',
    'components/home/CommunityContact.tsx',
    'components/home/NewsPreview.tsx',
    'components/layout/Navbar.tsx',
    'components/posts/ArticleReader.tsx',
    'components/posts/PostCard.tsx'
]

for filepath in files_to_edit:
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # app/(main)/games/page.tsx: getTranslations
    content = content.replace('const t = await getTranslations("games");\n', '')
    
    # components/achievements/AchievementCTA.tsx
    content = content.replace('{t("achievements.redeemCode")}', 'Got a code?')
    content = content.replace('{t("achievements.redeem")}', 'Redeem')
    
    # components/games/GameCard.tsx
    content = content.replace('{t("games.status." + game.status)}', '{game.status}')
    
    # components/home/AboutSection.tsx
    content = content.replace(', locale', '')
    
    # components/home/CommunityContact.tsx
    content = content.replace('const t = useTranslations("home");\n', '')
    content = content.replace('{t("joinCommunity")}', 'Join Our Community')
    content = content.replace('{t("contactUs")}', 'Contact Us')
    
    # components/home/NewsPreview.tsx
    content = content.replace('const t = useTranslations("home");\n', '')
    content = content.replace('{t("news")}', 'News')
    content = content.replace(', locale', '')
    
    # components/layout/Navbar.tsx
    content = content.replace('{t(item.key)}', '{item.key.charAt(0).toUpperCase() + item.key.slice(1)}')
    
    # components/posts/ArticleReader.tsx
    content = content.replace(', locale', '')
    
    # components/posts/PostCard.tsx
    content = content.replace(', locale', '')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
