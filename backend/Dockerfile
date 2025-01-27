FROM openjdk:21-slim
RUN apt-get update && apt-get install -y maven
WORKDIR /app
COPY . .
RUN mvn clean install 
EXPOSE 8080
ENTRYPOINT [ "java","-jar" ,"/app/target/backend-0.0.1-SNAPSHOT.jar"]