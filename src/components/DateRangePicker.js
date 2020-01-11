import React, { useRef, useState } from 'react'
import { func, instanceOf, object, objectOf, string } from 'prop-types'
import { addDays, subDays } from 'date-fns'
import isSelectable from './isSelectable'
import useDateInput from './useDateInput'
import useOutsideClickHandler from './useOutsideClickHandler'
import useDetectTouch from './useDetectTouch'
import DateRangePickerCalendar from './DateRangePickerCalendar'
import Popover from './Popover'

export default function DateRangePicker({
  children,
  startDate,
  endDate,
  format,
  locale,
  maximumDate,
  minimumDate,
  modifiers,
  modifiersClassNames,
  onStartDateChange,
  onEndDateChange
}) {
  const [month, setMonth] = useState(new Date())
  const [focus, setFocus] = useState()
  const isTouch = useDetectTouch()
  const startDateInputRef = useRef()
  const endDateInputRef = useRef()

  const containerRef = useOutsideClickHandler(() => {
    setFocus(null)
  })

  const [startDateInputProps, updateStartDateInputValue] = useDateInput({
    date: startDate,
    format,
    locale,
    maximumDate,
    minimumDate,
    onDateChange: date => {
      onStartDateChange(date)
      date && setMonth(date)
    },
    validate: date => isSelectable(date, { maximumDate: subDays(endDate, 1) })
  })

  const [endDateInputProps, updateEndDateInputValue] = useDateInput({
    date: endDate,
    format,
    locale,
    maximumDate,
    minimumDate,
    onDateChange: date => {
      onEndDateChange(date)
      date && setMonth(date)
    },
    validate: date => isSelectable(date, { minimumDate: addDays(startDate, 1) })
  })

  const handleStartDateChange = date => {
    onStartDateChange(date)
    updateStartDateInputValue(date)
  }

  const handleEndDateChange = date => {
    onEndDateChange(date)
    updateEndDateInputValue(date)
  }

  return (
    <div className='nice-dates' ref={containerRef}>
      {children({
        startDateInputProps: {
          ...startDateInputProps,
          onFocus: () => {
            setFocus('startDate')

            if (isTouch) {
              startDateInputRef.current.blur()
            }
          },
          ref: startDateInputRef,
          readOnly: isTouch
        },
        endDateInputProps: {
          ...endDateInputProps,
          onFocus: () => {
            setFocus('endDate')

            if (isTouch) {
              endDateInputRef.current.blur()
            }
          },
          ref: endDateInputRef,
          readOnly: isTouch
        },
        focus
      })}

      <Popover open={!!focus}>
        <DateRangePickerCalendar
          month={month}
          startDate={startDate}
          endDate={endDate}
          focus={focus}
          locale={locale}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          onMonthChange={setMonth}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          onFocusChange={setFocus}
        />
      </Popover>
    </div>
  )
}

DateRangePicker.propTypes = {
  startDate: instanceOf(Date),
  endDate: instanceOf(Date),
  children: func.isRequired,
  locale: object.isRequired,
  format: string,
  minimumDate: instanceOf(Date),
  maximumDate: instanceOf(Date),
  modifiers: objectOf(func),
  modifiersClassNames: objectOf(string),
  onStartDateChange: func,
  onEndDateChange: func
}

DateRangePicker.defaultProps = {
  onStartDateChange: () => {},
  onEndDateChange: () => {}
}