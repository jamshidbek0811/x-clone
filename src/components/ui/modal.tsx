import { X } from "lucide-react"
import { Dialog, DialogContent } from "../ui/dialog"
import { ReactElement } from "react"

interface modalProps {
    isOpen?: boolean
    onClose?: () => void
    body?: ReactElement
    footer?: ReactElement
    step?: number
    totalStep?: number
}

const Modal = ({isOpen, onClose, body, footer, step, totalStep}: modalProps) => {
    return (
    <div>
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="bg-black p-2">
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