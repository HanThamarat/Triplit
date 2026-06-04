"use client";

import { Fragment, useEffect, useRef, type ClipboardEvent, type KeyboardEvent } from "react";

interface OtpInputProps {
    /** The current code, a contiguous prefix string of up to `length` digits. */
    value: string;
    onChange: (next: string) => void;
    /** Fired once when all `length` digits are present. */
    onComplete?: (code: string) => void;
    length?: number;
    status?: "idle" | "error" | "success";
    disabled?: boolean;
    autoFocus?: boolean;
    /** Accessible name for the group of cells, e.g. "Verification code". */
    groupLabel: string;
    /** Per-cell label with {index}/{total} placeholders, e.g. "Digit {index} of {total}". */
    digitLabel: string;
}

/**
 * Segmented one-time-code field. Entry is always a left-to-right contiguous
 * prefix (no gaps): focus snaps to the first empty cell, typing auto-advances,
 * Backspace walks back, and a full paste fills the row. Numeric only; surfaces
 * `autocomplete="one-time-code"` on the first cell so platforms can autofill.
 */
export default function OtpInput({
    value,
    onChange,
    onComplete,
    length = 6,
    status = "idle",
    disabled,
    autoFocus,
    groupLabel,
    digitLabel,
}: OtpInputProps) {
    const inputs = useRef<(HTMLInputElement | null)[]>([]);
    const cells = Array.from({ length }, (_, i) => value[i] ?? "");

    useEffect(() => {
        if (autoFocus) inputs.current[0]?.focus();
    }, [autoFocus]);

    // A rejected code clears the row; send the caret back to the first cell so
    // re-entry is immediate (no extra click after the shake).
    useEffect(() => {
        if (status === "error") inputs.current[0]?.focus();
    }, [status]);

    const focusCell = (i: number) => {
        const clamped = Math.max(0, Math.min(i, length - 1));
        const el = inputs.current[clamped];
        el?.focus();
        el?.select();
    };

    const emit = (raw: string) => {
        const clean = raw.replace(/\D/g, "").slice(0, length);
        onChange(clean);
        if (clean.length === length) onComplete?.(clean);
        return clean;
    };

    const writeFrom = (start: number, digits: string) => {
        const chars = value.split("");
        let i = start;
        for (const ch of digits) {
            if (i >= length) break;
            chars[i] = ch;
            i += 1;
        }
        emit(chars.join(""));
        focusCell(Math.min(i, length - 1));
    };

    const handleInput = (index: number, raw: string) => {
        const digits = raw.replace(/\D/g, "");
        if (!digits) return; // deletions are handled in keydown
        if (digits.length === 1) {
            const chars = value.split("");
            chars[index] = digits;
            emit(chars.join(""));
            focusCell(index + 1);
        } else {
            writeFrom(index, digits); // fast typing or a paste landing on input
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            if (value[index]) {
                const next = value.slice(0, index) + value.slice(index + 1);
                emit(next);
                focusCell(Math.min(index, next.length));
            } else {
                const prev = Math.max(0, index - 1);
                emit(value.slice(0, prev) + value.slice(prev + 1));
                focusCell(prev);
            }
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            focusCell(index - 1);
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            focusCell(Math.min(index + 1, value.length));
        }
    };

    const handlePaste = (index: number, e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text").replace(/\D/g, "");
        if (text) writeFrom(index, text);
    };

    return (
        <div
            role="group"
            aria-label={groupLabel}
            className="flex items-center gap-2 sm:gap-2.5"
        >
            {cells.map((char, i) => (
                <Fragment key={i}>
                    <input
                        ref={(el) => {
                            inputs.current[i] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete={i === 0 ? "one-time-code" : "off"}
                        maxLength={1}
                        disabled={disabled}
                        value={char}
                        aria-label={digitLabel
                            .replace("{index}", String(i + 1))
                            .replace("{total}", String(length))}
                        aria-invalid={status === "error" || undefined}
                        onChange={(e) => handleInput(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onPaste={(e) => handlePaste(i, e)}
                        onFocus={(e) => {
                            if (i > value.length) focusCell(value.length);
                            else e.target.select();
                        }}
                        className={`h-14 min-w-0 flex-1 rounded-xl border bg-canvas text-center font-serif text-2xl tabular-nums caret-coast-deep transition-[border-color,box-shadow,background-color,color] duration-150 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 sm:h-16 ${
                            status === "error"
                                ? "border-sunset-deep text-sunset-ink focus:border-sunset-deep focus:ring-sunset/30"
                                : status === "success"
                                ? "border-meadow bg-meadow/8 text-meadow-deep focus:ring-meadow/30"
                                : char
                                ? "border-line-strong text-ink focus:border-coast-deep focus:ring-coast/30"
                                : "border-line text-ink focus:border-coast-deep focus:ring-coast/30"
                        }`}
                    />
                    {/* Chunk the row 3 + 3 with a hairline divider. */}
                    {i === Math.floor(length / 2) - 1 && length % 2 === 0 && (
                        <span aria-hidden="true" className="h-px w-2.5 shrink-0 bg-line-strong" />
                    )}
                </Fragment>
            ))}
        </div>
    );
}
