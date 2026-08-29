import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { exportPoster } from "@/lib/exportPoster";
import { usePosterCommands } from "@/hooks/usePosterCommands";
import type { SandboxBridge } from "@/core/renderer";
import { useUiStore } from "@/stores/uiStore";

interface CommandPaletteProps {
  bridge: SandboxBridge | null;
}

export function CommandPalette({ bridge }: CommandPaletteProps) {
  const open = useUiStore((s) => s.commandPaletteOpen);
  const setOpen = useUiStore((s) => s.setCommandPaletteOpen);
  const commands = usePosterCommands((format) => void exportPoster(bridge, format));

  const groups = [...new Set(commands.map((c) => c.group))];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        {groups.map((group) => (
          <CommandGroup key={group} heading={group}>
            {commands
              .filter((c) => c.group === group)
              .map((cmd) => (
                <CommandItem key={cmd.id} onSelect={() => void cmd.run()}>
                  <span>{cmd.label}</span>
                  {cmd.shortcut && (
                    <span className="ml-auto text-xs text-muted-foreground">{cmd.shortcut}</span>
                  )}
                </CommandItem>
              ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
