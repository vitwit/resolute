FROM ghcr.io/cosmos/simapp

COPY ./init_testnet.sh /

RUN chmod +x /init_testnet.sh

RUN apk update && apk add bash

EXPOSE 26656
EXPOSE 26657
EXPOSE 9090
EXPOSE 1317

ENTRYPOINT [ "/init_testnet.sh" ]

CMD [ "simd" ]
