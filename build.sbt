name := """finagle-thrift-example"""

version := "0.1.0"

com.twitter.scrooge.ScroogeSBT.newSettings

scalariformSettings

resolvers ++= Seq(
  "twttr" at "http://maven.twttr.com/"
)

val finagleVersion = "6.14.0"

libraryDependencies ++= Seq(
  "com.twitter" %% "finagle-core" % finagleVersion,
  "com.twitter" %% "finagle-thrift" % finagleVersion,
  "com.twitter" %% "finagle-thriftmux" % finagleVersion,
  "com.twitter" %% "scrooge-core" % "3.16.3",
  "org.apache.thrift" % "libthrift" % "0.8.0",
  "org.scalatest" %% "scalatest" % "2.2.1" % "test"
)
