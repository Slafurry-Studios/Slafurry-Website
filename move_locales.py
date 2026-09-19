import os
import shutil

src_dir = 'app/[locale]'
dest_dir = 'app'

if os.path.exists(src_dir):
    for item in os.listdir(src_dir):
        s = os.path.join(src_dir, item)
        d = os.path.join(dest_dir, item)
        if os.path.isdir(s):
            if not os.path.exists(d):
                shutil.move(s, d)
            else:
                # Merge directory contents if it already exists
                for sub_item in os.listdir(s):
                    sub_s = os.path.join(s, sub_item)
                    sub_d = os.path.join(d, sub_item)
                    shutil.move(sub_s, sub_d)
        else:
            shutil.move(s, d)
    
    # Remove the empty [locale] directory
    try:
        shutil.rmtree(src_dir)
    except:
        pass
