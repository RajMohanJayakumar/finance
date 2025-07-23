import UnifiedNumberInput from './UnifiedNumberInput'
import CalculatorDropdown from './CalculatorDropdown'

export default function InputWithDropdown({
  label,
  inputValue,
  onInputChange,
  dropdownValue,
  onDropdownChange,
  inputProps = {},
  dropdownProps = {},
  icon,
  className = ""
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {icon && <span className="text-lg">{icon}</span>}
        {label}
      </label>
      
      <div className="grid grid-cols-2 gap-3 items-end">
        <UnifiedNumberInput
          value={inputValue}
          onChange={onInputChange}
          showControls={true}
          {...inputProps}
        />
        
        <CalculatorDropdown
          value={dropdownValue}
          onChange={onDropdownChange}
          {...dropdownProps}
        />
      </div>
    </div>
  )
}
