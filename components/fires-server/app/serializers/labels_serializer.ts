import Label from '#models/label'
import markdown from '#utils/markdown'
import { DateTime } from 'luxon'
import { JSON_LD_CONTEXT, JsonLdDocument, ObjectType, XSDDateFormat } from '#utils/jsonld'
import { UrlService } from '#services/url_service'

export class LabelsSerializer {
  async collection(labels: Label[]): Promise<JsonLdDocument> {
    const latest = await Label.query()
      .select('id', 'updatedAt')
      .orderBy('updatedAt', 'desc')
      .first()

    const collectionId = UrlService.make('labels.index')

    return {
      '@context': JSON_LD_CONTEXT,
      'id': collectionId,
      'url': collectionId,
      'type': 'Collection',
      'summary': `Labels from ${UrlService.publicUrl}`,
      'updated': latest?.updatedAt.toFormat(XSDDateFormat),
      'totalItems': labels.length,
      'items': labels.map((label) => this.item(label, collectionId)),
    }
  }

  async singular(label: Label): Promise<JsonLdDocument> {
    const collectionId = UrlService.make('labels.index')

    return {
      '@context': JSON_LD_CONTEXT,
      ...this.item(label, collectionId),
    }
  }

  item(item: Label, collectionId: string): ObjectType {
    const id = UrlService.make('protocol.labels.show', { id: item.id })
    const url = UrlService.make('labels.show', { slug: item.slug })
    const baseObject: ObjectType = {
      id: id,
      url: url,
      type: 'Label',
      context: collectionId,
      created: item.createdAt.toFormat(XSDDateFormat),
      published: (item.updatedAt ?? item.createdAt).toFormat(XSDDateFormat),
    }

    if (item.updatedAt !== null) {
      baseObject.updated = item.updatedAt.toFormat(XSDDateFormat)
    }

    if (item.deprecatedAt && item.deprecatedAt < DateTime.now()) {
      baseObject['owl:deprecated'] = true
    }

    if (item.translations && item.translations.length > 0) {
      const object = {
        ...baseObject,
        nameMap: {
          [item.locale]: item.name,
        },
        summaryMap: {
          [item.locale]: item.summary ?? undefined,
        },
        contentMap: {
          [item.locale]: markdown.render(item.description),
        },
      }

      item.translations.forEach((translation) => {
        object.nameMap[translation.locale] = translation.name
        object.summaryMap[translation.locale] = translation.summary ?? item.summary ?? undefined
        object.contentMap[translation.locale] = markdown.render(
          translation.description ?? item.description
        )
      })

      return object
    }

    const object = {
      ...baseObject,
      name: item.name,
      summary: item.summary,
      description: markdown.render(item.description),
    }

    return object
  }
}
