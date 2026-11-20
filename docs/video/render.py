"""
Vídeo de fundo do Atelier du Pavê: camadas de um pavê (biscoito, creme,
ganache, caramelo) em corte, ondulando devagar, com uma luz quente que passeia.
Loop perfeito: todas as animações usam períodos que dividem T.

Uso:
  python3 render.py frame <t_segundos> <saida.png>
  python3 render.py video <saida.mp4>   (escreve frames brutos no stdout do ffmpeg)
"""
import sys, subprocess
import numpy as np
from PIL import Image

W, H = 1920, 1080
FPS = 30
T = 16.0  # duração do loop em segundos
N = int(T * FPS)

TAU = 2 * np.pi


def hex2rgb(h):
    h = h.lstrip('#')
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], dtype=np.float32) / 255.0


# De cima para baixo: fundo, e cada camada abaixo da sua borda superior.
BG_TOP = hex2rgb('#140d0b')
BG_BOTTOM = hex2rgb('#24160f')
LAYERS = [
    # (y base em fração da altura, cor topo, cor base, amplitude px, fase, brilho da borda)
    (0.38, '#e9dccb', '#cdb79c', 26, 0.0, 0.55),   # creme de baunilha
    (0.50, '#3b241c', '#2a1913', 22, 1.7, 0.25),   # ganache
    (0.58, '#c39066', '#9c6c48', 18, 3.1, 0.45),   # biscoito / caramelo
    (0.68, '#f1e6d6', '#d9c6ab', 24, 4.4, 0.55),   # creme
    (0.79, '#4a2e24', '#2f1c15', 20, 5.6, 0.25),   # chocolate
    (0.89, '#b98559', '#8f6240', 16, 0.9, 0.40),   # biscoito
]
LAYERS = [(y, hex2rgb(a), hex2rgb(b), amp, ph, gl) for y, a, b, amp, ph, gl in LAYERS]

xs = np.linspace(0, 1, W, dtype=np.float32)
ys = np.arange(H, dtype=np.float32)[:, None]

rng = np.random.default_rng(7)
# Grão fixo (não muda por frame: mantém o vídeo leve e sem "chiado").
GRAIN = (rng.standard_normal((H, W)).astype(np.float32) * 0.012)[..., None]

# Partículas de cacau em pó que sobem devagar (posições em loop).
P = 70
px0 = rng.random(P).astype(np.float32)
py0 = rng.random(P).astype(np.float32)
pr = (rng.random(P) * 2.2 + 0.8).astype(np.float32)
pa = (rng.random(P) * 0.25 + 0.08).astype(np.float32)
pdrift = rng.integers(1, 3, P)  # quantas vezes atravessa a tela por loop


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def boundary(y_base, amp, phase, t):
    """Borda superior ondulada de uma camada, em pixels, para cada coluna."""
    p = TAU * t / T
    y = (y_base * H
         + amp * np.sin(TAU * 1.0 * xs + phase + p)
         + amp * 0.55 * np.sin(TAU * 2.0 * xs - phase * 1.3 - 2 * p)
         + amp * 0.25 * np.sin(TAU * 3.0 * xs + phase * 0.7 + 3 * p))
    # Inclinação suave que respira: dá profundidade de "corte" visto em ângulo.
    y += (xs - 0.5) * 40 * np.sin(p + phase * 0.3)
    return y[None, :]


def render(t):
    # Fundo em degradê vertical.
    v = (ys / H)[..., None]
    img = BG_TOP * (1 - v) + BG_BOTTOM * v
    img = np.broadcast_to(img, (H, W, 3)).copy()

    for y_base, c_top, c_bot, amp, phase, glow in LAYERS:
        b = boundary(y_base, amp, phase, t)
        inside = smoothstep(b - 1.2, b + 1.2, ys)[..., None]          # máscara com antialias
        depth = np.clip((ys - b) / (H * 0.16), 0, 1)[..., None]       # 0 na borda -> 1 embaixo
        color = c_top * (1 - depth) + c_bot * depth
        # Brilho cremoso logo abaixo da borda e sombra suave logo acima.
        rim = np.exp(-np.clip(ys - b, 0, None) / 5.0)[..., None] * glow * 0.35
        color = color + rim
        shadow = (np.exp(-np.clip(b - ys, 0, None) / 18.0) * (ys < b))[..., None] * 0.35
        img = img * (1 - shadow * (1 - inside))
        img = img * (1 - inside) + color * inside

    # Luz quente que passeia numa elipse.
    p = TAU * t / T
    lx, ly = 0.5 + 0.28 * np.cos(p), 0.42 + 0.12 * np.sin(p)
    dx = xs[None, :] - lx
    dy = ys / H - ly
    light = np.exp(-(dx * dx * 1.0 + dy * dy * 3.2) / 0.08)[..., None]
    img = img * (0.72 + 0.42 * light) + hex2rgb('#ffcf9a') * light * 0.06

    # Partículas de cacau.
    for i in range(P):
        x = (px0[i] + 0.015 * np.sin(p * 2 + i)) % 1.0
        y = (py0[i] - pdrift[i] * t / T) % 1.0
        cx, cy = x * W, y * H
        r = pr[i]
        x0, x1 = int(max(cx - 6, 0)), int(min(cx + 7, W))
        y0, y1 = int(max(cy - 6, 0)), int(min(cy + 7, H))
        if x0 >= x1 or y0 >= y1:
            continue
        gx = np.arange(x0, x1, dtype=np.float32)[None, :] - cx
        gy = np.arange(y0, y1, dtype=np.float32)[:, None] - cy
        d = np.exp(-(gx * gx + gy * gy) / (2 * r * r))[..., None] * pa[i]
        img[y0:y1, x0:x1] = img[y0:y1, x0:x1] * (1 - d) + hex2rgb('#f3dcc0') * d

    # Vinheta.
    vx = (xs[None, :] - 0.5) * 1.6
    vy = (ys / H - 0.5) * 1.9
    vig = np.clip(1 - (vx * vx + vy * vy) * 0.55, 0.35, 1)[..., None]
    img = img * vig + GRAIN

    return (np.clip(img, 0, 1) * 255 + 0.5).astype(np.uint8)


def main():
    mode = sys.argv[1]
    if mode == 'frame':
        Image.fromarray(render(float(sys.argv[2]))).save(sys.argv[3])
        return
    out = sys.argv[2]
    tmp = out[:-4] + '.part.mp4'
    cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
           '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
           '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '26', '-pix_fmt', 'yuv420p',
           '-movflags', '+faststart', '-an', tmp]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for f in range(N):
        proc.stdin.write(render(f / FPS).tobytes())
    proc.stdin.close()
    if proc.wait() == 0:
        import os
        os.replace(tmp, out)


if __name__ == '__main__':
    main()
