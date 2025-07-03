import { Label } from '../../label'
import { Checkbox } from '../ui/base-checkbox'
import * as React from 'react'

type Props = {
  label: string
  checked?: boolean
  onCheckedChange?: () => void
  name?: string
  disabled?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputRef?: React.Ref<HTMLButtonElement>
}

export const CheckboxField = React.forwardRef<HTMLButtonElement, Props>(
  ({ label, checked, onCheckedChange, name, disabled, inputRef }, ref) => {
    return (
      <div className="flex items-center gap-2 border border-(--border-gray) rounded-md p-2 w-full">
        <Label className="w-full">
          <Checkbox
            className="border-black border-[2px] rounded-sm w-5 h-5"
            checked={checked}
            onCheckedChange={onCheckedChange}
            name={name}
            disabled={disabled}
            ref={inputRef || ref}
          />
          <span className="text-black">{label}</span>
        </Label>
      </div>
    )
  }
)
CheckboxField.displayName = 'CheckboxField'
