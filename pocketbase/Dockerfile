# PocketBase backend pre Rodinný Jedálniček.
# Buildni a nasadi v Coolify ako "Dockerfile" service, s perzistentným
# volume namapovaným na /pb/pb_data (databáza + nahrané súbory).

FROM alpine:3.20

# Skontroluj https://github.com/pocketbase/pocketbase/releases pre najnovšiu
# verziu a pripadne pri buildе v Coolify predaj cez "Build Arg" PB_VERSION.
ARG PB_VERSION=0.25.9
ARG TARGETARCH=amd64

RUN apk add --no-cache unzip ca-certificates

WORKDIR /pb

RUN wget "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_${TARGETARCH}.zip" -O /tmp/pb.zip \
    && unzip /tmp/pb.zip -d /pb \
    && rm /tmp/pb.zip \
    && chmod +x /pb/pocketbase

# Migrácie (schéma) a hooky (seed dát + AI proxy) sa aplikujú automaticky
# pri štarte PocketBase serveru.
COPY pb_migrations /pb/pb_migrations
COPY pb_hooks /pb/pb_hooks

EXPOSE 8090

VOLUME ["/pb/pb_data"]

CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090"]
