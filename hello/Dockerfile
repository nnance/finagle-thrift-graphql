FROM nightscape/docker-sbt
COPY ./project/build.properties /hello/project/
COPY ./project/plugins.sbt /hello/project/
COPY ./src/* /hello/src/
COPY build.sbt /hello/
WORKDIR /hello
RUN sbt compile
ENTRYPOINT sbt run
