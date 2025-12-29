// app/api/user/vrkp-card/route.ts
import { createCanvas, loadImage, registerFont } from "canvas";
import type { CanvasRenderingContext2D as NodeCanvasRenderingContext2D } from "canvas";
import sharp from "sharp";
import { NextResponse } from "next/server";

import path from "path";
import fs from "fs";

export const runtime = "nodejs";

function mustExist(p: string) {
	if (!fs.existsSync(p)) throw new Error(`Font file not found at: ${p}`);
}

// 👉 Resolve relative to this app's CWD (the app root at runtime)
const REGULAR_PATH = path.join(
	process.cwd(),
	"public",
	"fonts",
	"static",
	"Inter_28pt-Regular.ttf"
);
const BOLD_PATH = path.join(
	process.cwd(),
	"public",
	"fonts",
	"static",
	"Inter_28pt-Bold.ttf"
);

console.log("[font] regular:", REGULAR_PATH);
console.log("[font] bold   :", BOLD_PATH);

mustExist(REGULAR_PATH);
mustExist(BOLD_PATH);

registerFont(REGULAR_PATH, { family: "Inter" });
registerFont(BOLD_PATH, { family: "Inter", weight: "bold" });

type Body = {
	vrkpid: string;
	name: string;
	dob: string;
	createdAt: string;
	issuedAt: string;
};

// (unused now; kept for future)
function drawRoundedImage(
	ctx: NodeCanvasRenderingContext2D,
	img: any,
	x: number,
	y: number,
	w: number,
	h: number,
	r = 28
) {
	ctx.save();
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.lineTo(x + w - r, y);
	ctx.quadraticCurveTo(x + w, y, x + w, y + r);
	ctx.lineTo(x + w, y + h - r);
	ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
	ctx.lineTo(x + r, y + h);
	ctx.quadraticCurveTo(x, y + h, x, y + h - r);
	ctx.lineTo(x, y + r);
	ctx.quadraticCurveTo(x, y, x + r, y);
	ctx.closePath();
	ctx.clip();

	ctx.shadowColor = "rgba(0,0,0,0.18)";
	ctx.shadowBlur = 12;
	ctx.drawImage(img, x, y, w, h);

	ctx.restore();

	ctx.lineWidth = 6;
	ctx.strokeStyle = "rgba(255,255,255,0.9)";
	ctx.stroke();
}

// ----------------------
// Fonts + helpers
// ----------------------
const LABEL_PX = 60; // bold label size
const VALUE_PX = 64; // bold value size
const ISSUED_PX = 50;

function setFont(
	ctx: CanvasRenderingContext2D,
	px: number,
	weight: number = 700,
	family = "Inter"
) {
	ctx.font = `${weight} ${px}px ${family}`;
}

function fits(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
	return ctx.measureText(text).width <= maxWidth;
}

function shrinkUntilFits(
	ctx: CanvasRenderingContext2D,
	text: string,
	startPx: number,
	minPx: number,
	maxWidth: number,
	weight = 700
) {
	let px = startPx;
	while (px > minPx) {
		setFont(ctx, px, weight, "Inter");
		if (fits(ctx, text, maxWidth)) return px;
		px -= 1;
	}
	setFont(ctx, minPx, weight, "Inter");
	return minPx;
}

// ----------------------
// “Table centered” layout (like your image)
// ----------------------

// Card center reference (tweak if your template needs)
const TABLE_CENTER_X = 960; // canvas center (1920/2)

// column gaps (tweak to match screenshot spacing)
const GAP_LABEL_TO_COLON = 90;
const GAP_COLON_TO_VALUE = 40;

// constrain value column so long IDs/names don't spill into design
const VALUE_MAX_WIDTH = 920; // adjust if you want tighter

function computeTableX(
	ctx: CanvasRenderingContext2D,
	labels: string[],
	values: string[]
) {
	// measure max label width at label font
	setFont(ctx, LABEL_PX, 700, "Inter");
	const maxLabelW = Math.max(...labels.map((t) => ctx.measureText(t).width));

	// colon width at label font
	const colonW = ctx.measureText(":").width;

	// measure max value width at value font but cap it
	setFont(ctx, VALUE_PX, 700, "Inter");
	const maxValueWRaw = Math.max(...values.map((t) => ctx.measureText(t).width));
	const maxValueW = Math.min(maxValueWRaw, VALUE_MAX_WIDTH);

	const tableW =
		maxLabelW + GAP_LABEL_TO_COLON + colonW + GAP_COLON_TO_VALUE + maxValueW;

	const labelX = TABLE_CENTER_X - tableW / 2;
	const colonX = labelX + maxLabelW + GAP_LABEL_TO_COLON;
	const valueX = colonX + colonW + GAP_COLON_TO_VALUE;

	return { labelX, colonX, valueX, maxValueW };
}

// ----------------------
// Name rules (your original intent, but constrained to value column)
// ----------------------
const NAME_FONT_BASE = 64; // short names
const NAME_FONT_REDUCED = 54; // medium names
const NAME_FONT_MIN = 36;
const NAME_LINE_HEIGHT_FACTOR = 1.15;

function splitIntoTwoLinesWithShrink(
	ctx: CanvasRenderingContext2D,
	full: string,
	startPx: number,
	minPx: number,
	maxWidth: number
) {
	if (!full.includes(" ")) return { ok: false as const };

	let px = startPx;

	while (px >= minPx) {
		setFont(ctx, px, 700, "Inter");

		const words = full.split(/\s+/);
		let first = "";
		let i = 0;

		for (; i < words.length; i++) {
			const test = first ? first + " " + words[i] : words[i];
			if (fits(ctx, test!, maxWidth)) first = test!;
			else break;
		}

		if (!first) {
			px -= 1;
			continue;
		}

		const second = words.slice(i).join(" ").trim();
		if (!second) return { ok: true as const, px, lines: [first] };

		if (fits(ctx, second, maxWidth)) {
			return { ok: true as const, px, lines: [first, second] };
		}

		px -= 1;
	}

	return { ok: false as const };
}

function drawNameValue(
	ctx: CanvasRenderingContext2D,
	name: string,
	valueX: number,
	baselineY: number,
	maxValueWidth: number
) {
	// NOTE: You already draw ":" separately in the table
	const value = name;

	// <= 17 chars: 64 (shrink if needed)
	if (value.length <= 17) {
		const px = shrinkUntilFits(
			ctx,
			value,
			NAME_FONT_BASE,
			NAME_FONT_MIN,
			maxValueWidth
		);
		setFont(ctx, px, 700, "Inter");
		ctx.fillText(value, valueX, baselineY);
		return;
	}

	// 18..30 chars: 54 (shrink if needed)
	if (value.length <= 30) {
		const px = shrinkUntilFits(
			ctx,
			value,
			NAME_FONT_REDUCED,
			NAME_FONT_MIN,
			maxValueWidth
		);
		setFont(ctx, px, 700, "Inter");
		ctx.fillText(value, valueX, baselineY);
		return;
	}

	// > 30: try 2 lines split; shrink to fit both
	const res = splitIntoTwoLinesWithShrink(
		ctx,
		value,
		NAME_FONT_REDUCED,
		NAME_FONT_MIN,
		maxValueWidth
	);

	if (res.ok) {
		const { px, lines } = res;
		setFont(ctx, px, 700, "Inter");

		const lineHeight = Math.round(px * NAME_LINE_HEIGHT_FACTOR);
		ctx.fillText(lines[0]!, valueX, baselineY);
		if (lines[1]) ctx.fillText(lines[1], valueX, baselineY + lineHeight);
		return;
	}

	// fallback: shrink single line
	const px = shrinkUntilFits(
		ctx,
		value,
		NAME_FONT_REDUCED,
		NAME_FONT_MIN,
		maxValueWidth
	);
	setFont(ctx, px, 700, "Inter");
	ctx.fillText(value, valueX, baselineY);
}

// generic value drawing (for VRKP ID / DOB / Reg Date)
function drawValue(
	ctx: CanvasRenderingContext2D,
	value: string,
	valueX: number,
	y: number,
	maxValueWidth: number
) {
	// shrink slightly if needed (IDs can be long)
	const px = shrinkUntilFits(ctx, value, VALUE_PX, 40, maxValueWidth);
	setFont(ctx, px, 700, "Inter");
	ctx.fillText(value, valueX, y);
}

// ----------------------

export async function POST(req: Request) {
	try {
		const body = (await req.json()) as Body;
		const { vrkpid, dob, createdAt, issuedAt } = body;
		let { name } = body;

		if (!vrkpid || !name || !dob || !createdAt || !issuedAt) {
			return NextResponse.json(
				{ error: "Missing parameters" },
				{ status: 400 }
			);
		}
		if (name.length > 50) name = name.slice(0, 50);

		// canvas
		const width = 1920;
		const height = 1080;
		const canvas = createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		// background
		const bgUrl =
			"https://pub-98a0b13dd37c4b7b84e18b52d9c03d5e.r2.dev/users/Effective%20Date%20%20(1).png";
		const bgImage = await loadImage(bgUrl);
		ctx.drawImage(bgImage, 0, 0, width, height);

		// text styles
		ctx.shadowColor = "transparent";
		ctx.shadowBlur = 0;
		ctx.fillStyle = "#0f172a";
		ctx.textAlign = "left";
		ctx.textBaseline = "alphabetic";

		// rows (like your screenshot)
		const labels = ["VRKP ID", "Name", "DOB", "Reg Date"];
		const values = [vrkpid, name, dob, createdAt];

		// compute single aligned table X positions
		const { labelX, colonX, valueX, maxValueW } = computeTableX(
			ctx as unknown as CanvasRenderingContext2D,
			labels,
			values
		);

		// row Y positions (you already had these)
		const y1 = 460;
		const y2 = 585;
		const y3 = 710;
		const y4 = 835;

		// draw label + colon column once per row, values in value column
		setFont(ctx as unknown as CanvasRenderingContext2D, LABEL_PX, 700, "Inter");

		// Row 1
		ctx.fillText("VRKP ID", labelX, y1);
		ctx.fillText(":", colonX, y1);
		drawValue(
			ctx as unknown as CanvasRenderingContext2D,
			vrkpid,
			valueX,
			y1,
			maxValueW
		);

		// Row 2 (Name with your smart wrapping)
		ctx.fillText("Name", labelX, y2);
		ctx.fillText(":", colonX, y2);
		drawNameValue(
			ctx as unknown as CanvasRenderingContext2D,
			name,
			valueX,
			y2,
			maxValueW
		);

		// Row 3
		ctx.fillText("DOB", labelX, y3);
		ctx.fillText(":", colonX, y3);
		drawValue(
			ctx as unknown as CanvasRenderingContext2D,
			dob,
			valueX,
			y3,
			maxValueW
		);

		// Row 4
		ctx.fillText("Reg Date", labelX, y4);
		ctx.fillText(":", colonX, y4);
		drawValue(
			ctx as unknown as CanvasRenderingContext2D,
			createdAt,
			valueX,
			y4,
			maxValueW
		);

		// rotated issued date (unchanged)
		ctx.save();
		ctx.translate(140, 960);
		ctx.rotate(-Math.PI / 2);
		setFont(
			ctx as unknown as CanvasRenderingContext2D,
			ISSUED_PX,
			700,
			"Inter"
		);
		ctx.fillText(`ISSUED DATE : ${issuedAt}`, 0, 0);
		ctx.restore();

		// PNG → WebP
		const webpBuffer = await sharp(canvas.toBuffer("image/png"))
			.webp({ quality: 85 })
			.toBuffer();

		return new NextResponse(new Uint8Array(webpBuffer), {
			status: 200,
			headers: {
				"Content-Type": "image/webp",
				"Content-Disposition": "inline; filename=vrkp-card.webp",
			},
		});
	} catch (err: any) {
		console.error("Error generating card:", err);
		return NextResponse.json(
			{ error: "Failed to generate card", detail: err?.message ?? String(err) },
			{ status: 500 }
		);
	}
}
