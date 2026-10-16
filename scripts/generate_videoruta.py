import os
import subprocess
from PIL import Image, ImageDraw, ImageFont

SCENES = [
    {
        "img": "/media/Datos/Cumana Cnecta3.0/public/video-assets/scene1.jpg",
        "duration": 13,
        "title": "SALIDA: REDOMA DE EL PEÑÓN",
        "sub": "Toma Panorámica Dron 4K · Golfo de Cariaco",
        "turn": "INICIO DE RUTA · RUMBO OESTE HACIA LA COSTA",
        "kmh": "38 km/h",
        "zoom": "in"
    },
    {
        "img": "/media/Datos/Cumana Cnecta3.0/public/video-assets/scene2.jpg",
        "duration": 13,
        "title": "TRAMO COSTERO: AV. CARÚPANO",
        "sub": "Bordeando la Bahía · Tráfico Fluido",
        "turn": "CONTINÚA 1.2 KM RECTO POR LA AVENIDA",
        "kmh": "52 km/h",
        "zoom": "out"
    },
    {
        "img": "/media/Datos/Cumana Cnecta3.0/public/video-assets/scene3.jpg",
        "duration": 13,
        "title": "REFERENCIA CLAVE: CRUCE AL BALNEARIO",
        "sub": "Aviso Comercial Visible a Mano Derecha",
        "turn": "GIRO A LA DERECHA EN EL FARO MARINO",
        "kmh": "25 km/h",
        "zoom": "in"
    },
    {
        "img": "/media/Datos/Cumana Cnecta3.0/public/video-assets/scene4.jpg",
        "duration": 13,
        "title": "LLEGADA: LA TERRAZA DEL GOLFO",
        "sub": "Estacionamiento VIP · Respaldo Eléctrico Activo",
        "turn": "DESTINO ALCANZADO · ENTRADA Y CAJA",
        "kmh": "10 km/h",
        "zoom": "out"
    }
]

OUT_DIR = "/media/Datos/Cumana Cnecta3.0/public/video-assets"
FINAL_VIDEO = "/media/Datos/Cumana Cnecta3.0/public/sample-videoruta.mp4"
FONT_BOLD_PATH = "/usr/share/fonts/liberation/LiberationSans-Bold.ttf"
FONT_REG_PATH = "/usr/share/fonts/liberation/LiberationSans-Regular.ttf"

font_title = ImageFont.truetype(FONT_BOLD_PATH, 28)
font_sub = ImageFont.truetype(FONT_REG_PATH, 19)
font_turn = ImageFont.truetype(FONT_BOLD_PATH, 22)
font_badge = ImageFont.truetype(FONT_BOLD_PATH, 16)
font_meta = ImageFont.truetype(FONT_REG_PATH, 17)
font_hud = ImageFont.truetype(FONT_BOLD_PATH, 20)

W, H = 720, 1280

clip_files = []

for i, sc in enumerate(SCENES):
    # Crear overlay PNG transparente
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # 1. Top banner
    draw.rectangle([(0, 0), (W, 160)], fill=(10, 15, 25, 210))
    # Red REC badge
    draw.rounded_rectangle([(30, 24), (280, 60)], radius=8, fill=(235, 30, 30, 230))
    draw.text((45, 32), "● REC  VIDEO-RUTA 4K", font=font_badge, fill=(255, 255, 255, 255))
    # Verified badge
    draw.rounded_rectangle([(295, 24), (690, 60)], radius=8, fill=(0, 137, 102, 230))
    draw.text((310, 32), "✓ VERIFICADO OFICIAL CUMANÁ", font=font_badge, fill=(255, 255, 255, 255))
    
    # Coordinates & Brand
    draw.text((32, 75), "GPS: 10.4539° N, 64.1826° W · GOLFO DE CARIACO", font=font_meta, fill=(180, 195, 215, 255))
    draw.text((32, 108), f"VELOCIDAD: {sc['kmh']}", font=font_hud, fill=(0, 194, 146, 255))
    draw.text((460, 105), "CUMANÁ CONECTA", font=font_hud, fill=(255, 107, 74, 255))

    # 2. Turn-by-turn banner (middle-lower)
    draw.rounded_rectangle([(24, 910), (696, 995)], radius=16, fill=(19, 31, 51, 235), outline=(255, 107, 74, 180), width=2)
    draw.rounded_rectangle([(24, 910), (36, 995)], radius=8, fill=(255, 107, 74, 255))
    draw.text((50, 922), "INDICACIÓN EN VIVO:", font=font_badge, fill=(255, 107, 74, 255))
    draw.text((50, 952), sc["turn"], font=font_turn, fill=(255, 255, 255, 255))

    # 3. Milestone Card (bottom)
    draw.rounded_rectangle([(24, 1015), (696, 1220)], radius=20, fill=(10, 14, 24, 230), outline=(30, 45, 69, 200), width=2)
    # Highlight bar
    draw.rounded_rectangle([(24, 1015), (696, 1022)], radius=4, fill=(0, 194, 146, 255))
    draw.text((45, 1035), f"HITO {i+1} DE 4 · RUTA VERIFICADA EN 52s", font=font_badge, fill=(0, 194, 146, 255))
    draw.text((45, 1068), sc["title"], font=font_title, fill=(255, 255, 255, 255))
    draw.text((45, 1115), sc["sub"], font=font_sub, fill=(215, 225, 240, 255))
    draw.text((45, 1158), "📍 La Terraza del Golfo · El Peñón, Cumaná", font=font_badge, fill=(255, 170, 60, 255))

    # 4. Progress bar at bottom
    draw.rectangle([(0, 1265), (W, 1280)], fill=(20, 25, 35, 255))
    prog_w = int((i + 1) * (W / 4))
    draw.rectangle([(0, 1265), (prog_w, 1280)], fill=(255, 107, 74, 255))

    overlay_path = f"{OUT_DIR}/overlay_{i}.png"
    overlay.save(overlay_path)

    # Generar clip con ffmpeg
    out_clip = f"{OUT_DIR}/clip_{i}.mp4"
    dur = sc["duration"]
    total_frames = dur * 25
    zoom_expr = "min(zoom+0.0012,1.20)" if sc["zoom"] == "in" else "max(1.20-0.0012,1.0)"

    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", sc["img"],
        "-i", overlay_path,
        "-filter_complex",
        f"[0:v]scale=1280:2276,zoompan=z='{zoom_expr}':d={total_frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=720x1280:fps=25[bg];"
        f"[bg][1:v]overlay=0:0[v]",
        "-map", "[v]",
        "-t", str(dur),
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "veryfast",
        out_clip
    ]
    print(f"Renderizando Escena {i+1}/4 ({dur}s)...")
    subprocess.run(cmd, check=True)
    clip_files.append(out_clip)

# Concatenar los 4 clips con audio
concat_list = f"{OUT_DIR}/concat_list.txt"
with open(concat_list, "w") as f:
    for c in clip_files:
        f.write(f"file '{c}'\n")

print("Generando audio sintetizado y archivo maestro MP4...")
audio_filter = "sine=frequency=130:duration=52,volume=0.25,tremolo=f=2:d=0.7"

cmd_concat = [
    "ffmpeg", "-y",
    "-f", "concat", "-safe", "0", "-i", concat_list,
    "-f", "lavfi", "-i", audio_filter,
    "-c:v", "libx264",
    "-preset", "veryfast",
    "-c:a", "aac",
    "-b:a", "128k",
    "-pix_fmt", "yuv420p",
    "-shortest",
    FINAL_VIDEO
]
subprocess.run(cmd_concat, check=True)
print(f"✓ Video oficial completado con éxito: {FINAL_VIDEO}")
