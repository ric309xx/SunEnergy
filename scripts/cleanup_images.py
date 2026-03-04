import os
import json
import re
import shutil

# Paths
BASE_DIR = r"e:\OneDrive\Antigravity\02_Sun"
IMAGES_DIR = os.path.join(BASE_DIR, "images")
UNUSED_DIR = os.path.join(IMAGES_DIR, "unused")
CASES_JSON = os.path.join(BASE_DIR, "data", "cases.json")
NEWS_JSON = os.path.join(BASE_DIR, "data", "news.json")
INDEX_HTML = os.path.join(BASE_DIR, "index.html")
STYLE_CSS = os.path.join(BASE_DIR, "css", "style.css")
NEWS_DETAIL_HTML = os.path.join(BASE_DIR, "news-detail.html")

def ensure_unused_dir():
    if not os.path.exists(UNUSED_DIR):
        os.makedirs(UNUSED_DIR)

def get_extension(filename):
    return os.path.splitext(filename)[1].lower()

def safe_rename(old_path, new_path):
    if not os.path.exists(old_path):
        return False
    if old_path == new_path:
        return True
    # If the target already exists and is not the same file (e.g. case sensitivity)
    if os.path.exists(new_path) and old_path.casefold() != new_path.casefold():
        # append a random suffix to avoid overwrite
        import uuid
        target_dir = os.path.dirname(new_path)
        base = os.path.basename(new_path)
        name, ext = os.path.splitext(base)
        new_path = os.path.join(target_dir, f"{name}_{uuid.uuid4().hex[:4]}{ext}")
        
    os.rename(old_path, new_path)
    return True

def process_json_and_rename(json_path, prefix):
    if not os.path.exists(json_path):
        return []

    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    used_files = []
    items = data.get("items", [])
    
    for i, item in enumerate(items):
        # determine which attribute holds the image: cases use "image", news use "img"
        img_key = "image" if "image" in item else "img"
        if img_key in item and item[img_key]:
            img_val = item[img_key]
            # Only process local files starting with images/
            if img_val.startswith("images/") or img_val.startswith("images\\"):
                old_filename = os.path.basename(img_val)
                old_path = os.path.join(IMAGES_DIR, old_filename)
                
                # Check if it actually exists in images/
                if os.path.exists(old_path) and not os.path.isdir(old_path):
                    ext = get_extension(old_filename)
                    # Create new filename e.g. case_1.jpg
                    new_filename = f"{prefix}_{i+1:02d}{ext}"
                    new_rel_path = f"images/{new_filename}"
                    new_abs_path = os.path.join(IMAGES_DIR, new_filename)
                    
                    if safe_rename(old_path, new_abs_path):
                        # Update JSON data
                        item[img_key] = new_rel_path
                        used_files.append(new_filename)
                else:
                    # File not found locally, just mark it as used to be safe (if we plan to check nested folders later)
                    used_files.append(old_filename)
            elif img_val.startswith("http"):
                # External url, do nothing
                pass

    # Save modified JSON
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    return used_files

def extract_used_images_from_file(filepath, pattern):
    used = []
    if not os.path.exists(filepath):
        return used
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        matches = re.finditer(pattern, content)
        for m in matches:
            filename = os.path.basename(m.group(1))
            used.append(filename)
    return used

def main():
    ensure_unused_dir()
    
    # 1. Process cases and news, rename local images
    cases_used = process_json_and_rename(CASES_JSON, "case")
    news_used = process_json_and_rename(NEWS_JSON, "news")
    
    # 2. Extract static images from HTML and CSS
    html_used = extract_used_images_from_file(INDEX_HTML, r'src=["\'](?:images/)([^"\']+)["\']')
    html_used += extract_used_images_from_file(NEWS_DETAIL_HTML, r'src=["\'](?:images/)([^"\']+)["\']')
    # CSS uses background url
    css_used = extract_used_images_from_file(STYLE_CSS, r'url\((?:["\']?)?../images/([^"\'\)]+)(?:["\']?)?\)')
    
    # Also we should keep standard names like logo.png, logo2.png, favicon etc.
    essential_files = ["logo.png", "logo2.png", "favicon.ico", "hero.mp4", "head.mp4"]
    
    all_used_filenames = set(cases_used + news_used + html_used + css_used + essential_files)
    
    # 3. Clean up the images directory
    moved_count = 0
    for item in os.listdir(IMAGES_DIR):
        item_path = os.path.join(IMAGES_DIR, item)
        # Skip directories
        if os.path.isdir(item_path):
            continue
            
        # If not uniquely identified as used
        if item not in all_used_filenames:
            dest_path = os.path.join(UNUSED_DIR, item)
            # handle case where unused file with same name already exists
            if os.path.exists(dest_path):
                import time
                dest_path = os.path.join(UNUSED_DIR, f"{time.time()}_{item}")
            shutil.move(item_path, dest_path)
            moved_count += 1
            print(f"Moved unused image: {item}")
            
    print(f"\nCleanup complete. Renamed cases and news images.")
    print(f"Total files moved to 'unused' folder: {moved_count}")

if __name__ == "__main__":
    main()
