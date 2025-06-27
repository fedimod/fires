import router from '@adonisjs/core/services/router'

router.get('/health', ({ response }) => {
  return response.safeStatus(200).json({ ok: true })
})

// Protocol must be first as Web routes use :slug for the label path component,
// instead of :id, and the UUID matcher is more specific than the slug matcher.
import '#start/routes/protocol'
import '#start/routes/web'
import '#start/routes/api'
import '#start/routes/admin'
