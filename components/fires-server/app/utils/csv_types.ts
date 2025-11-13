export type DomainSeverity = 'suspend' | 'silence' | 'noop'
export type DomainAllowRecord = {
  domain: string
}
export type DomainRetractionRecord = {
  domain: string
  comment: string
}
export type DomainBlockRecord = {
  domain: string
  severity: DomainSeverity
  reject_media?: boolean
  reject_reports?: boolean
  public_comment: string
  obfuscate: boolean
}
