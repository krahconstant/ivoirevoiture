import type React from "react"
import { useRef, type FormEvent } from "react"
import { Send, Loader2, ImageIcon, Paperclip, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ChatInputProps {
  onSubmit: (e: FormEvent) => void
  value: string
  onChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  isLoading?: boolean
}

export function ChatInput({ onSubmit, value, onChange, onKeyDown, isLoading }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  return (
    <div className="border-t p-4">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Écrivez votre message..."
              className="max-h-32 min-h-[40px] w-full resize-none rounded-lg border bg-background px-4 py-2 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              style={{ height: "40px" }}
              disabled={isLoading}
            />
            <div className="absolute bottom-2 right-2 flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted">
                      <Smile className="h-5 w-5 text-muted-foreground" />
                      <span className="sr-only">Ajouter un emoji</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Ajouter un emoji</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted">
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      <span className="sr-only">Ajouter une image</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Ajouter une image</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted">
                      <Paperclip className="h-5 w-5 text-muted-foreground" />
                      <span className="sr-only">Ajouter un fichier</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Ajouter un fichier</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <Button
            type="submit"
            size="icon"
            className="h-10 w-10 shrink-0 rounded-full"
            disabled={isLoading || !value.trim()}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </form>
    </div>
  )
}

