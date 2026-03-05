import { useCallback, useEffect, useRef, useState } from "react";

export type CropRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type CropCanvasProps = {
  imageUrl: string;
  imageDimensions: { width: number; height: number };
  cropRect: CropRect | null;
  onCropChange: (rect: CropRect | null) => void;
};

type DragState =
  | "idle"
  | "creating"
  | "moving"
  | "resizing-nw"
  | "resizing-ne"
  | "resizing-sw"
  | "resizing-se";

type DragInfo = {
  state: DragState;
  startX: number;
  startY: number;
  originRect: CropRect | null;
};

const HANDLE_SIZE = 10;
const HANDLE_HIT_RADIUS = 12;
const MIN_SELECTION = 10;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getNormalizedRect(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  maxW: number,
  maxH: number,
): CropRect {
  const x = clamp(Math.min(x1, x2), 0, maxW);
  const y = clamp(Math.min(y1, y2), 0, maxH);
  const width = clamp(Math.abs(x2 - x1), 0, maxW - x);
  const height = clamp(Math.abs(y2 - y1), 0, maxH - y);
  return { x, y, width, height };
}

function getCornerCursor(corner: DragState): string {
  switch (corner) {
    case "resizing-nw":
      return "nw-resize";
    case "resizing-ne":
      return "ne-resize";
    case "resizing-sw":
      return "sw-resize";
    case "resizing-se":
      return "se-resize";
    default:
      return "default";
  }
}

function getHoverCursor(
  mx: number,
  my: number,
  rect: CropRect | null,
): string {
  if (!rect) return "crosshair";

  const corners = [
    { x: rect.x, y: rect.y, cursor: "nw-resize" },
    { x: rect.x + rect.width, y: rect.y, cursor: "ne-resize" },
    { x: rect.x, y: rect.y + rect.height, cursor: "sw-resize" },
    { x: rect.x + rect.width, y: rect.y + rect.height, cursor: "se-resize" },
  ];

  for (const corner of corners) {
    const dx = mx - corner.x;
    const dy = my - corner.y;
    if (Math.sqrt(dx * dx + dy * dy) <= HANDLE_HIT_RADIUS) {
      return corner.cursor;
    }
  }

  if (
    mx >= rect.x &&
    mx <= rect.x + rect.width &&
    my >= rect.y &&
    my <= rect.y + rect.height
  ) {
    return "move";
  }

  return "crosshair";
}

function getCornerDragState(
  mx: number,
  my: number,
  rect: CropRect,
): DragState | null {
  const corners: Array<{ x: number; y: number; state: DragState }> = [
    { x: rect.x, y: rect.y, state: "resizing-nw" },
    { x: rect.x + rect.width, y: rect.y, state: "resizing-ne" },
    { x: rect.x, y: rect.y + rect.height, state: "resizing-sw" },
    { x: rect.x + rect.width, y: rect.y + rect.height, state: "resizing-se" },
  ];

  for (const corner of corners) {
    const dx = mx - corner.x;
    const dy = my - corner.y;
    if (Math.sqrt(dx * dx + dy * dy) <= HANDLE_HIT_RADIUS) {
      return corner.state;
    }
  }

  return null;
}

export function CropCanvas({
  imageUrl,
  imageDimensions,
  cropRect,
  onCropChange,
}: CropCanvasProps) {
  const [displaySize, setDisplaySize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const imgRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragInfo>({
    state: "idle",
    startX: 0,
    startY: 0,
    originRect: null,
  });
  const cursorRef = useRef<string>("crosshair");

  const getRelativePos = useCallback(
    (e: React.MouseEvent): { x: number; y: number } | null => {
      if (!overlayRef.current) return null;
      const rect = overlayRef.current.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    },
    [],
  );

  const updateDisplaySize = useCallback(() => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      setDisplaySize({ width: rect.width, height: rect.height });
    }
  }, []);

  // Handle already-cached images via polling until painted
  useEffect(() => {
    const checkImage = () => {
      if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
        const rect = imgRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setDisplaySize({ width: rect.width, height: rect.height });
          return;
        }
      }
      requestAnimationFrame(checkImage);
    };
    requestAnimationFrame(checkImage);
  }, [imageUrl]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      const pos = getRelativePos(e);
      if (!pos || !displaySize) return;

      const { x, y } = pos;

      if (cropRect) {
        const cornerState = getCornerDragState(x, y, cropRect);
        if (cornerState) {
          dragRef.current = {
            state: cornerState,
            startX: x,
            startY: y,
            originRect: { ...cropRect },
          };
          return;
        }

        if (
          x >= cropRect.x &&
          x <= cropRect.x + cropRect.width &&
          y >= cropRect.y &&
          y <= cropRect.y + cropRect.height
        ) {
          dragRef.current = {
            state: "moving",
            startX: x,
            startY: y,
            originRect: { ...cropRect },
          };
          return;
        }
      }

      dragRef.current = {
        state: "creating",
        startX: x,
        startY: y,
        originRect: null,
      };
    },
    [getRelativePos, cropRect, displaySize],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const pos = getRelativePos(e);
      if (!pos || !displaySize) return;

      const { x, y } = pos;
      const { width: dw, height: dh } = displaySize;
      const drag = dragRef.current;

      // Update cursor on hover (idle state)
      if (drag.state === "idle") {
        const newCursor = getHoverCursor(x, y, cropRect);
        if (cursorRef.current !== newCursor && overlayRef.current) {
          cursorRef.current = newCursor;
          overlayRef.current.style.cursor = newCursor;
        }
        return;
      }

      const dx = x - drag.startX;
      const dy = y - drag.startY;

      if (drag.state === "creating") {
        const rect = getNormalizedRect(drag.startX, drag.startY, x, y, dw, dh);
        onCropChange(rect);
        return;
      }

      if (!drag.originRect) return;
      const origin = drag.originRect;

      if (drag.state === "moving") {
        const newX = clamp(origin.x + dx, 0, dw - origin.width);
        const newY = clamp(origin.y + dy, 0, dh - origin.height);
        onCropChange({ ...origin, x: newX, y: newY });
        return;
      }

      // Resizing — move the dragged corner, keep the opposite corner fixed
      if (drag.state === "resizing-nw") {
        const fixedX = origin.x + origin.width;
        const fixedY = origin.y + origin.height;
        const newX = clamp(origin.x + dx, 0, fixedX);
        const newY = clamp(origin.y + dy, 0, fixedY);
        onCropChange({
          x: newX,
          y: newY,
          width: fixedX - newX,
          height: fixedY - newY,
        });
        return;
      }

      if (drag.state === "resizing-ne") {
        const fixedX = origin.x;
        const fixedY = origin.y + origin.height;
        const newRight = clamp(origin.x + origin.width + dx, fixedX, dw);
        const newY = clamp(origin.y + dy, 0, fixedY);
        onCropChange({
          x: fixedX,
          y: newY,
          width: newRight - fixedX,
          height: fixedY - newY,
        });
        return;
      }

      if (drag.state === "resizing-sw") {
        const fixedX = origin.x + origin.width;
        const fixedY = origin.y;
        const newX = clamp(origin.x + dx, 0, fixedX);
        const newBottom = clamp(origin.y + origin.height + dy, fixedY, dh);
        onCropChange({
          x: newX,
          y: fixedY,
          width: fixedX - newX,
          height: newBottom - fixedY,
        });
        return;
      }

      if (drag.state === "resizing-se") {
        const fixedX = origin.x;
        const fixedY = origin.y;
        const newRight = clamp(origin.x + origin.width + dx, fixedX, dw);
        const newBottom = clamp(origin.y + origin.height + dy, fixedY, dh);
        onCropChange({
          x: fixedX,
          y: fixedY,
          width: newRight - fixedX,
          height: newBottom - fixedY,
        });
      }
    },
    [getRelativePos, displaySize, cropRect, onCropChange],
  );

  const handleMouseUp = useCallback(() => {
    const drag = dragRef.current;
    dragRef.current = { state: "idle", startX: 0, startY: 0, originRect: null };

    if (drag.state === "idle") return;

    // Clear selection if it's too small
    if (
      cropRect &&
      (cropRect.width < MIN_SELECTION || cropRect.height < MIN_SELECTION)
    ) {
      onCropChange(null);
    }
  }, [cropRect, onCropChange]);

  const handleMouseLeave = useCallback(() => {
    const drag = dragRef.current;
    if (drag.state !== "idle") {
      // Finalize the drag when mouse leaves
      dragRef.current = {
        state: "idle",
        startX: 0,
        startY: 0,
        originRect: null,
      };
      if (
        cropRect &&
        (cropRect.width < MIN_SELECTION || cropRect.height < MIN_SELECTION)
      ) {
        onCropChange(null);
      }
    }
    if (overlayRef.current) {
      overlayRef.current.style.cursor = "crosshair";
      cursorRef.current = "crosshair";
    }
  }, [cropRect, onCropChange]);

  const scale =
    displaySize && displaySize.width > 0
      ? imageDimensions.width / displaySize.width
      : 1;

  const origW = cropRect ? Math.round(cropRect.width * scale) : 0;
  const origH = cropRect ? Math.round(cropRect.height * scale) : 0;

  // Position the dimension label below the selection, or above if near bottom
  const labelBelow =
    displaySize && cropRect
      ? cropRect.y + cropRect.height + 28 < displaySize.height
      : true;

  return (
    <div className="flex w-full select-none items-center justify-center overflow-hidden rounded-lg bg-gray-900">
      <div className="relative inline-block">
      {/* Image */}
      <img
        ref={imgRef}
        src={imageUrl}
        alt="Crop preview"
        className="block max-h-[600px] max-w-full"
        onLoad={updateDisplaySize}
        draggable={false}
      />

      {/* Interaction + rendering overlay — covers exactly the image */}
      {displaySize && (
        <div
          ref={overlayRef}
          className="absolute inset-0"
          style={{ cursor: "crosshair" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {cropRect && (
            <>
              {/* Dark overlay — 4 strips around the selection */}
              {/* Top strip */}
              <div
                className="pointer-events-none absolute bg-black/50"
                style={{
                  top: 0,
                  left: 0,
                  right: 0,
                  height: cropRect.y,
                }}
              />
              {/* Bottom strip */}
              <div
                className="pointer-events-none absolute bg-black/50"
                style={{
                  top: cropRect.y + cropRect.height,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
              {/* Left strip (between top and bottom strips) */}
              <div
                className="pointer-events-none absolute bg-black/50"
                style={{
                  top: cropRect.y,
                  left: 0,
                  width: cropRect.x,
                  height: cropRect.height,
                }}
              />
              {/* Right strip (between top and bottom strips) */}
              <div
                className="pointer-events-none absolute bg-black/50"
                style={{
                  top: cropRect.y,
                  left: cropRect.x + cropRect.width,
                  right: 0,
                  height: cropRect.height,
                }}
              />

              {/* Selection border */}
              <div
                className="pointer-events-none absolute border-2 border-white border-dashed"
                style={{
                  left: cropRect.x,
                  top: cropRect.y,
                  width: cropRect.width,
                  height: cropRect.height,
                }}
              />

              {/* Corner handles */}
              {(
                [
                  {
                    x: cropRect.x,
                    y: cropRect.y,
                    state: "resizing-nw" as DragState,
                  },
                  {
                    x: cropRect.x + cropRect.width,
                    y: cropRect.y,
                    state: "resizing-ne" as DragState,
                  },
                  {
                    x: cropRect.x,
                    y: cropRect.y + cropRect.height,
                    state: "resizing-sw" as DragState,
                  },
                  {
                    x: cropRect.x + cropRect.width,
                    y: cropRect.y + cropRect.height,
                    state: "resizing-se" as DragState,
                  },
                ] as const
              ).map((handle) => (
                <div
                  key={handle.state}
                  className="absolute border border-gray-400 bg-white"
                  style={{
                    left: handle.x - HANDLE_SIZE / 2,
                    top: handle.y - HANDLE_SIZE / 2,
                    width: HANDLE_SIZE,
                    height: HANDLE_SIZE,
                    cursor: getCornerCursor(handle.state),
                  }}
                />
              ))}

              {/* Dimension label */}
              <div
                className="pointer-events-none absolute rounded bg-black/75 px-2 py-1 text-white text-xs"
                style={
                  labelBelow
                    ? {
                        left: cropRect.x,
                        top: cropRect.y + cropRect.height + 6,
                      }
                    : {
                        left: cropRect.x,
                        top: cropRect.y - 28,
                      }
                }
              >
                {origW} &times; {origH}
              </div>
            </>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
