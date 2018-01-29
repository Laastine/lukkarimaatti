package test

import scala.concurrent.duration._
import scala.util.Random
import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

class SearchTest extends Simulation {
  val httpProtocol = http
    .baseURL("https://lukkarimaatti.ltky.fi")

  def searchTerm() = Random.shuffle(List("olio-ohjelmointi", "tietokannat", "Finnish 1", "Chinese 1", "Crystallization", "System Modelling")).head

  val scn = scenario("search")
      .repeat(10, "Course search") {
        exec(http("Seach").get(s"/course/course?name=${searchTerm()}"))
      }

  setUp(scn.inject(rampUsers(4) over(60))).protocols(httpProtocol)
}
