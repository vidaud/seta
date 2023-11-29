# Shared by all stages
ARG ROOT=/home/seta

# ******************************* #
# ! Stage 1 - Build the bundle    #
# ******************************* #

FROM node:18-slim as build

RUN echo "Acquire::http::Proxy \""$HTTP_PROXY"\";" >> /etc/apt/apt.conf
RUN echo "Acquire::https::Proxy \""$HTTPS_PROXY"\";" >> /etc/apt/apt.conf

ENV https_proxy=$HTTPS_PROXY
ENV http_proxy=$HTTP_PROXY

ENV HTTPS_PROXY=$HTTPS_PROXY
ENV HTTP_PROXY=$HTTP_PROXY

# Use the shared ROOT value
ARG ROOT

# Activate corepack to enable PNPM
RUN corepack enable

# Run as non-root user
USER node

# Set the working directory and change the owner
WORKDIR $ROOT
RUN chown -R node:node $ROOT

# Copy minimal files and install dependencies
COPY --chown=node:node package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the source code
COPY --chown=node:node . .

# Build the bundle
RUN pnpm build

# *************************************** #
# ! Stage 2 - Create the release image    #
# *************************************** #

FROM nginx:alpine as release

# Use the shared ROOT value
ARG ROOT

# Copy the build output
COPY --from=build $ROOT/build /usr/share/nginx/html

# Copy the nginx configuration
COPY --from=build $ROOT/docker/nginx-default.conf /etc/nginx/conf.d/default.conf

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
