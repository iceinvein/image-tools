import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { useNavigate } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { allTools } from "@/config/tools";
import { useToolImageTransfer } from "@/provider";

type ToolOutputActionsProps = {
  currentToolKey: string;
  fileName: string;
  mimeType: string;
  getBlob: () => Promise<Blob>;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow";
  className?: string;
};

function supportsMimeType(
  acceptedFormats: string[] | undefined,
  mimeType: string,
) {
  return acceptedFormats?.includes(mimeType) ?? false;
}

export function ToolOutputActions({
  currentToolKey,
  fileName,
  mimeType,
  getBlob,
  size = "lg",
  variant = "bordered",
  className,
}: ToolOutputActionsProps) {
  const navigate = useNavigate();
  const { stageImageTransfer } = useToolImageTransfer();
  const [isRouting, setIsRouting] = useState(false);

  const availableTools = useMemo(
    () =>
      allTools.filter(
        (tool) =>
          tool.acceptsImageTransfer &&
          tool.key !== currentToolKey &&
          supportsMimeType(tool.acceptedFormats, mimeType),
      ),
    [currentToolKey, mimeType],
  );

  if (availableTools.length === 0) {
    return null;
  }

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button
          size={size}
          variant={variant}
          isDisabled={isRouting}
          isLoading={isRouting}
          endContent={
            !isRouting ? <ChevronDown className="h-4 w-4" /> : undefined
          }
          className={className}
        >
          Do more
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Continue editing with another tool"
        onAction={async (key) => {
          const selectedTool = availableTools.find((tool) => tool.key === key);
          if (!selectedTool) return;

          setIsRouting(true);

          try {
            const blob = await getBlob();
            const nextFile = new File([blob], fileName, {
              type: mimeType || blob.type || "image/png",
              lastModified: Date.now(),
            });

            stageImageTransfer(nextFile);
            await navigate({ to: selectedTool.path });
          } finally {
            setIsRouting(false);
          }
        }}
      >
        {availableTools.map((tool) => {
          const Icon = tool.icon;

          return (
            <DropdownItem
              key={tool.key}
              description={tool.hint}
              startContent={<Icon className="h-4 w-4" />}
            >
              {tool.label}
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </Dropdown>
  );
}
