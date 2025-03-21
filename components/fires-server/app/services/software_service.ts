import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { readFile } from 'node:fs/promises'

interface ServerMetadata {
  name: string
  slug: string
  version: string
  repository: string
  homepage: string
  source: {
    commit?: string
    url?: string
  }
}

export class SoftwareService {
  private metadata?: ServerMetadata

  async getMetadata() {
    if (this.metadata) {
      return this.metadata
    }

    const packageInfo = await readFile(app.makePath('package.json'), { encoding: 'utf-8' }).then(
      (text) => JSON.parse(text)
    )

    this.metadata = {
      name: 'FediMod FIRES',
      slug: 'fedimod-fires',
      version: this.buildVersion(packageInfo.version),
      repository: this.sourceRepository,
      homepage: packageInfo.homepage,
      source: {
        url: this.sourceUrl,
        commit: this.sourceCommit,
      },
    }

    return this.metadata
  }

  private buildVersion(packageInfoVersion: string) {
    const version = [packageInfoVersion]
    const prerelease = env.get('FIRES_VERSION_PRERELEASE')
    const buildMetadata = env.get('FIRES_VERSION_METADATA')

    if (prerelease) {
      version.push(`-${prerelease}`)
    }

    if (buildMetadata) {
      version.push(`+${buildMetadata}`)
    }

    return version.join('')
  }

  private get sourceRepository() {
    return env.get(
      'SOURCE_BASE_URL',
      `https://github.com/${env.get('SOURCE_REPOSITORY', 'fedimod/fires')}`
    )
  }

  private get sourceTag(): string | undefined {
    return env.get('SOURCE_TAG')
  }

  private get sourceCommit(): string | undefined {
    return env.get('SOURCE_COMMIT')
  }

  private get sourceUrl(): string {
    if (this.sourceTag) {
      return `${this.sourceRepository}/tree/${this.sourceTag}`
    } else {
      return this.sourceRepository
    }
  }
}
