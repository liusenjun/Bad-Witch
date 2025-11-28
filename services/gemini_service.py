"""
Gemini Service - AI Integration for object analysis and image generation
"""

import json
import urllib.request
import urllib.parse
import random
import io
import base64
from PIL import Image


def analyze_object_and_suggest_names(base64_image: str, api_key: str) -> dict:
    """Analyze an image using Gemini API and suggest familiar names"""
    if not api_key:
        return {
            'originalItem': 'Mystery Object',
            'species': 'Shadow Creature',
            'suggestedNames': ['Umbra', 'Shade', 'Echo'],
            'description': 'A mysterious creature formed from the void.'
        }
    
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
        
        prompt = """You are a mystical witch in a fantasy world.
Analyze this image of a real-world object.
1. Identify the object.
2. Determine what kind of magical animal familiar this object should transform into based on its shape, color, or vibe.
3. Generate 3 mystical, whimsical names for this familiar.
4. Provide a short, magical description of the familiar.

Return JSON with these exact fields:
{
    "originalItem": "name of the object",
    "species": "type of magical animal",
    "suggestedNames": ["Name1", "Name2", "Name3"],
    "description": "magical description"
}"""
        
        payload = {
            "contents": [{
                "parts": [
                    {"inlineData": {"mimeType": "image/jpeg", "data": base64_image}},
                    {"text": prompt}
                ]
            }],
            "generationConfig": {"responseMimeType": "application/json"}
        }
        
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
        
        with urllib.request.urlopen(req, timeout=30) as response:
            result = json.loads(response.read().decode('utf-8'))
            text = result['candidates'][0]['content']['parts'][0]['text']
            return json.loads(text)
    
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return {
            'originalItem': 'Mystery Object',
            'species': 'Shadow Creature',
            'suggestedNames': ['Umbra', 'Shade', 'Echo'],
            'description': 'A mysterious creature formed from the void.'
        }


def generate_familiar_image(species: str, description: str, api_key: str = None) -> str:
    """Generate a familiar image using Gemini 2.0 Flash (experimental image generation)"""
    prompt = f"""Generate an image of: A high quality, magical 2D game asset art of a {species}.
Description: {description}.
Style: Cute, mystical, vibrant colors, fantasy art style, stickers, white background.
The creature should look like a familiar companion.""".strip()
    
    # If no API key, fallback to Pollinations.ai
    if not api_key:
        print("No API key provided, using Pollinations.ai")
        return _fallback_pollinations(species, prompt)
    
    # Try Gemini 2.0 Flash experimental image generation
    try:
        print(f"Calling Gemini 2.0 Flash for image generation...")
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key={api_key}"
        
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "responseModalities": ["TEXT", "IMAGE"]
            }
        }
        
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
        
        with urllib.request.urlopen(req, timeout=90) as response:
            result = json.loads(response.read().decode('utf-8'))
            print(f"Gemini response received")
            
            # Check for image in response
            if 'candidates' in result and len(result['candidates']) > 0:
                parts = result['candidates'][0].get('content', {}).get('parts', [])
                for part in parts:
                    if 'inlineData' in part:
                        mime_type = part['inlineData'].get('mimeType', 'image/png')
                        image_base64 = part['inlineData'].get('data', '')
                        if image_base64:
                            print("Successfully generated image with Gemini")
                            return f"data:{mime_type};base64,{image_base64}"
            
            print(f"No image in Gemini response, trying fallback...")
            raise Exception("No image in response")
            
    except Exception as e:
        print(f"Gemini Image Generation Error: {e}")
        return _fallback_pollinations(species, prompt)


def _fallback_pollinations(species: str, prompt: str) -> str:
    """Fallback to Pollinations.ai for image generation"""
    print("Using Pollinations.ai fallback")
    try:
        encoded_prompt = urllib.parse.quote(prompt)
        seed = random.randint(0, 1000000)
        return f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=512&height=512&seed={seed}&nologo=true"
    except Exception as e:
        print(f"Pollinations error: {e}")
        return f"https://picsum.photos/seed/{urllib.parse.quote(species)}/512/512"


def remove_white_background(image_url: str, threshold: int = 240, tolerance: int = 30) -> str:
    """
    Download an image from URL and remove white/light background, return as base64 PNG with transparency.
    
    Args:
        image_url: URL of the image to process
        threshold: Brightness threshold (0-255) above which pixels are considered "white"
        tolerance: How much variation from pure white to allow
    
    Returns:
        Base64 encoded PNG string with transparent background
    """
    try:
        # Download image from URL
        req = urllib.request.Request(image_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=30) as response:
            image_data = response.read()
        
        # Open image with PIL
        img = Image.open(io.BytesIO(image_data))
        img = img.convert('RGBA')
        
        # Get pixel data
        pixels = img.load()
        width, height = img.size
        
        # Process each pixel
        for y in range(height):
            for x in range(width):
                r, g, b, a = pixels[x, y]
                
                # Calculate if pixel is "white-ish"
                # Check if all RGB values are above threshold and close to each other
                is_bright = r > threshold and g > threshold and b > threshold
                is_neutral = abs(r - g) < tolerance and abs(g - b) < tolerance and abs(r - b) < tolerance
                
                if is_bright and is_neutral:
                    # Make transparent
                    pixels[x, y] = (r, g, b, 0)
                else:
                    # Keep original with full opacity
                    pixels[x, y] = (r, g, b, 255)
        
        # Apply edge smoothing (anti-aliasing for semi-transparent edges)
        img = smooth_edges(img)
        
        # Save to base64
        buffer = io.BytesIO()
        img.save(buffer, format='PNG', optimize=True)
        buffer.seek(0)
        
        base64_str = base64.b64encode(buffer.getvalue()).decode('utf-8')
        return f"data:image/png;base64,{base64_str}"
        
    except Exception as e:
        print(f"Background removal error: {e}")
        return image_url  # Return original URL if processing fails


def smooth_edges(img: Image.Image, passes: int = 2) -> Image.Image:
    """
    Smooth the edges of transparent areas to reduce jagged appearance.
    """
    pixels = img.load()
    width, height = img.size
    
    for _ in range(passes):
        # Create a copy for reading while we write
        new_img = img.copy()
        new_pixels = new_img.load()
        
        for y in range(1, height - 1):
            for x in range(1, width - 1):
                r, g, b, a = pixels[x, y]
                
                # Only process partially transparent or edge pixels
                if 0 < a < 255:
                    # Average alpha with neighbors
                    neighbor_alphas = []
                    for dy in [-1, 0, 1]:
                        for dx in [-1, 0, 1]:
                            if dx == 0 and dy == 0:
                                continue
                            _, _, _, na = pixels[x + dx, y + dy]
                            neighbor_alphas.append(na)
                    
                    avg_alpha = sum(neighbor_alphas) // len(neighbor_alphas)
                    new_alpha = (a + avg_alpha) // 2
                    new_pixels[x, y] = (r, g, b, new_alpha)
        
        img = new_img
        pixels = img.load()
    
    return img
