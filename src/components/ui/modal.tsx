import { X } from "lucide-react"
import { Dialog, DialogContent } from "../ui/dialog"
import { ReactElement } from "react"
import { cn } from "@/lib/utils"

interface modalProps {
    isOpen?: boolean
    onClose?: () => void
    body?: ReactElement
    footer?: ReactElement
    step?: number
    totalStep?: number
    isEdditing?: boolean
}

const Modal = ({isOpen, onClose, isEdditing, body, footer, step, totalStep}: modalProps) => {
    return (
    <div>
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className={cn("bg-black p-2", isEdditing && "overflow-x-hidden overflow-y-scroll")} >
            <div className="flex items-center gap-7">
              <button className="p-1 border-0 text-white hover:opacity-70 transition w-fit">
                <X size={28} onClick={onClose}/>
              </button>
              {step && totalStep && (
                <p className="text-xl font-bold">Step {step} of {totalStep}</p>
              )}
            </div>
            <div className="mt-4">{body}</div>
            {footer && <div>{footer}</div>}
          </DialogContent>
        </Dialog>
    </div>
  )
}

export default Modal