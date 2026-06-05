"use client";

import {
    Fragment,
    useLayoutEffect,
    useRef,
    type ClipboardEvent,
    type KeyboardEvent,
} from "react";

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
 * prefix (no gaps): typing auto-advances, Backspace walks back, and a paste
 * fills the row from the start. Numeric only; surfaces
 * `autocomplete="one-time-code"` on the first cell so platforms can autofill.
 *
 * Focus is applied *after* React commits the new value (via a layout effect),
 * never synchronously inside an input handler — doing it synchronously raced
 * the controlled re-render and dropped the final digit / broke paste.
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

    // Handlers stash the cell to focus here; the layout effect applies it once
    // the new value has rendered. `null` means "leave focus alone".
    const focusTarget = useRef<number | null>(autoFocus ? 0 : null);

    const moveFocus = (i: number) => {
        const el = inputs.current[Math.max(0, Math.min(i, length - 1))];
        el?.focus();
        el?.select();
    };

    useLayoutEffect(() => {
        if (focusTarget.current == null) return;
        const target = focusTarget.current;
        focusTarget.current = null;
        moveFocus(target);
    });

    // A rejected code clears the row; send the caret back to the first cell so
    // re-entry is immediate (no extra click after the shake).
    useLayoutEffect(() => {
        if (status === "error") {
            inputs.current[0]?.focus();
            inputs.current[0]?.select();
        }
    }, [status]);

    /**
     * Contiguous write: clamp the start to the current length so we never leave
     * a gap in the prefix, then emit. Used for typing, fast typing, and paste.
     */
    const writeAt = (start: number, raw: string) => {
        const digits = raw.replace(/\D/g, "");
        if (!digits) return;
        const arr = value.split("");
        let i = Math.min(start, arr.length);
        for (const d of digits) {
            if (i >= length) break;
            arr[i] = d;
            i += 1;
        }
        const next = arr.join("").replace(/\D/g, "").slice(0, length);
        onChange(next);
        if (next.length === length) onComplete?.(next);
        focusTarget.current = i; // first empty cell (clamped on apply)
    };

    const handleInput = (index: number, raw: string) => {
        // Deletions arrive here with an empty string; handle them in keydown.
        if (!raw) return;
        writeAt(index, raw);
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            if (value[index]) {
                const next = value.slice(0, index) + value.slice(index + 1);
                onChange(next);
                focusTarget.current = index;
            } else {
                const prev = Math.max(0, index - 1);
                onChange(value.slice(0, prev) + value.slice(prev + 1));
                focusTarget.current = prev;
            }
        } else if (e.key === "ArrowLeft") {
            // No value change → no re-render → focus directly (no race).
            e.preventDefault();
            moveFocus(index - 1);
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            moveFocus(Math.min(index + 1, value.length));
        }
    };

    const handlePaste = (index: number, e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        writeAt(index, e.clipboardData.getData("text"));
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
                        onFocus={(e) => e.currentTarget.select()}
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
