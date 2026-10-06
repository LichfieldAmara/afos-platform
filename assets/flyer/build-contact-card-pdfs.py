from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / "assets" / "flyer"
OUTPUT = ROOT / "output" / "pdf"
OUTPUT.mkdir(parents=True, exist_ok=True)

FRONT = ASSETS / "afos-contact-card-front.png"
BACK = ASSETS / "afos-contact-card-back.png"
CARD_WIDTH = 90 * mm
CARD_HEIGHT = 55 * mm


def draw_card(c, image, x=0, y=0):
    c.drawImage(str(image), x, y, width=CARD_WIDTH, height=CARD_HEIGHT, mask="auto")


def crop_marks(c, x, y, length=3 * mm, gap=1.5 * mm):
    c.setStrokeColorRGB(0.45, 0.45, 0.45)
    c.setLineWidth(0.25)
    c.line(x - gap - length, y, x - gap, y)
    c.line(x, y - gap - length, x, y - gap)
    c.line(x + CARD_WIDTH + gap, y, x + CARD_WIDTH + gap + length, y)
    c.line(x + CARD_WIDTH, y - gap - length, x + CARD_WIDTH, y - gap)
    c.line(x - gap - length, y + CARD_HEIGHT, x - gap, y + CARD_HEIGHT)
    c.line(x, y + CARD_HEIGHT + gap, x, y + CARD_HEIGHT + gap + length)
    c.line(x + CARD_WIDTH + gap, y + CARD_HEIGHT, x + CARD_WIDTH + gap + length, y + CARD_HEIGHT)
    c.line(x + CARD_WIDTH, y + CARD_HEIGHT + gap, x + CARD_WIDTH, y + CARD_HEIGHT + gap + length)


card_pdf = OUTPUT / "afos-contact-card-90x55mm.pdf"
c = canvas.Canvas(str(card_pdf), pagesize=(CARD_WIDTH, CARD_HEIGHT), pageCompression=1)
c.setTitle("AFOS contact card - 90 x 55 mm")
draw_card(c, FRONT)
c.showPage()
draw_card(c, BACK)
c.showPage()
c.save()


sheet_pdf = OUTPUT / "afos-contact-card-a4-10-up.pdf"
page_width, page_height = A4
grid_width = CARD_WIDTH * 2
grid_height = CARD_HEIGHT * 5
start_x = (page_width - grid_width) / 2
start_y = (page_height - grid_height) / 2

c = canvas.Canvas(str(sheet_pdf), pagesize=A4, pageCompression=1)
c.setTitle("AFOS contact card - A4 ten-up duplex print sheet")
for image in (FRONT, BACK):
    for row in range(5):
        for col in range(2):
            x = start_x + col * CARD_WIDTH
            y = start_y + (4 - row) * CARD_HEIGHT
            draw_card(c, image, x, y)
            crop_marks(c, x, y)
    c.showPage()
c.save()

print(card_pdf)
print(sheet_pdf)
