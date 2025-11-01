export const XSDDateFormat = "yyyy-MM-dd'T'HH:mm:ss'Z'"

export const JSON_LD_CONTEXT = [
  'https://www.w3.org/ns/activitystreams',
  'https://fires.fedimod.org/ns/fires',
  {
    owl: 'http://www.w3.org/2002/07/owl#',
  },
]

export type ObjectType = {
  type: string
  id: string
  [key: string]: unknown
}

export type LocaleMapType = Record<string, string>

export type JsonLdDocument = {
  '@context': typeof JSON_LD_CONTEXT
} & ObjectType
