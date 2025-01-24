FROM openjdk:21-slim
RUN apt-get update && apt-get install -y maven
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean install
EXPOSE 8080
ENTRYPOINT ["java","-jar","/target/app.jar"]
