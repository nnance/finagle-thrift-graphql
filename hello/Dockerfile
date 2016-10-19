FROM hseeberger/scala-sbt
RUN ["mkdir", "-p", "/hello/project"]
COPY ./project/build.properties /hello/project
COPY ./project/plugins.sbt /hello/project
RUN ["mkdir", "-p", "/hello/src"]
COPY ./src/* /hello/src
COPY build.sbt /hello
WORKDIR /hello
RUN ["sbt", "compile"]
ENTRYPOINT ["sbt", "run"]
