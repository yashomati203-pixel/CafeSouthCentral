
from PIL import Image
import sys
import os

def crop_whitespace(image_path):
    try:
        img = Image.open(image_path)
        img = img.convert("RGBA")
        bbox = img.getbbox()
        if bbox:
            cropped_img = img.crop(bbox)
            cropped_img.save(image_path)
            print(f"Successfully cropped {image_path}")
        else:
            print("Image is empty or fully transparent.")
    except Exception as e:
        print(f"Error processing {image_path}: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        crop_whitespace(sys.argv[1])
    else:
        print("Usage: python crop_logo.py <image_path>")
