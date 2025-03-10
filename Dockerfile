# syntax=docker/dockerfile:1.12

# Please see https://docs.docker.com/engine/reference/builder for information about
# the extended buildx capabilities used in this file.
# Make sure multiarch TARGETPLATFORM is available for interpolation
# See: https://docs.docker.com/build/building/multi-platform/
ARG TARGETPLATFORM=${TARGETPLATFORM}
ARG BUILDPLATFORM=${BUILDPLATFORM}
ARG BASE_REGISTRY="docker.io"

# # Node version to use in base image, change with [--build-arg NODE_VERSION="22.14.0"]
# renovate: datasource=node-version depName=node
ARG NODE_VERSION="22.14.0"
ARG DISTRO_VERSION="3.21"

# Node image to use for base image based on combined variables (ex: 22.14.0-alpine3.21)
FROM ${BASE_REGISTRY}/node:${NODE_VERSION}-alpine${DISTRO_VERSION} AS node

# Resulting version string is vX.X.X-FIRES_VERSION_PRERELEASE+FIRES_VERSION_METADATA
# Example: v4.3.0-nightly.2023.11.09+pr-123456
# Overwrite existence of 'alpha.X' in version.json [--build-arg FIRES_VERSION_PRERELEASE="nightly.2023.11.09"]
ARG FIRES_VERSION_PRERELEASE=""
# Append build metadata or fork information to version.json [--build-arg FIRES_VERSION_METADATA="pr-123456"]
ARG FIRES_VERSION_METADATA=""
ARG SOURCE_COMMIT=""

# Timezone used by the Docker container and runtime, change with [--build-arg TZ=Europe/Berlin]
ARG TZ="Etc/UTC"
# Linux UID (user id) for the fires user, change with [--build-arg UID=1234]
ARG UID="991"
# Linux GID (group id) for the fires user, change with [--build-arg GID=1234]
ARG GID="991"

# Apply FIRES build options based on options above
ENV \
  # Apply FIRES version information
  FIRES_VERSION_PRERELEASE="${FIRES_VERSION_PRERELEASE}" \
  FIRES_VERSION_METADATA="${FIRES_VERSION_METADATA}" \
  SOURCE_COMMIT="${SOURCE_COMMIT}" \
  # Apply timezone
  TZ=${TZ}

ENV \
  # Configure the IP to bind to when serving traffic
  HOST="0.0.0.0" \
  # Use production settings for nodejs based tools
  NODE_ENV="production"

# Set default shell used for running commands
SHELL ["/bin/sh", "-o", "pipefail", "-o", "errexit", "-c"]

ARG TARGETPLATFORM

RUN echo "Target platform is $TARGETPLATFORM";

RUN \
  # Sets timezone
  echo "${TZ}" > /etc/localtime; \
  # Creates fires user/group and sets home directory
  addgroup -Sg "${GID}" fires; \
  adduser -S -u "${UID}" -h /opt/fires fires fires; \
  # Creates /fires symlink to /opt/fires
  ln -s /opt/fires /fires;

# Set /opt/mastodon as working directory
WORKDIR /opt/fires

# hadolint ignore=DL3008,DL3005
RUN \
  # Mount Apk cache directory from Docker buildx caches
  --mount=type=cache,id=apk-cache-${TARGETPLATFORM},target=/var/cache/apk/,sharing=locked \
  # Apk update & upgrade to check for security updates to Debian image
  apk update; \
  apk upgrade; \
  # Install curl and tini
  apk add \
  tini=0.19.0-r3 \
  tzdata=2025a-r0 \
  curl=8.12.1-r0 \
  jq=1.7.1-r0;

# Configure pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Create temporary build layer from base image
FROM node AS build
ARG TARGETPLATFORM
COPY . /opt/fires
WORKDIR /opt/fires

# Configure Corepack
RUN \
  corepack enable; \
  corepack prepare --activate;

# hadolint ignore=DL3059
RUN --mount=type=cache,id=pnpm-${TARGETPLATFORM},target=/pnpm/store pnpm install --filter !@fedimod/fires-docs --frozen-lockfile
# hadolint ignore=DL3059
RUN pnpm run --filter=@fedimod/fires-server -r build
# hadolint ignore=DL3059
RUN pnpm deploy --filter=@fedimod/fires-server --prod /fires-server-deploy

FROM node AS fires-server
COPY --from=build /opt/fires/components/fires-server/build /opt/fires/fires-server/
COPY --from=build /fires-server-deploy/pnpm-lock.yaml /fires-server-deploy/package.json /opt/fires/fires-server/
COPY --from=build /fires-server-deploy/node_modules /opt/fires/fires-server/node_modules/
WORKDIR /opt/fires/fires-server/
USER fires
EXPOSE 4444

# Set container tini as default entry point
ENTRYPOINT ["/sbin/tini", "--"]

LABEL org.opencontainers.image.description="FediMod FIRES Reference Server"
LABEL org.opencontainers.image.source=https://github.com/fedimod/fires
LABEL org.opencontainers.image.licenses=AGPL-3.0

CMD ["node", "bin/server.js"]
