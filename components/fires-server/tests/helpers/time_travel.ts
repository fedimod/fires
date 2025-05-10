import { DateTime, DurationLike } from 'luxon'
import timekeeper from 'timekeeper'

export default {
  plus: (duration: DurationLike) => {
    timekeeper.travel(DateTime.now().plus(duration).toJSDate())
  },
  minus: (duration: DurationLike) => {
    timekeeper.travel(DateTime.now().minus(duration).toJSDate())
  },
}
