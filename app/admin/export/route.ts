import { isAdmin } from "@/lib/server/admin-auth";
import { waitlist } from "@/lib/server/db";
import { STATUS_LABEL, USE_LABEL, type WaitStatus } from "@/lib/waitlist";

/** Spreadsheet apps run cells starting with = + - @ as formulas; signups are untrusted text. */
function cell(value: string) {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });

  const status = new URL(request.url).searchParams.get("status");
  const filter = status && status in STATUS_LABEL ? { status: status as WaitStatus } : {};
  const docs = await (await waitlist()).find(filter).sort({ createdAt: 1 }).toArray();

  const lines = [["نام", "ایمیل", "X", "کاربرد", "وضعیت", "تاریخ ثبت‌نام", "تاریخ دعوت", "ref"].map(cell).join(",")];
  for (const d of docs) {
    lines.push(
      [
        d.name,
        d.email,
        /^\d+$/.test(d.x) ? d.x : `@${d.x}`,
        d.use ? (USE_LABEL[d.use] ?? d.use) : "",
        STATUS_LABEL[d.status],
        d.createdAt.toISOString(),
        d.invitedAt?.toISOString() ?? "",
        d.ref ?? "",
      ]
        .map(cell)
        .join(","),
    );
  }

  // BOM so Excel reads the Persian text as UTF-8
  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="waitlist-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
