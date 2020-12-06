import { get } from 'lodash/fp'

export const getSlotText = get(['$slots', 'default', 0, 'text'])