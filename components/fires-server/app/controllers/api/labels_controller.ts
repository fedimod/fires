import type { HttpContext } from '@adonisjs/core/http'
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@foadonis/openapi/decorators'
import { getSchemaPath } from 'openapi-metadata'

import Label from '#models/label'
import { createLabelValidator, updateLabelValidator } from '#validators/label'
import { DateTime } from 'luxon'

export default class LabelsController {
  @ApiOperation({ summary: 'List all Posts' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        items: {
          $ref: getSchemaPath(Label),
        },
      },
    },
  })
  async index({ response }: HttpContext) {
    const labels = await Label.all()

    return response.json({
      items: labels.map((label) => label.serialize()),
    })
  }

  @ApiOperation({ summary: 'Create a new Label' })
  @ApiBody({ type: () => createLabelValidator })
  @ApiResponse({
    status: 201,
    schema: {
      type: 'object',
      properties: {
        label: {
          $ref: getSchemaPath(Label),
        },
      },
    },
  })
  async store({ request, response, i18n }: HttpContext) {
    const data = await request.validateUsing(createLabelValidator)
    const language = i18n.locale

    const label = await Label.create({
      ...data,
      language,
    })

    return response.created({ label: label.serialize() })
  }

  @ApiOperation({ summary: 'Updates a Label' })
  @ApiBody({ type: () => updateLabelValidator })
  @ApiParam({ type: 'string', name: 'id', example: '0195bff7-2580-775b-b01b-9abab1197d8c' })
  async update({ request, response, i18n }: HttpContext) {
    const { params, ...update } = await request.validateUsing(updateLabelValidator)
    const label = await Label.findOrFail(params.id)

    await label.merge({ ...update, language: i18n.locale }).save()

    return response.json(label.serialize())
  }

  @ApiOperation({ summary: 'Deletes or Deprecates a Label' })
  @ApiQuery({ name: 'force', type: 'boolean' })
  // @ApiResponse({ status: 200, type: Label })
  @ApiParam({ type: 'string', name: 'id', example: '0195bff7-2580-775b-b01b-9abab1197d8c' })
  async destroy({ params, request, response }: HttpContext) {
    const label = await Label.findOrFail(params.id)

    if (request.input('force') === 'true') {
      await label.delete()
      return response.noContent()
    }

    await label.merge({ deprecatedAt: DateTime.now() }).save()

    return response.json(label.serialize())
  }
}
